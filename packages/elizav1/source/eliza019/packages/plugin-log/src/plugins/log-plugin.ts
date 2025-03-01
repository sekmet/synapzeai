import type { Plugin } from "@elizaos/core";
import { LogService } from "../services/log.service";
import { logEvaluator } from "../evaluators/log-evaluator";

export const logPlugin: Plugin = {
    name: "Log",
    description: "Support logging for eliza conversations",
    actions: [],
    providers: [],
    evaluators: [logEvaluator],
    services: [new LogService()],
    clients: [],
};
