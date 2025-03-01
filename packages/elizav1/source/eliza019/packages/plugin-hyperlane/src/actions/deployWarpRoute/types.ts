import {
    ChainName,
    CoreConfig,
    WarpRouteDeployConfig,
} from "@hyperlane-xyz/sdk";
import { WriteCommandContext } from "../core/context";

export interface HyperlaneDeployParams {
    context: WriteCommandContext;
    chain: ChainName;
    config: CoreConfig;
}

export interface WarpRouteDeployParams {
    context: WriteCommandContext;
    warpDeployConfig: WarpRouteDeployConfig;
}

export const MINIMUM_WARP_DEPLOY_GAS = (3e7).toString();
