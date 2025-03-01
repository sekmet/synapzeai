import { LogService } from "../services/log.service";
import {
    IAgentRuntime,
    Memory,
    elizaLogger,
    Evaluator
} from "@elizaos/core";

export async function handler(runtime: IAgentRuntime, message: Memory) {
    const logService = new LogService();
    elizaLogger.debug("LogService initialized");
    await logService.initialize(runtime);
    elizaLogger.info({ messageContent: message.content });

    return logService.log(runtime, message, message.content);
}

export const logEvaluator: Evaluator = {
    name: "LOG_EVALUATOR",
    similes: ["EVALUATE_LOG"],
    description: "Evaluates log requests and orchestrates the logging process",
    validate: async (
        runtime: IAgentRuntime,
        message: Memory
    ): Promise<boolean> => {
        if (message.content.text.length < 5) {
            return false;
        }

        return message.userId !== message.agentId || message.userId === message.agentId;
    },
    alwaysRun: true,
    handler,
    examples: []
};

