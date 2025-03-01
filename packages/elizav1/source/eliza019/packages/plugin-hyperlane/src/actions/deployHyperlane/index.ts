import {
    Action,
    ActionExample,
    composeContext,
    elizaLogger,
    generateObjectDeprecated,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
} from "@elizaos/core";
import { buildArtifact as coreBuildArtifact } from "@hyperlane-xyz/core/buildArtifact.js";
import { chainMetadata, GithubRegistry } from "@hyperlane-xyz/registry";
import {
    buildAgentConfig,
    ChainMap,
    ChainMetadata,
    ChainMetadataSchema,
    ContractVerifier,
    CoreConfigSchema,
    EvmCoreModule,
    ExplorerLicenseType,
    HyperlaneCore,
    HyperlaneDeploymentArtifacts,
    IsmType,
    MultiProvider,
    OwnableConfig,
} from "@hyperlane-xyz/sdk";
import { ProtocolType } from "@hyperlane-xyz/utils";
import { ethers } from "ethers";
import { stringify as yamlStringify } from "yaml";
import { readYamlOrJson, writeYamlOrJson } from "../../utils/configOps";
import { MINIMUM_CORE_DEPLOY_GAS } from "../../utils/consts";
import {
    AGENT_CONFIG_FILE,
    CORE_CONFIG_FILE,
    createConfigFilePath,
} from "../core/consts";
import { CommandContext, WriteCommandContext } from "../core/context";
import {
    completeDeploy,
    filterAddresses,
    getStartBlocks,
    handleMissingInterchainGasPaymaster,
    prepareDeploy,
    privateKeyToSigner,
    requestAndSaveApiKeys,
    runDeployPlanStep,
    runPreflightChecksForChains,
    validateAgentConfig,
} from "../core/utils";
import type { HyperlaneDeployParams } from "../deployWarpRoute/types";
import { RelayerRunner } from "./relayerRunner";
import { ValidatorRunner } from "./ValidatorRunner";
import {
    addBlockExplorerConfig,
    addBlockOrGasConfig,
    addNativeTokenConfig,
    createMultisignConfig,
    createMerkleTreeConfig,
} from "../core/config";

const registry = new GithubRegistry();

//Initialize the chain congig
export async function createChainConfig({
    runtime,
}: {
    runtime: IAgentRuntime;
}) {
    elizaLogger.log("Creating chain config...");
    const chainName: any = runtime.getSetting("CHAIN_NAME");
    const chainId: any = runtime.getSetting("CHAIN_ID");
    const rpcUrl: any = runtime.getSetting("RPC_URL");
    const isTestnet = runtime.getSetting("IS_TESTNET") === "true";
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    const metadata: ChainMetadata = {
        name: chainName,
        displayName: chainName,
        chainId,
        domainId: chainId,
        protocol: ProtocolType.Ethereum,
        rpcUrls: [{ http: rpcUrl }],
        isTestnet,
    };

    await addBlockExplorerConfig(runtime, metadata);
    await addBlockOrGasConfig(runtime, metadata);
    await addNativeTokenConfig(runtime, metadata);

    const parseResult = ChainMetadataSchema.safeParse(metadata);

    if (parseResult.success) {
        const metadataYaml = yamlStringify(metadata, {
            indent: 2,
            sortMapEntries: true,
        });

        await registry.updateChain({ chainName: metadata.name, metadata });
    } else {
        elizaLogger.error("Error in creating chain metadata");
        throw new Error("Error in creating chain metadata");
    }
}

//initialize the chain
async function InitializeDeployment({
    context,
    configFilePath,
}: {
    context: CommandContext;
    configFilePath: string;
}) {
    elizaLogger.log("Initializing deployment...");

    const defaultIsm = createMultisignConfig(IsmType.MERKLE_ROOT_MULTISIG);
    const defaultHook = await createMerkleTreeConfig();
    const requiredHook = await createMerkleTreeConfig();
    const owner = context.signerAddress;

    const proxyAdmin: OwnableConfig = {
        owner,
    };

    try {
        const coreConfig = CoreConfigSchema.parse({
            owner,
            defaultIsm,
            defaultHook,
            requiredHook,
            proxyAdmin,
        });

        writeYamlOrJson(configFilePath, coreConfig, "yaml");
        elizaLogger.log("Core config created");
    } catch (e) {
        console.log(e);
        throw new Error("Error in creating core config");
    }
}

//deploy the contracts for the chain
async function runCoreDeploy(params: HyperlaneDeployParams) {
    const { context, config } = params;

    let chain = params.chain;
    let apiKeys = await requestAndSaveApiKeys([chain], chainMetadata, registry);
    const multiProvider = new MultiProvider(chainMetadata);
    const signer = multiProvider.getSigner(chain);
    const deploymentParams: HyperlaneDeployParams = {
        context: { ...context, signer },
        chain,
        config,
    };

    const userAddress = await signer.getAddress();
    const initialBalances = await prepareDeploy(context, userAddress, [chain]);

    await runDeployPlanStep(deploymentParams);

    await runPreflightChecksForChains({
        ...deploymentParams,
        chains: [chain],
        minGas: MINIMUM_CORE_DEPLOY_GAS,
    });

    const contractVerifier = new ContractVerifier(
        multiProvider,
        apiKeys,
        coreBuildArtifact,
        ExplorerLicenseType.MIT
    );

    elizaLogger.log("Deploying Core...");

    const evmCoreModule = await EvmCoreModule.create({
        chain,
        config,
        multiProvider,
        contractVerifier,
    });

    await completeDeploy(context, initialBalances, userAddress, [chain]);

    const deployedAddreses = evmCoreModule.serialize();

    await registry.updateChain({
        chainName: chain,
        addresses: deployedAddreses,
    });

    elizaLogger.log("Deployed Core! at " + deployedAddreses);
}

//create Agent Configs
async function createAgentConfigs({
    context,
    chains,
    out,
}: {
    context: CommandContext;
    chains?: string[];
    out: string;
}) {
    const { multiProvider, registry, chainMetadata, skipConfirmation } =
        context;
    const addresses = await registry.getAddresses();

    const chainAddresses = filterAddresses(addresses, chains);
    if (!chainAddresses) {
        elizaLogger.error("No chain addresses found");
        throw new Error("No chain addresses found");
    }

    const core = HyperlaneCore.fromAddressesMap(chainAddresses, multiProvider);

    const startBlocks = await getStartBlocks(
        chainAddresses,
        core,
        chainMetadata
    );

    await handleMissingInterchainGasPaymaster(chainAddresses);

    const agentConfig = buildAgentConfig(
        Object.keys(chainAddresses),
        multiProvider,
        chainAddresses as ChainMap<HyperlaneDeploymentArtifacts>,
        startBlocks
    );

    await validateAgentConfig(agentConfig);

    elizaLogger.log(`\nWriting agent config to file ${out}`);

    writeYamlOrJson(out, agentConfig, "json");

    elizaLogger.log(`Agent config written to ${out}`);
}

export const setUpAgentOnHyperlane: Action = {
    name: "DEPLOY_CHAIN",
    similes: [
        "DEPLOY_CHAIN_ON_HYPERLANE",
        "SETUP_AGENT_ON_HYPERLANE",
        "SETUP_AGENT",
    ],
    description: "This action is used to deploy Hyperlane on a chain",
    validate: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ): Promise<boolean> => {
        const signerPrivateKey = runtime.getSetting("HYPERLANE_PRIVATE_KEY");
        if (!signerPrivateKey) {
            return Promise.resolve(false);
        }

        const signer = privateKeyToSigner(signerPrivateKey);

        const signerAddress = runtime.getSetting(
            "HYPERLANE_ADDRESS"
        ) as `0x${string}`;
        if (!signerAddress || (await signer.getAddress()) !== signerAddress) {
            return Promise.resolve(false);
        }

        const chainName = runtime.getSetting("CHAIN_NAME");
        if (!chainName) {
            Promise.resolve(false);
        }

        return Promise.resolve(true);
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        options?: {
            [key: string]: unknown;
        },
        callback?: HandlerCallback
    ) => {
        try {
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }

            const hyperlaneContext = composeContext({
                state,
                template: "", // TODO: Add template
            });
            const content = await generateObjectDeprecated({
                runtime,
                context: hyperlaneContext,
                modelClass: ModelClass.LARGE,
            });

            const registry = new GithubRegistry();

            const signerPrivateKey = runtime.getSetting(
                "HYPERLANE_PRIVATE_KEY"
            );
            if (!signerPrivateKey) {
                throw new Error("Signer private key not found");
            }

            const signer = privateKeyToSigner(signerPrivateKey);

            const signerAddress = runtime.getSetting(
                "HYPERLANE_ADDRESS"
            ) as `0x${string}`;
            if (
                !signerAddress ||
                (await signer.getAddress()) !== signerAddress
            ) {
                throw new Error("Signer address not found");
            }

            const chainName = runtime.getSetting("CHAIN_NAME");
            if (!chainName) {
                throw new Error("Chain name not found");
            }

            const context: WriteCommandContext = {
                registry: registry,
                multiProvider: new MultiProvider(chainMetadata),
                skipConfirmation: true,
                signerAddress: signerAddress,
                key: signerPrivateKey,
                chainMetadata,
                signer,
            };

            //@ts-ignore
            createConfigFilePath(runtime.getSetting("CHAIN_NAME"));
            //@ts-ignore
            createAgentConfigFilePath(runtime.getSetting("CHAIN_NAME"));

            await createChainConfig({ runtime });
            await InitializeDeployment({
                context,
                configFilePath: CORE_CONFIG_FILE,
            });

            await runCoreDeploy({
                context,
                config: readYamlOrJson(CORE_CONFIG_FILE),
                chain: chainName,
            });

            await createAgentConfigs({
                context,
                out: AGENT_CONFIG_FILE,
            });

            const validator = new ValidatorRunner(
                chainName,
                signerPrivateKey,
                AGENT_CONFIG_FILE
            );

            await validator.run();

            const relayer = new RelayerRunner(
                [],
                //@ts-ignore
                signerPrivateKey,
                AGENT_CONFIG_FILE,
                chainName
            );

            relayer.run();

            if (callback) {
                callback({
                    text: "Successfully deployed chain on Hyperlane",
                });
            }
        } catch (error) {
            elizaLogger.log(
                "Error in sendCrossChainMessage handler",
                error.message
            );

            if (callback) {
                callback({
                    text: "Error in sendCrossChainMessage handler",
                });
            }

            return Promise.resolve(false);
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send a message from Ethereum to Polygon",
                    options: {
                        sourceChain: "ethereum",
                        targetChain: "polygon",
                        recipientAddress: "0x1234...",
                        message: "Hello Cross Chain!",
                    },
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll send your message across chains.",
                    action: "SEND_CROSS_CHAIN_MESSAGE",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Successfully sent message across chains. Transaction hash: 0xabcd...",
                },
            },
        ],
    ] as ActionExample[][],
};
