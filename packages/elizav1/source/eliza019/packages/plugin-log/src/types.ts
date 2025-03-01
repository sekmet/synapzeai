import { type Service } from "@elizaos/core";

export enum ServiceType {
    LOGGING = "log",
}

// Interface extending core Service
export interface ILogService extends Service {
    logManager: any;
}
