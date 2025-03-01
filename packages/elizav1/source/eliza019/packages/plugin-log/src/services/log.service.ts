import {
    type IAgentRuntime,
    type Memory,
    Service,
    ServiceType,
    IDatabaseAdapter,
    elizaLogger,
    //stringToUuid,
} from "@elizaos/core";

import { ILogService } from "../types.ts";
import { analyzeSentiment } from "./sentiment";
import { getCustomerSatisfactionScore } from "./csat";

export enum LogType {
    SENTIMENT = "sentiment",
    CSAT = "csat",
}

export class LogService extends Service implements ILogService {
    private initialized = false;
    private enableLog = false;
    private logType: LogType;
    logManager: IDatabaseAdapter;

    getInstance(): ILogService {
        return LogService.getInstance();
    }

    static get serviceType(): ServiceType {
        return "log" as ServiceType;
    }

    async initialize(runtime: IAgentRuntime): Promise<void> {
        if (this.initialized) {
            return;
        }

        const enableValues = ["true", "1", "yes", "enable", "enabled", "on"];

        const enableLog = runtime.getSetting("ENABLE_LOGGING");
        if (enableLog === null) {
            elizaLogger.debug("ENABLE_LOGGING is not set.");
            return;
        }

        this.enableLog = enableValues.includes(enableLog.toLowerCase());

        if (!this.enableLog) {
            elizaLogger.log("Logging is not enabled.");
            return;
        }

        this.logManager = runtime.databaseAdapter;
        this.initialized = true;
    }

    async log(runtime: IAgentRuntime, message: Memory, body: { [key: string]: unknown }): Promise<boolean> {
        if (!this.enableLog) {
            return false;
        }

        let sentiment: string;
        let csat: number;
        if (typeof body === "object") {
            sentiment = analyzeSentiment(body?.text as string);
            csat = getCustomerSatisfactionScore(body?.text as string);
        }

        // logging sentiment
        const sentimentLog = {
            //id: stringToUuid(`log-${message.userId}-${Date.now().toString()}`),
            type: LogType.SENTIMENT,
            roomId: message.roomId,
            userId: message.userId,
            agentId: runtime.agentId,
            body: { sentiment }
        };
        elizaLogger.info("Storing sentiment log");
        elizaLogger.debug(`Sentiment log: ${JSON.stringify(sentimentLog)}`);
        await this.logManager.log(sentimentLog);

        // logging csat score
        const csatLog = {
            //id: stringToUuid(`log-${message.userId}-${Date.now().toString()}`),
            type: LogType.CSAT,
            roomId: message.roomId,
            userId: message.userId,
            agentId: runtime.agentId,
            body: { csat }
        };
        elizaLogger.info("Storing CSAT log");
        elizaLogger.debug(`CSAT log: ${JSON.stringify(csatLog)}`);
        await this.logManager.log(csatLog);

        return true;
    }

}

export default LogService;
