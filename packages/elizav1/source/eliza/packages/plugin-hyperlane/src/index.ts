import { Plugin } from "@elizaos/core";
import { sendCrossChainMessage } from "./plugins/crossChainMessaging";

export const hyperlanePlugin: Plugin = {
    name: "hyperlane plugin",
    description: "Provides core Hyperlane functionalities like sending cross-chain messaging, asset transfers, warp route deployments, permissionless hyperlane deployment to new chains.",
    actions: [sendCrossChainMessage],
    providers: [],
    evaluators: [],
    services: [],
};
