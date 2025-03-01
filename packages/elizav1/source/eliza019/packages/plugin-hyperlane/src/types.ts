// src/actions/hyperlane/types.ts
import { ChainMap, ChainMetadata } from "@hyperlane-xyz/sdk";
import { Address, ProtocolType } from "@hyperlane-xyz/utils";

export interface HyperlaneBaseConfig {
    sourceChain: string;
    destinationChain: string;
}

export interface MessageConfig extends HyperlaneBaseConfig {
    recipientAddress: string;
    message: string;
}

export interface TokenTransferConfig extends HyperlaneBaseConfig {
    recipient: string;
    amount: string;
    tokenAddress: string;
}

export interface WarpRouteConfig extends HyperlaneBaseConfig {
    tokenName: string;
    tokenSymbol: string;
    decimals: number;
    collateralToken?: string;
}

export interface HyperlaneAddresses {
    mailbox: Address;
    validatorAnnounce: Address;
    proxyAdmin?: Address;
    interchainGasPaymaster?: Address;
}

export interface ChainConfig {
    name: string;
    chainId: number;
    domainId: number;
    protocol: ProtocolType;
    rpcUrls: Array<{
        http: string;
        concurrency: number;
    }>;
    blocks: {
        confirmations: number;
        reorgPeriod: number;
        estimateBlockTime: number;
    };
    transactionOverrides: Record<string, any>;
}

export interface HyperlaneContractAddresses {
    [chain: string]: {
        mailbox: Address;
        interchainGasPaymaster: Address;
        validatorAnnounce: Address;
    };
}
