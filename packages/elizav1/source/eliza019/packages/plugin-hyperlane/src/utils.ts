// src/actions/hyperlane/utils.ts
import { IAgentRuntime, elizaLogger } from "@elizaos/core";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ExplorerFamily, HyperlaneCore, MultiProvider } from "@hyperlane-xyz/sdk";
import { Address, ProtocolType } from "@hyperlane-xyz/utils";
import pino from "pino";
import { chainData } from "./chainMetadata";
import { ChainConfig, HyperlaneContractAddresses } from "./types";
import { CoreConfig , CoreConfigSchema, ChainMetadata } from "@hyperlane-xyz/sdk";
import { readYamlOrJson } from "./utils/configOps";
// Create logger instance
export const logger = pino({
    level: "info",
    transport: {
        target: "pino-pretty",
    },
});

export const REQUIRED_SETTINGS = {
    BASE: ["HYPERLANE_PRIVATE_KEY"],
    CHAIN_SPECIFIC: (chain: string) => [
        `${chain.toUpperCase()}_RPC_URL`,
        `${chain.toUpperCase()}_MAILBOX_ADDRESS`,
        `${chain.toUpperCase()}_VALIDATOR_ANNOUNCE`,
        `${chain.toUpperCase()}_IGP_ADDRESS`,
    ],
};

export async function validateSettings(
    runtime: IAgentRuntime,
    chains: string[]
): Promise<boolean> {
    const allRequired = [
        ...REQUIRED_SETTINGS.BASE,
        ...chains.flatMap((chain) => REQUIRED_SETTINGS.CHAIN_SPECIFIC(chain)),
    ];

    return allRequired.every((setting) => {
        const exists = !!runtime.getSetting(setting);
        if (!exists) elizaLogger.error(`Missing required setting: ${setting}`);
        return exists;
    });
}

export function createChainConfig(
    runtime: IAgentRuntime,
    chain: string
): ChainConfig {
    return {
        name: chain,
        //@ts-ignore
        chainId: chainData[chain].chainId,
        domainId: chainData[chain].domainId,
        protocol: ProtocolType.Ethereum,
        rpcUrls: [
            {
                http:
                    runtime.getSetting(`${chain.toUpperCase()}_RPC_URL`) || "",
                concurrency: 1,
            },
        ],
        blocks: {
            confirmations: 1,
            reorgPeriod: 1,
            estimateBlockTime: 12,
        },
        transactionOverrides: {},
    };
}

export function setupMultiProvider(
    runtime: IAgentRuntime,
    sourceChain: string,
    destinationChain: string
): MultiProvider {
    const chainMetadata = {
        [sourceChain]: createChainConfig(runtime, sourceChain),
        [destinationChain]: createChainConfig(runtime, destinationChain),
    };

    const multiProvider = new MultiProvider(chainMetadata);

    // Set providers for both chains
    Object.entries(chainMetadata).forEach(([chain]) => {
        const provider = new JsonRpcProvider(
            //@ts-ignore
            runtime.getSetting(`${chain.toUpperCase()}_RPC_URL`)
        );
        multiProvider.setProvider(chain, provider);
    });

    // Set up wallet and signer
    //@ts-ignore
    const wallet = new Wallet(runtime.getSetting("HYPERLANE_PRIVATE_KEY"));
    multiProvider.setSharedSigner(wallet);

    return multiProvider;
}

export function getChainAddresses(
    runtime: IAgentRuntime,
    chains: string[]
): HyperlaneContractAddresses {
    const addresses: HyperlaneContractAddresses = {};

    chains.forEach((chain) => {
        const prefix = chain.toUpperCase();
        addresses[chain] = {
            mailbox: runtime.getSetting(`${prefix}_MAILBOX_ADDRESS`) as Address,
            validatorAnnounce: runtime.getSetting(
                `${prefix}_VALIDATOR_ANNOUNCE`
            ) as Address,
            interchainGasPaymaster: runtime.getSetting(
                `${prefix}_IGP_ADDRESS`
            ) as Address,
        };
    });

    return addresses;
}

export function setupHyperlaneCore(
    runtime: IAgentRuntime,
    sourceChain: string,
    destinationChain: string
): { multiProvider: MultiProvider; core: HyperlaneCore } {
    const multiProvider = setupMultiProvider(
        runtime,
        sourceChain,
        destinationChain
    );
    const addresses = getChainAddresses(runtime, [
        sourceChain,
        destinationChain,
    ]);
    const core = HyperlaneCore.fromAddressesMap(addresses, multiProvider);

    return { multiProvider, core };
}

export async function handleActionError(
    error: any,
    action: string,
    callback?: Function
): Promise<false> {
    const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
    elizaLogger.error(`${action} failed:`, error);

    if (callback) {
        callback({
            text: `${action} failed: ${errorMessage}`,
            content: {
                success: false,
                error: errorMessage,
            },
        });
    }

    return false;
}

