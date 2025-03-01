export const MINIMUM_TEST_SEND_GAS = (3e5).toString();
export const EXPLORER_URL = "https://explorer.hyperlane.xyz";
export let CORE_CONFIG_FILE;
export let AGENT_CONFIG_FILE;
export let VALIDATOR_SIGNATURES_DIRECTORY;
export let VALIDATOR_DB_PATH;

export async function createConfigFilePath(chain: string): Promise<void> {
    CORE_CONFIG_FILE = `./cache/${chain}/configs/core-config.yaml`;
}

export async function createAgentConfigFilePath(chain: string): Promise<void> {
    AGENT_CONFIG_FILE = `./cache/${chain}/configs/agent-config.json`;
}

export async function createValidatorSignaturesDir(
    chain: string
): Promise<void> {
    VALIDATOR_SIGNATURES_DIRECTORY = `./cache/${chain}/validator-signatures`;
}

export async function createValidatorDbPath(chain: string): Promise<void> {
    VALIDATOR_DB_PATH = `./cache/${chain}/validator-db`;
}
