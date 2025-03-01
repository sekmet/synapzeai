import { IAgentRuntime, elizaLogger } from "@elizaos/core";
import { MultisigIsmConfig, IsmConfig, MultisigIsmConfigSchema, HookConfig, HookType, CoreConfig, CoreConfigSchema, ChainMetadata, ExplorerFamily } from "@hyperlane-xyz/sdk";
import { readYamlOrJson } from "../../utils/configOps";
import { callWithConfigCreationLogs } from "./utils";

export async function createMultisignConfig(
    ismType: MultisigIsmConfig["type"]
): Promise<IsmConfig> {
    const validators: string[] = [];
    const threshold = 1;

    const result = MultisigIsmConfigSchema.safeParse({
        type: ismType,
        validators,
        threshold,
    });

    if (!result.success) {
        return this.createMultisignConfig(ismType);
    }
    return result.data;
}

export const createMerkleTreeConfig = callWithConfigCreationLogs(
    async (): Promise<HookConfig> => {
        return { type: HookType.MERKLE_TREE };
    },
    HookType.MERKLE_TREE
);

export function readCoreDeployConfigs(filePath: string): CoreConfig {
    const config = readYamlOrJson(filePath);
    return CoreConfigSchema.parse(config);
}

export async function addBlockExplorerConfig(
    runtime: IAgentRuntime,
    metadata: ChainMetadata
) {
    if (runtime.getSetting("BLOCK_EXPLORER_URL")) {
        const name: any = runtime.getSetting("BLOCK_EXPLORER_NAME");
        const blockExplorerUrl: any = runtime.getSetting("BLOCK_EXPLORER_URL");
        const apiUrl: any = runtime.getSetting("BLOCK_EXPLORER_API_URL");
        const family = runtime.getSetting(
            "BLOCK_EXPLORER_FAMILY"
        ) as ExplorerFamily;
        const apiKey = runtime.getSetting("BLOCK_EXPLORER_API_KEY");
        metadata.blockExplorers = [];

        metadata.blockExplorers[0] = {
            name,
            url: blockExplorerUrl,
            apiUrl,
            family,
        };

        if (apiKey) {
            metadata.blockExplorers[0].apiKey = apiKey;
        }
    }
}

export async function addBlockOrGasConfig(
    runtime: IAgentRuntime,
    metadata: ChainMetadata
): Promise<void> {
    const WantBlockOrGasConfig = runtime.getSetting("WANT_BLOCK_OR_GAS_CONFIG");

    if (WantBlockOrGasConfig) {
        await addBlockConfig(runtime, metadata);
        await addGasConfig(runtime, metadata);
    } else {
        elizaLogger.log("Block or Gas config not found , Skipping it -----");
    }
}

export async function addBlockConfig(
    runtime: IAgentRuntime,
    metadata: ChainMetadata
) {
    const blockConfirmation: any = runtime.getSetting("BLOCK_CONFIRMATION");
    const blockReorgPeriod: any = runtime.getSetting("BLOCK_REORG_PERIOD");
    const blockEstimateTime: any = runtime.getSetting("BLOCK_ESTIMATE_TIME");

    metadata.blocks = {
        confirmations: blockConfirmation,
        reorgPeriod: blockReorgPeriod,
        estimateBlockTime: blockEstimateTime,
    };
}

export async function addGasConfig(
    runtime: IAgentRuntime,
    metadata: ChainMetadata
) {
    const isEIP1559 = runtime.getSetting("IS_EIP1559");

    if (isEIP1559) {
        const maxFeePerGas: any = runtime.getSetting("MAX_FEE_PER_GAS");
        const maxPriorityFeePerGas: any = runtime.getSetting(
            "MAX_PRIORITY_FEE_PER_GAS"
        );
        metadata.transactionOverrides = {
            maxFeePerGas: BigInt(maxFeePerGas) * BigInt(10 ** 9),
            maxPriorityFeePerGas:
                BigInt(maxPriorityFeePerGas) * BigInt(10 ** 9),
        };
    } else {
        const gasPrice: any = runtime.getSetting("GAS_PRICE");
        metadata.transactionOverrides = {
            gasPrice: BigInt(gasPrice) * BigInt(10 ** 9),
        };
    }
}

export async function addNativeTokenConfig(
    runtime: IAgentRuntime,
    metadata: ChainMetadata
) {
    const wantNativeTokenConfig = runtime.getSetting(
        "WANT_NATIVE_TOKEN_CONFIG"
    );

    if (wantNativeTokenConfig) {
        const nativeTokenSymbol = runtime.getSetting("NATIVE_TOKEN_SYMBOL");
        const nativeTokenName = runtime.getSetting("NATIVE_TOKEN_NAME");
        const nativeTokenDecimals = runtime.getSetting("NATIVE_TOKEN_DECIMALS");

        metadata.nativeToken = {
            symbol: nativeTokenSymbol ?? "ETH",
            name: nativeTokenName ?? "Ether",
            decimals: nativeTokenDecimals
                ? parseInt(nativeTokenDecimals, 10)
                : 18,
        };
    }
}
