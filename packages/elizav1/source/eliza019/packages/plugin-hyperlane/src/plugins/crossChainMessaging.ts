import { Plugin } from "@elizaos/core";
import {
    Action,
    ActionExample,
    elizaLogger,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { chainData } from "../chainMetadata";
import {
    validateSettings,
    setupHyperlaneCore,
    handleActionError
} from '../utils';

// Add logging function
async function logMessageDispatch(
    sourceChain: string,
    targetChain: string,
    txHash: string,
    messageId: string,
    recipientAddress: string,
    message: string
) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'cross_chain_message',
        sourceChain,
        targetChain,
        txHash,
        messageId,
        recipientAddress,
        message,
        status: 'dispatched'
    };

    elizaLogger.info('Cross-chain message log:', logEntry);
    // You can also write to a file or database here if needed
}

export const sendCrossChainMessage: Action = {
    name: "SEND_CROSS_CHAIN_MESSAGE",
    similes: ["SEND_MESSAGE", "TRANSFER_MESSAGE", "CROSS_CHAIN_SEND"],
    description: "Send a message between any supported chains using Hyperlane",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const sourceChain = options.sourceChain as string;
        const targetChain = options.targetChain as string;

        // Validate if chains are supported
        if (!chainData[sourceChain] || !chainData[targetChain]) {
            elizaLogger.error(`Unsupported chain(s): ${sourceChain} or ${targetChain}`);
            return false;
        }

        return validateSettings(runtime, [sourceChain, targetChain]);
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        options?: Record<string, unknown>,
        callback?: HandlerCallback
    ) => {
        try {
            if (!options) {
                throw new Error('Options are required for cross-chain messaging');
            }

            const sourceChain = options.sourceChain as string;
            const targetChain = options.targetChain as string;
            const recipientAddress = options.recipientAddress as string;
            const messageContent = options.message as string;

            // Set up Hyperlane core with the specified chains
            const { core, multiProvider } = setupHyperlaneCore(
                runtime,
                sourceChain,
                targetChain
            );

            elizaLogger.info(`Sending message from ${sourceChain} to ${targetChain}...`);

            const encodedMessage = utils.formatBytes32String(messageContent);

            // Send message
            const { dispatchTx, message: dispatchedMessage } = await core.sendMessage(
                sourceChain,
                targetChain,
                recipientAddress,
                encodedMessage
            );

            // Log the message dispatch
            await logMessageDispatch(
                sourceChain,
                targetChain,
                dispatchTx.transactionHash,
                dispatchedMessage.id,
                recipientAddress,
                messageContent
            );

            // Get explorer URL
            const explorerUrl = await multiProvider.tryGetExplorerAddressUrl(
                sourceChain,
                dispatchTx.transactionHash
            );

            // Wait for message processing
            await core.waitForMessageProcessed(dispatchTx);
            elizaLogger.info("Message processed on destination chain");

            if (callback) {
                callback({
                    text: `Successfully sent message from ${sourceChain} to ${targetChain}. Transaction hash: ${dispatchTx.transactionHash}`,
                    content: {
                        transactionHash: dispatchTx.transactionHash,
                        messageId: dispatchedMessage.id,
                        explorerUrl,
                        sourceChain,
                        targetChain
                    },
                });
            }

            return true;
        } catch (error) {
            return handleActionError(error, "Cross-chain message sending", callback);
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Send a message from Arbitrum to Optimism",
                    options: {
                        sourceChain: "arbitrum",
                        targetChain: "optimism",
                        recipientAddress: "0x1234...",
                        message: "Hello Cross Chain!",
                    },
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll send your message across chains.",
                    action: "SEND_CROSS_CHAIN_MESSAGE",
                },
            },
        ],
    ],
};