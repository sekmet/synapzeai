import { buildArtifact as coreBuildArtifact } from "@hyperlane-xyz/core/buildArtifact.js";
import { AddWarpRouteOptions } from "@hyperlane-xyz/registry";
import {
    ContractVerifier,
    ExplorerLicenseType,
    HypERC20Deployer,
    HypERC721Deployer,
    HyperlaneProxyFactoryDeployer,
    WarpRouteDeployConfig,
    type ChainMap,
    type HypERC20Factories,
    type HypERC721Factories,
    type HyperlaneContractsMap,
    type TokenFactories,
    type WarpCoreConfig,
} from "@hyperlane-xyz/sdk";
import { WriteCommandContext } from "../core/context";
import { fullyConnectTokens, generateTokenConfigs } from "./config";
import { resolveWarpIsmAndHook } from "./ism";
import { WarpRouteDeployParams } from "./types";

export async function executeDeploy(
    params: WarpRouteDeployParams,
    apiKeys: ChainMap<string>
): Promise<HyperlaneContractsMap<HypERC20Factories | HypERC721Factories>> {
    console.log("🚀 All systems ready, captain! Beginning deployment...");

    const {
        warpDeployConfig,
        context: { multiProvider, isDryRun, dryRunChain },
    } = params;

    const deployer = warpDeployConfig.isNft
        ? new HypERC721Deployer(multiProvider)
        : new HypERC20Deployer(multiProvider); // TODO: replace with EvmERC20WarpModule

    const config: WarpRouteDeployConfig =
        isDryRun && dryRunChain
            ? { [dryRunChain]: warpDeployConfig[dryRunChain] }
            : warpDeployConfig;

    const contractVerifier = new ContractVerifier(
        multiProvider,
        apiKeys,
        coreBuildArtifact,
        ExplorerLicenseType.MIT
    );

    const ismFactoryDeployer = new HyperlaneProxyFactoryDeployer(
        multiProvider,
        contractVerifier
    );

    // For each chain in WarpRouteConfig, deploy each Ism Factory, if it's not in the registry
    // Then return a modified config with the ism and/or hook address as a string
    const modifiedConfig = await resolveWarpIsmAndHook(
        config,
        params.context,
        ismFactoryDeployer,
        contractVerifier
    );

    const deployedContracts = await deployer.deploy(modifiedConfig);

    console.log("✅ Warp contract deployments complete");
    return deployedContracts;
}

export async function writeDeploymentArtifacts(
    warpCoreConfig: WarpCoreConfig,
    context: WriteCommandContext,
    addWarpRouteOptions?: AddWarpRouteOptions
) {
    if (!context.isDryRun) {
        console.log("Writing deployment artifacts...");
        await context.registry.addWarpRoute(
            warpCoreConfig,
            addWarpRouteOptions
        );
    }
}

export async function getWarpCoreConfig(
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
