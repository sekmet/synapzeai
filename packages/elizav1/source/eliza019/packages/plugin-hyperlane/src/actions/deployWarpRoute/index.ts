import type {
    DeployedOwnableConfig,
    IsmConfig,
    WarpCoreConfig,
    WarpRouteDeployConfig,
} from "@hyperlane-xyz/sdk";
import { TokenFactories } from "@hyperlane-xyz/sdk";

import { AddWarpRouteOptions } from "@hyperlane-xyz/registry";
import {
    HypERC20Deployer,
    HyperlaneContractsMap,
    TokenType,
    WarpRouteDeployConfigSchema,
} from "@hyperlane-xyz/sdk";
import { ProtocolType } from "@hyperlane-xyz/utils";
import { writeYamlOrJson } from "../../utils/configOps";
import { CommandContext, WriteCommandContext } from "../core/context";
import {
    prepareDeploy,
    requestAndSaveApiKeys,
    runPreflightChecksForChains,
} from "../core/utils";
import {
    createDefaultWarpIsmConfig,
    fullyConnectTokens,
    generateTokenConfigs,
    readWarpRouteDeployConfig,
    setProxyAdminConfig,
} from "./config";
import { executeDeploy, writeDeploymentArtifacts } from "./deploy";
import { MINIMUM_WARP_DEPLOY_GAS, WarpRouteDeployParams } from "./types";

async function getWarpCoreConfig(
    { warpDeployConfig, context }: WarpRouteDeployParams,
    contracts: HyperlaneContractsMap<TokenFactories>
): Promise<{
    warpCoreConfig: WarpCoreConfig;
    addWarpRouteOptions?: AddWarpRouteOptions;
}> {
    const warpCoreConfig: WarpCoreConfig = { tokens: [] };

    // TODO: replace with warp read
    const tokenMetadata = await HypERC20Deployer.deriveTokenMetadata(
        context.multiProvider,
        warpDeployConfig
    );
    //@ts-ignore

    const { decimals, symbol, name } = tokenMetadata;

    generateTokenConfigs(
        warpCoreConfig,
        warpDeployConfig,
        contracts,
        symbol,
        name,
        decimals
    );

    fullyConnectTokens(warpCoreConfig);

    return { warpCoreConfig, addWarpRouteOptions: { symbol } };
}

export class WarpDeployerClass {
    private tokenAddress: string;
    private type: TokenType;
    private outPath: string;

    constructor(tokenAddress: string, type: TokenType, outPath: string) {
        this.tokenAddress = tokenAddress;
        this.type = type;
        this.outPath = outPath;
    }

    private async createWarpRouteDeployConfig({
        context,
    }: {
        context: CommandContext;
        outPath: string;
    }) {
        const result: WarpRouteDeployConfig = {};

        const chain = context.chainMetadata[0].name;

        if (!context.signerAddress) {
            throw new Error("Signer address is required");
        }
        const owner = context.signerAddress;

        const chainAddress = await context.registry.getChainAddresses(chain);

        const mailbox = chainAddress?.mailbox;
        if (!mailbox) {
            throw new Error(`Mailbox address not found for chain ${chain}`);
        }

        const proxyAdmin: DeployedOwnableConfig = await setProxyAdminConfig(
            context,
            chain,
            owner,
            owner
        );

        const interchainSecurityModule: IsmConfig =
            createDefaultWarpIsmConfig(owner);

        const isNft =
            this.type === TokenType.syntheticUri ||
            this.type === TokenType.collateralUri;

        switch (this.type) {
            case TokenType.collateral:
            case TokenType.XERC20:
            case TokenType.XERC20Lockbox:
            case TokenType.collateralFiat:
            case TokenType.collateralUri:
            case TokenType.fastCollateral:
                result[chain] = {
                    mailbox,
                    type: this.type,
                    owner,
                    proxyAdmin,
                    isNft,
                    interchainSecurityModule,
                    token: this.tokenAddress,
                };
                break;
            case TokenType.syntheticRebase:
                result[chain] = {
                    mailbox,
                    type: this.type,
                    owner,
                    isNft,
                    proxyAdmin,
                    collateralChainName: "", // This will be derived correctly by zod.parse() below
                    interchainSecurityModule,
                };
                break;
            case TokenType.collateralVaultRebase:
                result[chain] = {
                    mailbox,
                    type: this.type,
                    owner,
                    proxyAdmin,
                    isNft,
                    interchainSecurityModule,
                    token: this.tokenAddress,
                };
                break;
            case TokenType.collateralVault:
                result[chain] = {
                    mailbox,
                    type: this.type,
                    owner,
                    proxyAdmin,
                    isNft,
                    interchainSecurityModule,
                    token: this.tokenAddress,
                };
                break;
            default:
                result[chain] = {
                    mailbox,
                    type: this.type,
                    owner,
                    proxyAdmin,
                    isNft,
                    interchainSecurityModule,
                };

                try {
                    const warpRouteDeployConfig =
                        WarpRouteDeployConfigSchema.parse(result);
                    writeYamlOrJson(
                        this.outPath,
                        warpRouteDeployConfig,
                        "yaml"
                    );
                } catch (e) {
                    console.log(
                        `Warp route deployment config is invalid, please see https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/typescript/cli/examples/warp-route-deployment.yaml for an example.`
                    );
                    throw e;
                }
        }
    }

    public async runWarpRouteDeploy({
        context,
        warpRouteDeployConfigPath,
    }: {
        context: WriteCommandContext;
        warpRouteDeployConfigPath: string;
    }) {
        const { chainMetadata, registry } = context;

        const warpRouteConfig = await readWarpRouteDeployConfig(
            warpRouteDeployConfigPath,
            context
        );

        const chains = Object.keys(warpRouteConfig);

        const apiKeys = await requestAndSaveApiKeys(
            chains,
            chainMetadata,
            registry
        );

        const deploymentParams: WarpRouteDeployParams = {
            context,
            warpDeployConfig: warpRouteConfig,
        };

        const ethereumChains = chains.filter(
            (chain) => chainMetadata[chain].protocol === ProtocolType.Ethereum
        );
        await runPreflightChecksForChains({
            context,
            chains: ethereumChains,
            minGas: MINIMUM_WARP_DEPLOY_GAS,
        });

        const initialBalances = await prepareDeploy(
            context,
            null,
            ethereumChains
        );
        const deployedContracts = await executeDeploy(
            deploymentParams,
            apiKeys
        );

        const { warpCoreConfig, addWarpRouteOptions } = await getWarpCoreConfig(
            deploymentParams,
            deployedContracts
        );

        await writeDeploymentArtifacts(
            warpCoreConfig,
            context,
            addWarpRouteOptions
        );
    }
}
