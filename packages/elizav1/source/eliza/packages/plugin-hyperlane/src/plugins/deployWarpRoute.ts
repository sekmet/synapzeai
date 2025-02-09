import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    Plugin,
    State,
    elizaLogger,
} from "@elizaos/core";
import { Wallet } from "@ethersproject/wallet";
import {
    HypERC20Deployer,
    TokenType,
    WarpRouteDeployConfig,
} from "@hyperlane-xyz/sdk";
import { Address } from "@hyperlane-xyz/utils";
import { WarpRouteConfig } from "../types";
import {
    handleActionError,
    setupHyperlaneCore,
    validateSettings,
} from "../utils";

export const deployWarpRoute: Action = {
    name: "DEPLOY_WARP_ROUTE",
    similes: ["CREATE_WARP_ROUTE", "DEPLOY_TOKEN_ROUTE", "SETUP_WARP_ROUTE"],
    description: "Deploy a new Warp Route for cross-chain token transfers",

    validate: async (runtime: IAgentRuntime) =>
        validateSettings(runtime, ["ethereum", "polygon"]),

    //@ts-ignore
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: WarpRouteConfig,
        callback?: HandlerCallback
    ) => {
        try {
            elizaLogger.info("Initializing Warp Route deployment...");

            const { multiProvider } = setupHyperlaneCore(
                runtime,
                options.sourceChain,
                options.destinationChain
            );
            //@ts-ignore
            const wallet = new Wallet(
                runtime.getSetting("HYPERLANE_PRIVATE_KEY") || ""
            );
            const deployConfig: WarpRouteDeployConfig = {
                [options.sourceChain]: {
                    type: options.collateralToken
                        ? TokenType.collateralFiat
                        : TokenType.native,
                    token: options.collateralToken || "",
                    name: options.tokenName,
                    symbol: options.tokenSymbol,
                    decimals: options.decimals,
                    owner: await wallet.getAddress(),
                    mailbox: runtime.getSetting(
                        `${options.sourceChain.toUpperCase()}_MAILBOX_ADDRESS`
                    ) as Address,
                },
                [options.destinationChain]: {
                    type: TokenType.synthetic,
                    name: options.tokenName,
                    symbol: options.tokenSymbol,
                    decimals: options.decimals,
                    owner: await wallet.getAddress(),
                    mailbox: runtime.getSetting(
                        `${options.destinationChain.toUpperCase()}_MAILBOX_ADDRESS`
                    ) as Address,
                },
            };

            elizaLogger.info("Deploying token contracts and Warp Routes...");

            // Deploy tokens and routes
            const deployer = new HypERC20Deployer(multiProvider);
            const deployedContracts = await deployer.deploy(deployConfig);

            elizaLogger.info("Warp Route deployment completed successfully", {
                sourceChainContracts: deployedContracts[options.sourceChain],
                destChainContracts: deployedContracts[options.destinationChain],
            });

            // Format deployment response
            const response = {
                success: true,
                contracts: {
                    [options.sourceChain]: {
                        token: deployedContracts[options.sourceChain].router,
                        router: deployedContracts[options.sourceChain].router,
                    },
                    [options.destinationChain]: {
                        token: deployedContracts[options.destinationChain]
                            .router,
                        router: deployedContracts[options.destinationChain]
                            .router,
                    },
                },
                config: {
                    tokenName: options.tokenName,
                    tokenSymbol: options.tokenSymbol,
                    decimals: options.decimals,
                    collateralToken: options.collateralToken,
                },
            };

            if (callback) {
                callback({
                    text: `Successfully deployed Warp Route between ${options.sourceChain} and ${options.destinationChain}`,
                    content: response,
                });
            }

            return true;
        } catch (error) {
            return handleActionError(error, "Warp Route deployment", callback);
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Deploy a new Warp Route for my token between Ethereum and Polygon",
                    options: {
                        sourceChain: "ethereum",
                        destinationChain: "polygon",
                        tokenName: "My Wrapped Token",
                        tokenSymbol: "MWT",
                        decimals: 18,
                    },
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll deploy a new Warp Route for your token.",
                    action: "DEPLOY_WARP_ROUTE",
                },
            },
        ],
    ],
};

export const deployWarpRoutePlugin: Plugin = {
    name: "deployWarpRoutePlugin",
    description: "Deploys a new Warp Route for cross-chain token transfers",

    // Register all actions
    actions: [deployWarpRoute],

    // Register providers
    providers: [],

    // Register evaluators
    evaluators: [],
};
