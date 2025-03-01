import Docker from "dockerode";
import path from "path";
import fs from "fs";
import { elizaLogger } from "@elizaos/core";

const docker = new Docker();

// Utility to create directories if they don't exist
const createDirectory = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Created directory: ${directoryPath}`);
  }
};

// Class for running a Validator
export class ValidatorRunner {
  private chainName: string;
  private validatorKey: string;
  private configFilePath: string;
  private validatorSignaturesDir: string;
  private validatorDbPath: string;

  constructor(chainName: string, validatorKey: string, configFilePath: string) {
    this.chainName = chainName;
    this.validatorKey = validatorKey;
    this.configFilePath = configFilePath;
    this.validatorSignaturesDir = path.resolve(
      `tmp/hyperlane-validator-signatures-${chainName}`
    );
    this.validatorDbPath = path.resolve(`hyperlane_db_validator_${chainName}`);

    // Ensure required directories exist
    createDirectory(this.validatorSignaturesDir);
    createDirectory(this.validatorDbPath);
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
              Source: this.validatorDbPath,
              Target: "/hyperlane_db",
              Type: "bind",
            },
            {
              Source: this.validatorSignaturesDir,
              Target: "/tmp/validator-signatures",
              Type: "bind",
            },
          ],
        },
        Cmd: [
          "./validator",
          "--db",
          "/hyperlane_db",
          "--originChainName",
          this.chainName,
          "--checkpointSyncer.type",
          "localStorage",
          "--checkpointSyncer.path",
          "/tmp/validator-signatures",
          "--validator.key",
          this.validatorKey,
        ],
        Tty: true,
      });

      elizaLogger.log(`Starting validator for chain: ${this.chainName}...`);
      await container.start();
    elizaLogger.log(`Validator for chain: ${this.chainName} started successfully.`);
    } catch (error) {
      elizaLogger.error(`Error starting validator for chain: ${this.chainName}`, error);
    }
  }
}