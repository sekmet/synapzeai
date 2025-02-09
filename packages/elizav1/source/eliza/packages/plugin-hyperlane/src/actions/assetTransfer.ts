import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    Plugin,
    State,
} from "@elizaos/core";
import { hexlify } from "@ethersproject/bytes";
import { Contract } from "@ethersproject/contracts";
import { parseEther } from "@ethersproject/units";
import { TokenTransferConfig } from "../types";
import {
    handleActionError,
    setupHyperlaneCore,
    validateSettings,
} from "../utils";

export const sendAsset: Action = {
    name: "TRANSFER_TOKENS",
    similes: ["SEND_TOKENS", "BRIDGE_TOKENS", "CROSS_CHAIN_TRANSFER"],
    description: "Transfer tokens between chains using Hyperlane",

    validate: async (runtime: IAgentRuntime) =>
        validateSettings(runtime, ["ethereum", "polygon"]),
    //@ts-ignore
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: TokenTransferConfig,
        callback?: HandlerCallback
    ) => {
        try {
            const { multiProvider } = setupHyperlaneCore(
                runtime,
                options.sourceChain,
                options.destinationChain
            );

            const sourceToken = new Contract(
                options.tokenAddress,
                [
                    "function transferRemote(string, bytes, uint256)",
                    "function quoteGasPayment(string)",
                ],
                multiProvider.getSigner(options.sourceChain)
            );

            const gasQuote = await sourceToken.quoteGasPayment(
                options.destinationChain
            );

            const tx = await sourceToken.transferRemote(
                options.destinationChain,
                hexlify(options.recipient),
                parseEther(options.amount),
                { value: gasQuote }
            );

            const receipt = await tx.wait();

            if (callback) {
                callback({
                    text: `Successfully transferred ${options.amount} tokens to ${options.destinationChain}. Transaction hash: ${receipt.transactionHash}`,
                    content: {
                        transactionHash: receipt.transactionHash,
                        amount: options.amount,
                        sourceChain: options.sourceChain,
                        destinationChain: options.destinationChain,
                        recipient: options.recipient,
                    },
                });
            }

            return true;
        } catch (error) {
            return handleActionError(error, "Token transfer", callback);
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Transfer 100 tokens to Polygon",
                    options: {
                        sourceChain: "ethereum",
                        destinationChain: "polygon",
                        recipient: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                        amount: "100",
                        tokenAddress: "0x123...",
                    },
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll initiate the token transfer to Polygon.",
                    action: "TRANSFER_TOKENS",
                },
            },
        ],
    ],
};
