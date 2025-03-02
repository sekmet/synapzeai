import { type Client, type IAgentRuntime, elizaLogger, type Plugin } from "@elizaos/core";

class AutoClient {
    interval: NodeJS.Timeout;
    runtime: IAgentRuntime;

    constructor(runtime: IAgentRuntime) {
        this.runtime = runtime;

        // start a loop that runs every x seconds
        this.interval = setInterval(
            async () => {
                elizaLogger.log("running auto client...");
            },
            60 * 60 * 1000
        ); // 1 hour in milliseconds
    }

    async stop() {
        clearInterval(this.interval);
    }
}

const AutoClientInterface: Client = {
    name: 'auto',
    start: async (runtime: IAgentRuntime) => {
        const client = new AutoClient(runtime);
        return client;
    },
};

const autoPlugin: Plugin = {
    name: "auto",
    description: "Auto client plugin",
    clients: [AutoClientInterface],
};
export default autoPlugin;