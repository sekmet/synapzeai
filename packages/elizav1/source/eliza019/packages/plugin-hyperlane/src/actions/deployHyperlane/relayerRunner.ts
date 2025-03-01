import Docker from "dockerode";
import path from "path";
import fs from "fs";
import { elizaLogger } from "@elizaos/core";

const docker = new Docker();

const createDirectory = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Created directory: ${directoryPath}`);
  }
};


export class RelayerRunner {
    private relayChains: string[];
    private relayerKey: string;
    private configFilePath: string;
    private relayerDbPath: string;
    private validatorSignaturesDir: string;

    constructor(
      relayChains: string[],
      relayerKey: string,
      configFilePath: string,
      validatorChainName: string
    ) {
      this.relayChains = relayChains;
      this.relayerKey = relayerKey;
      this.configFilePath = configFilePath;
      this.relayerDbPath = path.resolve("hyperlane_db_relayer");
      this.validatorSignaturesDir = path.resolve(
        `tmp/hyperlane-validator-signatures-${validatorChainName}`
      );

      // Ensure required directories exist
      createDirectory(this.relayerDbPath);
    }

    async run(): Promise<void> {
      try {
        const container = await docker.createContainer({
          Image: "gcr.io/abacus-labs-dev/hyperlane-agent:agents-v1.1.0",
          Env: [`CONFIG_FILES=/config/agent-config.json`],
          HostConfig: {
            Mounts: [
              {
                Source: path.resolve(this.configFilePath),
                Target: "/config/agent-config.json",
                Type: "bind",
                ReadOnly: true,
              },
              {
                Source: this.relayerDbPath,
                Target: "/hyperlane_db",
                Type: "bind",
              },
              {
                Source: this.validatorSignaturesDir,
                Target: "/tmp/validator-signatures",
                Type: "bind",
                ReadOnly: true,
              },
            ],
          },
          Cmd: [
            "./relayer",
            "--db",
            "/hyperlane_db",
            "--relayChains",
            this.relayChains.join(","),
            "--allowLocalCheckpointSyncers",
            "true",
            "--defaultSigner.key",
            this.relayerKey,
          ],
          Tty: true,
        });

        elizaLogger.log(`Starting relayer for chains: ${this.relayChains.join(", ")}...`);
        await container.start();
        elizaLogger.log(
          `Relayer for chains: ${this.relayChains.join(", ")} started successfully.`
        );
      } catch (error) {
        elizaLogger.error(
          `Error starting relayer for chains: ${this.relayChains.join(", ")}`,
          error
        );
      }
    }
  }
