import { ProxyAdmin__factory } from "@hyperlane-xyz/core";
import {
    ContractVerifier,
    EvmHookModule,
    EvmIsmModule,
    HookConfig,
    HypTokenRouterConfig,
    HyperlaneProxyFactoryDeployer,
    IsmConfig,
    WarpRouteDeployConfig,
} from "@hyperlane-xyz/sdk";
import { objMap, promiseObjAll } from "@hyperlane-xyz/utils";
import { Address } from "viem";
import { WriteCommandContext } from "../core/context";

async function createWarpHook({
    chain,
    chainAddresses,
    context,
    contractVerifier,
    warpConfig,
}: {
    chain: string;
    chainAddresses: Record<string, string>;
    context: WriteCommandContext;
    contractVerifier?: ContractVerifier;
    warpConfig: HypTokenRouterConfig;
    ismFactoryDeployer: HyperlaneProxyFactoryDeployer;
}): Promise<HookConfig | undefined> {
    const { hook } = warpConfig;

    if (!hook || typeof hook === "string") {
        console.log(
            `Config Hook is ${!hook ? "empty" : hook}, skipping deployment.`
        );
        return hook;
    }

    console.log(`Loading registry factory addresses for ${chain}...`);

    console.log(`Creating ${hook.type} Hook for token on ${chain} chain...`);

    const {
        mailbox,
        domainRoutingIsmFactory,
        staticAggregationHookFactory,
        staticAggregationIsmFactory,
        staticMerkleRootMultisigIsmFactory,
        staticMessageIdMultisigIsmFactory,
        staticMerkleRootWeightedMultisigIsmFactory,
        staticMessageIdWeightedMultisigIsmFactory,
    } = chainAddresses;
    const proxyFactoryFactories = {
        domainRoutingIsmFactory,
        staticAggregationHookFactory,
        staticAggregationIsmFactory,
        staticMerkleRootMultisigIsmFactory,
        staticMessageIdMultisigIsmFactory,
        staticMerkleRootWeightedMultisigIsmFactory,
        staticMessageIdWeightedMultisigIsmFactory,
    };

    // If config.proxyadmin.address exists, then use that. otherwise deploy a new proxyAdmin
    const proxyAdminAddress: Address =
        (warpConfig.proxyAdmin?.address as Address) ??
        ((
            await context.multiProvider.handleDeploy(
                chain,
                new ProxyAdmin__factory(),
                []
            )
        ).address as Address);

    const evmHookModule = await EvmHookModule.create({
        chain,
        multiProvider: context.multiProvider,
        coreAddresses: {
            mailbox,
            proxyAdmin: proxyAdminAddress,
        },
        config: hook,
        contractVerifier,
        proxyFactoryFactories,
    });
    console.log(
        `Finished creating ${hook.type} Hook for token on ${chain} chain.`
    );
    const { deployedHook } = evmHookModule.serialize();
    return deployedHook;
}

async function createWarpIsm({
    chain,
    chainAddresses,
    context,
    contractVerifier,
    warpConfig,
}: {
    chain: string;
    chainAddresses: Record<string, string>;
    context: WriteCommandContext;
    contractVerifier?: ContractVerifier;
    warpConfig: HypTokenRouterConfig;
    ismFactoryDeployer: HyperlaneProxyFactoryDeployer;
}): Promise<IsmConfig | undefined> {
    const { interchainSecurityModule } = warpConfig;
    if (
        !interchainSecurityModule ||
        typeof interchainSecurityModule === "string"
    ) {
        console.log(
            `Config Ism is ${
                !interchainSecurityModule ? "empty" : interchainSecurityModule
            }, skipping deployment.`
        );
        return interchainSecurityModule;
    }

    console.log(`Loading registry factory addresses for ${chain}...`);

    console.log(
        `Creating ${interchainSecurityModule.type} ISM for token on ${chain} chain...`
    );

    console.log(
        `Finished creating ${interchainSecurityModule.type} ISM for token on ${chain} chain.`
    );

    const {
        mailbox,
        domainRoutingIsmFactory,
        staticAggregationHookFactory,
        staticAggregationIsmFactory,
        staticMerkleRootMultisigIsmFactory,
        staticMessageIdMultisigIsmFactory,
        staticMerkleRootWeightedMultisigIsmFactory,
        staticMessageIdWeightedMultisigIsmFactory,
    } = chainAddresses;
    const evmIsmModule = await EvmIsmModule.create({
        chain,
        mailbox,
        multiProvider: context.multiProvider,
        proxyFactoryFactories: {
            domainRoutingIsmFactory,
            staticAggregationHookFactory,
            staticAggregationIsmFactory,
            staticMerkleRootMultisigIsmFactory,
            staticMessageIdMultisigIsmFactory,
            staticMerkleRootWeightedMultisigIsmFactory,
            staticMessageIdWeightedMultisigIsmFactory,
        },
        config: interchainSecurityModule,
        contractVerifier,
    });
    const { deployedIsm } = evmIsmModule.serialize();
    return deployedIsm;
}

export async function resolveWarpIsmAndHook(
    warpConfig: WarpRouteDeployConfig,
    context: WriteCommandContext,
    ismFactoryDeployer: HyperlaneProxyFactoryDeployer,
    contractVerifier?: ContractVerifier
): Promise<WarpRouteDeployConfig> {
    return promiseObjAll(
        objMap(warpConfig, async (chain, config) => {
            const chainAddresses =
                await context.registry.getChainAddresses(chain);

            if (!chainAddresses) {
                throw `Registry factory addresses not found for ${chain}.`;
            }

            config.interchainSecurityModule = await createWarpIsm({
                chain,
                chainAddresses,
                context,
                contractVerifier,
                ismFactoryDeployer,
                warpConfig: config,
            }); // TODO write test

            config.hook = await createWarpHook({
                chain,
                chainAddresses,
                context,
                contractVerifier,
                ismFactoryDeployer,
                warpConfig: config,
            });
            return config;
        })
    );
}
