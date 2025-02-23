import { PGLiteDatabaseAdapter } from "@elizaos/adapter-pglite";
import { PostgresDatabaseAdapter } from "@elizaos/adapter-postgres";
import { QdrantDatabaseAdapter } from "@elizaos/adapter-qdrant";
import { RedisClient } from "@elizaos/adapter-redis";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import { SupabaseDatabaseAdapter } from "@elizaos/adapter-supabase";
import { MongoDBDatabaseAdapter } from "@elizaos/adapter-mongodb";
import { MongoClient } from "mongodb";
import { AutoClientInterface } from "@elizaos/client-auto";
import { DirectClient } from "@elizaos/client-direct";
{{#if client-discord}}
import { DiscordClientInterface } from "@elizaos/client-discord";
{{/if}}
{{#if client-farcaster}}
import { FarcasterClientInterface } from "@elizaos/client-farcaster";
{{/if}}
{{#if client-github}}
import { GitHubClientInterface } from "@elizaos/client-github";
{{/if}}
{{#if client-lens}}
import { LensAgentClient } from "@elizaos/client-lens";
{{/if}}
{{#if client-slack}}
import { SlackClientInterface } from "@elizaos/client-slack";
{{/if}}
{{#if client-telegram}}
import { TelegramClientInterface } from "@elizaos/client-telegram";
{{/if}}
{{#if client-telegram-account}}
import { TelegramAccountClientInterface } from "@elizaos/client-telegram-account";
{{/if}}
{{#if client-twitter}}
import { TwitterClientInterface } from "@elizaos/client-twitter";
{{/if}}
{{#if client-instagram}}
import { InstagramClientInterface } from "@elizaos/client-instagram";
{{/if}}
{{#if client-alexa}}
import { AlexaClientInterface } from "@elizaos/client-alexa";
{{/if}}
{{#if client-deva}}
import { DevaClientInterface } from "@elizaos/client-deva";
{{/if}}
{{#if client-simsai}}
import { JeeterClientInterface } from "@elizaos/client-simsai";
{{/if}}
{{#if client-xmtp}}
import { XmtpClientInterface } from "@elizaos/client-xmtp";
{{/if}}
{{#if plugin-0g}}
import { zgPlugin } from "@elizaos/plugin-0g";
{{/if}}
{{#if plugin-football}}
import { footballPlugin } from "@elizaos/plugin-football";
{{/if}}
{{#if plugin-agentkit}}
import { agentKitPlugin } from "@elizaos/plugin-agentkit";
{{/if}}
{{#if plugin-gelato}}
import { gelatoPlugin } from "@elizaos/plugin-gelato";
{{/if}}
{{#if plugin-primus}}
import { PrimusAdapter } from "@elizaos/plugin-primus";
{{/if}}
{{#if plugin-lightning}}
import { lightningPlugin } from "@elizaos/plugin-lightning";
{{/if}}
{{#if plugin-dcap}}
import { dcapPlugin } from "@elizaos/plugin-dcap";
{{/if}}
{{#if plugin-3d-generation}}
import { ThreeDGenerationPlugin } from "@elizaos/plugin-3d-generation";
{{/if}}
{{#if plugin-abstract}}
import { abstractPlugin } from "@elizaos/plugin-abstract";
{{/if}}
{{#if plugin-akash}}
import { akashPlugin } from "@elizaos/plugin-akash";
{{/if}}
{{#if plugin-allora}}
import { alloraPlugin } from "@elizaos/plugin-allora";
{{/if}}
{{#if plugin-aptos}}
import { aptosPlugin } from "@elizaos/plugin-aptos";
{{/if}}
{{#if plugin-arthera}}
import { artheraPlugin } from "@elizaos/plugin-arthera";
{{/if}}
{{#if plugin-autonome}}
import { autonomePlugin } from "@elizaos/plugin-autonome";
{{/if}}
{{#if plugin-avail}}
import { availPlugin } from "@elizaos/plugin-avail";
{{/if}}
{{#if plugin-avalanche}}
import { avalanchePlugin } from "@elizaos/plugin-avalanche";
{{/if}}
{{#if plugin-b2}}
import { b2Plugin } from "@elizaos/plugin-b2";
{{/if}}
{{#if plugin-binance}}
import { binancePlugin } from "@elizaos/plugin-binance";
{{/if}}
{{#if plugin-birdeye}}
import { birdeyePlugin } from "@elizaos/plugin-birdeye";
{{/if}}
{{#if plugin-bittensor}}
import { bittensorPlugin } from "@elizaos/plugin-bittensor";
{{/if}}
{{#if plugin-bnb}}
import { bnbPlugin } from "@elizaos/plugin-bnb";
{{/if}}
{{#if plugin-coinbase}}
import {
    advancedTradePlugin,
    coinbaseCommercePlugin,
    coinbaseMassPaymentsPlugin,
    tokenContractPlugin,
    tradePlugin,
    webhookPlugin,
} from "@elizaos/plugin-coinbase";
{{/if}}
{{#if plugin-coingecko}}
import { coingeckoPlugin } from "@elizaos/plugin-coingecko";
{{/if}}
{{#if plugin-coinmarketcap}}
import { coinmarketcapPlugin } from "@elizaos/plugin-coinmarketcap";
{{/if}}
{{#if plugin-conflux}}
import { confluxPlugin } from "@elizaos/plugin-conflux";
{{/if}}
{{#if plugin-cosmos}}
import { createCosmosPlugin } from "@elizaos/plugin-cosmos";
{{/if}}
{{#if plugin-cronoszkevm}}
import { cronosZkEVMPlugin } from "@elizaos/plugin-cronoszkevm";
{{/if}}
{{#if plugin-evm}}
import { evmPlugin } from "@elizaos/plugin-evm";
{{/if}}
{{#if plugin-flow}}
import { flowPlugin } from "@elizaos/plugin-flow";
{{/if}}
{{#if plugin-fuel}}
import { fuelPlugin } from "@elizaos/plugin-fuel";
{{/if}}
{{#if plugin-genlayer}}
import { genLayerPlugin } from "@elizaos/plugin-genlayer";
{{/if}}
{{#if plugin-gitcoin-passport}}
import { gitcoinPassportPlugin } from "@elizaos/plugin-gitcoin-passport";
{{/if}}
{{#if plugin-initia}}
import { initiaPlugin } from "@elizaos/plugin-initia";
{{/if}}
{{#if plugin-giphy}}
import { giphyPlugin } from "@elizaos/plugin-giphy";
{{/if}}
{{#if plugin-goat}}
import createGoatPlugin from "@elizaos/plugin-goat";
{{/if}}
{{#if plugin-zilliqa}}
import createZilliqaPlugin from "@elizaos/plugin-zilliqa";
{{/if}}
{{#if plugin-hyperliquid}}
import { hyperliquidPlugin } from "@elizaos/plugin-hyperliquid";
{{/if}}
{{#if plugin-image-generation}}
import { imageGenerationPlugin } from "@elizaos/plugin-image-generation";
{{/if}}
{{#if plugin-lens-network}}
import { lensPlugin } from "@elizaos/plugin-lens-network";
{{/if}}
{{#if plugin-lit}}
import { litPlugin } from "@elizaos/plugin-lit";
{{/if}}
{{#if plugin-mind-network}}
import { mindNetworkPlugin } from "@elizaos/plugin-mind-network";
{{/if}}
{{#if plugin-multiversx}}
import { multiversxPlugin } from "@elizaos/plugin-multiversx";
{{/if}}
{{#if plugin-near}}
import { nearPlugin } from "@elizaos/plugin-near";
{{/if}}
{{#if plugin-nft-collections}}
import createNFTCollectionsPlugin from "@elizaos/plugin-nft-collections";
{{/if}}
{{#if plugin-nft-generation}}
import { nftGenerationPlugin } from "@elizaos/plugin-nft-generation";
{{/if}}
{{#if plugin-obsidian}}
import { obsidianPlugin } from "@elizaos/plugin-obsidian";
{{/if}}
{{#if plugin-opacity}}
import { OpacityAdapter } from "@elizaos/plugin-opacity";
{{/if}}
{{#if plugin-open-weather}}
import { openWeatherPlugin } from "@elizaos/plugin-open-weather";
{{/if}}
{{#if plugin-quai}}
import { quaiPlugin } from "@elizaos/plugin-quai";
{{/if}}
{{#if plugin-sgx}}
import { sgxPlugin } from "@elizaos/plugin-sgx";
{{/if}}
{{#if plugin-solana}}
import { solanaPlugin } from "@elizaos/plugin-solana";
{{/if}}
{{#if plugin-solana}}
import { solanaPluginV2 } from "@elizaos/plugin-solana-v2";
{{/if}}
{{#if plugin-solana-agent-kit}}
import { solanaAgentkitPlugin } from "@elizaos/plugin-solana-agent-kit";
{{/if}}
{{#if plugin-squid-router}}
import { squidRouterPlugin } from "@elizaos/plugin-squid-router";
{{/if}}
{{#if plugin-stargaze}}
import { stargazePlugin } from "@elizaos/plugin-stargaze";
{{/if}}
{{#if plugin-story}}
import { storyPlugin } from "@elizaos/plugin-story";
{{/if}}
{{#if plugin-sui}}
import { suiPlugin } from "@elizaos/plugin-sui";
{{/if}}
{{#if plugin-tee-marlin}}
import { teeMarlinPlugin } from "@elizaos/plugin-tee-marlin";
{{/if}}
{{#if plugin-tee-verifiable-log}}
import { verifiableLogPlugin } from "@elizaos/plugin-tee-verifiable-log";
{{/if}}
{{#if plugin-ton}}
import { tonPlugin } from "@elizaos/plugin-ton";
{{/if}}
{{#if plugin-web-search}}
import { webSearchPlugin } from "@elizaos/plugin-web-search";
{{/if}}
{{#if plugin-dkg}}
import { dkgPlugin } from "@elizaos/plugin-dkg";
{{/if}}
{{#if plugin-injective}}
import { injectivePlugin } from "@elizaos/plugin-injective";
{{/if}}
{{#if plugin-letzai}}
import { letzAIPlugin } from "@elizaos/plugin-letzai";
{{/if}}
{{#if plugin-thirdweb}}
import { thirdwebPlugin } from "@elizaos/plugin-thirdweb";
{{/if}}
{{#if plugin-moralis}}
import { moralisPlugin } from "@elizaos/plugin-moralis";
{{/if}}
{{#if plugin-echochambers}}
import { echoChambersPlugin } from "@elizaos/plugin-echochambers";
{{/if}}
{{#if plugin-dexscreener}}
import { dexScreenerPlugin } from "@elizaos/plugin-dexscreener";
{{/if}}
{{#if plugin-pyth-data}}
import { pythDataPlugin } from "@elizaos/plugin-pyth-data";
{{/if}}
{{#if plugin-openai}}
import { openaiPlugin } from "@elizaos/plugin-openai";
{{/if}}
{{#if plugin-router-nitro}}
import { nitroPlugin } from "@elizaos/plugin-router-nitro";
{{/if}}
{{#if plugin-devin}}
import { devinPlugin } from "@elizaos/plugin-devin";
{{/if}}
{{#if plugin-zksync-era}}
import { zksyncEraPlugin } from "@elizaos/plugin-zksync-era";
{{/if}}
{{#if plugin-chainbase}}
import { chainbasePlugin } from "@elizaos/plugin-chainbase";
{{/if}}
{{#if plugin-holdstation}}
import { holdstationPlugin } from "@elizaos/plugin-holdstation";
{{/if}}
{{#if plugin-nvidia-nim}}
import { nvidiaNimPlugin } from "@elizaos/plugin-nvidia-nim";
{{/if}}
{{#if plugin-0x}}
import { zxPlugin } from "@elizaos/plugin-0x";
{{/if}}
{{#if plugin-hyperbolic}}
import { hyperbolicPlugin } from "@elizaos/plugin-hyperbolic";
{{/if}}
{{#if plugin-omniflix}}
import { OmniflixPlugin } from "@elizaos/plugin-omniflix";
{{/if}}

import {
    AgentRuntime,
    CacheManager,
    CacheStore,
    type Character,
    type Client,
    Clients,
    DbCacheAdapter,
    defaultCharacter,
    elizaLogger,
    FsCacheAdapter,
    type IAgentRuntime,
    type ICacheManager,
    type IDatabaseAdapter,
    type IDatabaseCacheAdapter,
    ModelProviderName,
    parseBooleanFromText,
    settings,
    stringToUuid,
    validateCharacterConfig,
} from "@elizaos/core";

import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { normalizeCharacter } from "@elizaos/plugin-di";
import { elizaCodeinPlugin, onchainJson } from "@elizaos/plugin-iq6900";
import { createNodePlugin } from "@elizaos/plugin-node";
import { TEEMode, teePlugin } from "@elizaos/plugin-tee";
{{#if plugin-tee-log}}
import { teeLogPlugin } from "@elizaos/plugin-tee-log";
{{/if}}
{{#if plugin-email}}
import { emailPlugin } from "@elizaos/plugin-email";
{{/if}}
{{#if plugin-email-automation}}
import { emailAutomationPlugin } from "@elizaos/plugin-email-automation";
{{/if}}
{{#if plugin-sei}}
import { seiPlugin } from "@elizaos/plugin-sei";
{{/if}}
{{#if plugin-suno}}
import { sunoPlugin } from "@elizaos/plugin-suno";
{{/if}}
{{#if plugin-udio}}
import { udioPlugin } from "@elizaos/plugin-udio";
{{/if}}
{{#if plugin-imgflip}}
import { imgflipPlugin } from "@elizaos/plugin-imgflip";
{{/if}}
{{#if plugin-ethstorage}}
import { ethstoragePlugin } from "@elizaos/plugin-ethstorage";
{{/if}}
{{#if plugin-zerion}}
import { zerionPlugin } from "@elizaos/plugin-zerion";
{{/if}}
{{#if plugin-mina}}
import { minaPlugin } from "@elizaos/plugin-mina";
{{/if}}
{{#if plugin-ankr}}
import { ankrPlugin } from "@elizaos/plugin-ankr";
{{/if}}
{{#if plugin-form}}
import { formPlugin } from "@elizaos/plugin-form";
{{/if}}
{{#if plugin-quick-intel}}
import { quickIntelPlugin } from "@elizaos/plugin-quick-intel";
{{/if}}
{{#if plugin-trikon}}
import { trikonPlugin } from "@elizaos/plugin-trikon";
{{/if}}
{{#if plugin-arbitrage}}
import arbitragePlugin from "@elizaos/plugin-arbitrage";
{{/if}}

import Database from "better-sqlite3";
import fs from "fs";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import yargs from "yargs";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const wait = (minTime = 1000, maxTime = 3000) => {
    const waitTime =
        Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
    return new Promise((resolve) => setTimeout(resolve, waitTime));
};

const logFetch = async (url: string, options: any) => {
    elizaLogger.debug(`Fetching ${url}`);
    // Disabled to avoid disclosure of sensitive information such as API keys
    // elizaLogger.debug(JSON.stringify(options, null, 2));
    return fetch(url, options);
};

export function parseArguments(): {
    character?: string;
    characters?: string;
} {
    try {
        return yargs(process.argv.slice(3))
            .option("character", {
                type: "string",
                description: "Path to the character JSON file",
            })
            .option("characters", {
                type: "string",
                description:
                    "Comma separated list of paths to character JSON files",
            })
            .parseSync();
    } catch (error) {
        elizaLogger.error("Error parsing arguments:", error);
        return {};
    }
}

function tryLoadFile(filePath: string): string | null {
    try {
        return fs.readFileSync(filePath, "utf8");
    } catch (e) {
        return null;
    }
}
function mergeCharacters(base: Character, child: Character): Character {
    const mergeObjects = (baseObj: any, childObj: any) => {
        const result: any = {};
        const keys = new Set([
            ...Object.keys(baseObj || {}),
            ...Object.keys(childObj || {}),
        ]);
        keys.forEach((key) => {
            if (
                typeof baseObj[key] === "object" &&
                typeof childObj[key] === "object" &&
                !Array.isArray(baseObj[key]) &&
                !Array.isArray(childObj[key])
            ) {
                result[key] = mergeObjects(baseObj[key], childObj[key]);
            } else if (
                Array.isArray(baseObj[key]) ||
                Array.isArray(childObj[key])
            ) {
                result[key] = [
                    ...(baseObj[key] || []),
                    ...(childObj[key] || []),
                ];
            } else {
                result[key] =
                    childObj[key] !== undefined ? childObj[key] : baseObj[key];
            }
        });
        return result;
    };
    return mergeObjects(base, child);
}
function isAllStrings(arr: unknown[]): boolean {
    return Array.isArray(arr) && arr.every((item) => typeof item === "string");
}
export async function loadCharacterFromOnchain(): Promise<Character[]> {
    const jsonText = onchainJson;

    console.log("JSON:", jsonText);
    if (!jsonText) return [];
    const loadedCharacters = [];
    try {
        const character = JSON.parse(jsonText);
        validateCharacterConfig(character);

        // .id isn't really valid
        const characterId = character.id || character.name;
        const characterPrefix = `CHARACTER.${characterId
            .toUpperCase()
            .replace(/ /g, "_")}.`;

        const characterSettings = Object.entries(process.env)
            .filter(([key]) => key.startsWith(characterPrefix))
            .reduce((settings, [key, value]) => {
                const settingKey = key.slice(characterPrefix.length);
                settings[settingKey] = value;
                return settings;
            }, {});

        if (Object.keys(characterSettings).length > 0) {
            character.settings = character.settings || {};
            character.settings.secrets = {
                ...characterSettings,
                ...character.settings.secrets,
            };
        }

        // Handle plugins
        if (isAllStrings(character.plugins)) {
            elizaLogger.info("Plugins are: ", character.plugins);
            const importedPlugins = await Promise.all(
                character.plugins.map(async (plugin) => {
                    const importedPlugin = await import(plugin);
                    return importedPlugin.default;
                })
            );
            character.plugins = importedPlugins;
        }

        loadedCharacters.push(character);
        elizaLogger.info(
            `Successfully loaded character from: ${process.env.IQ_WALLET_ADDRESS}`
        );
        return loadedCharacters;
    } catch (e) {
        elizaLogger.error(
            `Error parsing character from ${process.env.IQ_WALLET_ADDRESS}: ${e}`
        );
        process.exit(1);
    }
}

async function loadCharactersFromUrl(url: string): Promise<Character[]> {
    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        let characters: Character[] = [];
        if (Array.isArray(responseJson)) {
            characters = await Promise.all(
                responseJson.map((character) => jsonToCharacter(url, character))
            );
        } else {
            const character = await jsonToCharacter(url, responseJson);
            characters.push(character);
        }
        return characters;
    } catch (e) {
        elizaLogger.error(`Error loading character(s) from ${url}: ${e}`);
        process.exit(1);
    }
}

async function jsonToCharacter(
    filePath: string,
    character: any
): Promise<Character> {
    validateCharacterConfig(character);

    // .id isn't really valid
    const characterId = character.id || character.name;
    const characterPrefix = `CHARACTER.${characterId
        .toUpperCase()
        .replace(/ /g, "_")}.`;
    const characterSettings = Object.entries(process.env)
        .filter(([key]) => key.startsWith(characterPrefix))
        .reduce((settings, [key, value]) => {
            const settingKey = key.slice(characterPrefix.length);
            return { ...settings, [settingKey]: value };
        }, {});
    if (Object.keys(characterSettings).length > 0) {
        character.settings = character.settings || {};
        character.settings.secrets = {
            ...characterSettings,
            ...character.settings.secrets,
        };
    }
    // Handle plugins
    character.plugins = await handlePluginImporting(character.plugins);
    if (character.extends) {
        elizaLogger.info(
            `Merging  ${character.name} character with parent characters`
        );
        for (const extendPath of character.extends) {
            const baseCharacter = await loadCharacter(
                path.resolve(path.dirname(filePath), extendPath)
            );
            character = mergeCharacters(baseCharacter, character);
            elizaLogger.info(
                `Merged ${character.name} with ${baseCharacter.name}`
            );
        }
    }
    return character;
}

async function loadCharacter(filePath: string): Promise<Character> {
    const content = tryLoadFile(filePath);
    if (!content) {
        throw new Error(`Character file not found: ${filePath}`);
    }
    const character = JSON.parse(content);
    return jsonToCharacter(filePath, character);
}

async function loadCharacterTryPath(characterPath: string): Promise<Character> {
    let content: string | null = null;
    let resolvedPath = "";

    // Try different path resolutions in order
    const pathsToTry = [
        characterPath, // exact path as specified
        path.resolve(process.cwd(), characterPath), // relative to cwd
        path.resolve(process.cwd(), "agent", characterPath), // Add this
        path.resolve(__dirname, characterPath), // relative to current script
        path.resolve(__dirname, "characters", path.basename(characterPath)), // relative to agent/characters
        path.resolve(__dirname, "../characters", path.basename(characterPath)), // relative to characters dir from agent
        path.resolve(
            __dirname,
            "../../characters",
            path.basename(characterPath)
        ), // relative to project root characters dir
    ];

    elizaLogger.info(
        "Trying paths:",
        pathsToTry.map((p) => ({
            path: p,
            exists: fs.existsSync(p),
        }))
    );

    for (const tryPath of pathsToTry) {
        content = tryLoadFile(tryPath);
        if (content !== null) {
            resolvedPath = tryPath;
            break;
        }
    }

    if (content === null) {
        elizaLogger.error(
            `Error loading character from ${characterPath}: File not found in any of the expected locations`
        );
        elizaLogger.error("Tried the following paths:");
        pathsToTry.forEach((p) => elizaLogger.error(` - ${p}`));
        throw new Error(
            `Error loading character from ${characterPath}: File not found in any of the expected locations`
        );
    }
    try {
        const character: Character = await loadCharacter(resolvedPath);
        elizaLogger.info(`Successfully loaded character from: ${resolvedPath}`);
        return character;
    } catch (e) {
        elizaLogger.error(`Error parsing character from ${resolvedPath}: ${e}`);
        throw new Error(`Error parsing character from ${resolvedPath}: ${e}`);
    }
}

function commaSeparatedStringToArray(commaSeparated: string): string[] {
    return commaSeparated?.split(",").map((value) => value.trim());
}

async function readCharactersFromStorage(
    characterPaths: string[]
): Promise<string[]> {
    try {
        const uploadDir = path.join(process.cwd(), "data", "characters");
        await fs.promises.mkdir(uploadDir, { recursive: true });
        const fileNames = await fs.promises.readdir(uploadDir);
        fileNames.forEach((fileName) => {
            characterPaths.push(path.join(uploadDir, fileName));
        });
    } catch (err) {
        elizaLogger.error(`Error reading directory: ${err.message}`);
    }

    return characterPaths;
}

export async function loadCharacters(
    charactersArg: string
): Promise<Character[]> {
    let characterPaths = commaSeparatedStringToArray(charactersArg);

    if (process.env.USE_CHARACTER_STORAGE === "true") {
        characterPaths = await readCharactersFromStorage(characterPaths);
    }

    const loadedCharacters: Character[] = [];

    if (characterPaths?.length > 0) {
        for (const characterPath of characterPaths) {
            try {
                const character: Character = await loadCharacterTryPath(
                    characterPath
                );
                loadedCharacters.push(character);
            } catch (e) {
                process.exit(1);
            }
        }
    }

    if (hasValidRemoteUrls()) {
        elizaLogger.info("Loading characters from remote URLs");
        const characterUrls = commaSeparatedStringToArray(
            process.env.REMOTE_CHARACTER_URLS
        );
        for (const characterUrl of characterUrls) {
            const characters = await loadCharactersFromUrl(characterUrl);
            loadedCharacters.push(...characters);
        }
    }

    if (loadedCharacters.length === 0) {
        elizaLogger.info("No characters found, using default character");
        loadedCharacters.push(defaultCharacter);
    }

    return loadedCharacters;
}

async function handlePluginImporting(plugins: string[]) {
    if (plugins.length > 0) {
        elizaLogger.info("Plugins are: ", plugins);
        const importedPlugins = await Promise.all(
            plugins.map(async (plugin) => {
                try {
                    const importedPlugin = await import(plugin);
                    const functionName =
                        plugin
                            .replace("@elizaos/plugin-", "")
                            .replace(/-./g, (x) => x[1].toUpperCase()) +
                        "Plugin"; // Assumes plugin function is camelCased with Plugin suffix
                    return (
                        importedPlugin.default || importedPlugin[functionName]
                    );
                } catch (importError) {
                    elizaLogger.error(
                        `Failed to import plugin: ${plugin}`,
                        importError
                    );
                    return []; // Return null for failed imports
                }
            })
        );
        return importedPlugins;
    } else {
        return [];
    }
}

export function getTokenForProvider(
    provider: ModelProviderName,
    character: Character
): string | undefined {
    switch (provider) {
        // no key needed for llama_local, ollama, lmstudio, gaianet or bedrock
        case ModelProviderName.LLAMALOCAL:
            return "";
        case ModelProviderName.OLLAMA:
            return "";
        case ModelProviderName.LMSTUDIO:
            return "";
        case ModelProviderName.GAIANET:
            return "";
        case ModelProviderName.BEDROCK:
            return "";
        case ModelProviderName.OPENAI:
            return (
                character.settings?.secrets?.OPENAI_API_KEY ||
                settings.OPENAI_API_KEY
            );
        case ModelProviderName.ETERNALAI:
            return (
                character.settings?.secrets?.ETERNALAI_API_KEY ||
                settings.ETERNALAI_API_KEY
            );
        case ModelProviderName.NINETEEN_AI:
            return (
                character.settings?.secrets?.NINETEEN_AI_API_KEY ||
                settings.NINETEEN_AI_API_KEY
            );
        case ModelProviderName.LLAMACLOUD:
        case ModelProviderName.TOGETHER:
            return (
                character.settings?.secrets?.LLAMACLOUD_API_KEY ||
                settings.LLAMACLOUD_API_KEY ||
                character.settings?.secrets?.TOGETHER_API_KEY ||
                settings.TOGETHER_API_KEY ||
                character.settings?.secrets?.OPENAI_API_KEY ||
                settings.OPENAI_API_KEY
            );
        case ModelProviderName.CLAUDE_VERTEX:
        case ModelProviderName.ANTHROPIC:
            return (
                character.settings?.secrets?.ANTHROPIC_API_KEY ||
                character.settings?.secrets?.CLAUDE_API_KEY ||
                settings.ANTHROPIC_API_KEY ||
                settings.CLAUDE_API_KEY
            );
        case ModelProviderName.REDPILL:
            return (
                character.settings?.secrets?.REDPILL_API_KEY ||
                settings.REDPILL_API_KEY
            );
        case ModelProviderName.OPENROUTER:
            return (
                character.settings?.secrets?.OPENROUTER_API_KEY ||
                settings.OPENROUTER_API_KEY
            );
        case ModelProviderName.GROK:
            return (
                character.settings?.secrets?.GROK_API_KEY ||
                settings.GROK_API_KEY
            );
        case ModelProviderName.HEURIST:
            return (
                character.settings?.secrets?.HEURIST_API_KEY ||
                settings.HEURIST_API_KEY
            );
        case ModelProviderName.GROQ:
            return (
                character.settings?.secrets?.GROQ_API_KEY ||
                settings.GROQ_API_KEY
            );
        case ModelProviderName.GALADRIEL:
            return (
                character.settings?.secrets?.GALADRIEL_API_KEY ||
                settings.GALADRIEL_API_KEY
            );
        case ModelProviderName.FAL:
            return (
                character.settings?.secrets?.FAL_API_KEY || settings.FAL_API_KEY
            );
        case ModelProviderName.ALI_BAILIAN:
            return (
                character.settings?.secrets?.ALI_BAILIAN_API_KEY ||
                settings.ALI_BAILIAN_API_KEY
            );
        case ModelProviderName.VOLENGINE:
            return (
                character.settings?.secrets?.VOLENGINE_API_KEY ||
                settings.VOLENGINE_API_KEY
            );
        case ModelProviderName.NANOGPT:
            return (
                character.settings?.secrets?.NANOGPT_API_KEY ||
                settings.NANOGPT_API_KEY
            );
        case ModelProviderName.HYPERBOLIC:
            return (
                character.settings?.secrets?.HYPERBOLIC_API_KEY ||
                settings.HYPERBOLIC_API_KEY
            );

        case ModelProviderName.VENICE:
            return (
                character.settings?.secrets?.VENICE_API_KEY ||
                settings.VENICE_API_KEY
            );
        case ModelProviderName.ATOMA:
            return (
                character.settings?.secrets?.ATOMASDK_BEARER_AUTH ||
                settings.ATOMASDK_BEARER_AUTH
            );
        case ModelProviderName.NVIDIA:
            return (
                character.settings?.secrets?.NVIDIA_API_KEY ||
                settings.NVIDIA_API_KEY
            );
        case ModelProviderName.AKASH_CHAT_API:
            return (
                character.settings?.secrets?.AKASH_CHAT_API_KEY ||
                settings.AKASH_CHAT_API_KEY
            );
        case ModelProviderName.GOOGLE:
            return (
                character.settings?.secrets?.GOOGLE_GENERATIVE_AI_API_KEY ||
                settings.GOOGLE_GENERATIVE_AI_API_KEY
            );
        case ModelProviderName.MISTRAL:
            return (
                character.settings?.secrets?.MISTRAL_API_KEY ||
                settings.MISTRAL_API_KEY
            );
        case ModelProviderName.LETZAI:
            return (
                character.settings?.secrets?.LETZAI_API_KEY ||
                settings.LETZAI_API_KEY
            );
        case ModelProviderName.INFERA:
            return (
                character.settings?.secrets?.INFERA_API_KEY ||
                settings.INFERA_API_KEY
            );
        case ModelProviderName.DEEPSEEK:
            return (
                character.settings?.secrets?.DEEPSEEK_API_KEY ||
                settings.DEEPSEEK_API_KEY
            );
        case ModelProviderName.LIVEPEER:
            return (
                character.settings?.secrets?.LIVEPEER_GATEWAY_URL ||
                settings.LIVEPEER_GATEWAY_URL
            );
        default:
            const errorMessage = `Failed to get token - unsupported model provider: ${provider}`;
            elizaLogger.error(errorMessage);
            throw new Error(errorMessage);
    }
}

function initializeDatabase(dataDir: string) {
    if (process.env.MONGODB_CONNECTION_STRING) {
        elizaLogger.log("Initializing database on MongoDB Atlas");
        const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, {
            maxPoolSize: 100,
            minPoolSize: 5,
            maxIdleTimeMS: 60000,
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            compressors: ["zlib"],
            retryWrites: true,
            retryReads: true,
        });

        const dbName = process.env.MONGODB_DATABASE || "elizaAgent";
        const db = new MongoDBDatabaseAdapter(client, dbName);

        // Test the connection
        db.init()
            .then(() => {
                elizaLogger.success("Successfully connected to MongoDB Atlas");
            })
            .catch((error) => {
                elizaLogger.error("Failed to connect to MongoDB Atlas:", error);
                throw error; // Re-throw to handle it in the calling code
            });

        return db;
    } else if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        elizaLogger.info("Initializing Supabase connection...");
        const db = new SupabaseDatabaseAdapter(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Test the connection
        db.init()
            .then(() => {
                elizaLogger.success(
                    "Successfully connected to Supabase database"
                );
            })
            .catch((error) => {
                elizaLogger.error("Failed to connect to Supabase:", error);
            });

        return db;
    } else if (process.env.POSTGRES_URL) {
        elizaLogger.info("Initializing PostgreSQL connection...");
        const db = new PostgresDatabaseAdapter({
            connectionString: process.env.POSTGRES_URL,
            parseInputs: true,
        });

        // Test the connection
        db.init()
            .then(() => {
                elizaLogger.success(
                    "Successfully connected to PostgreSQL database"
                );
            })
            .catch((error) => {
                elizaLogger.error("Failed to connect to PostgreSQL:", error);
            });

        return db;
    } else if (process.env.PGLITE_DATA_DIR) {
        elizaLogger.info("Initializing PgLite adapter...");
        // `dataDir: memory://` for in memory pg
        const db = new PGLiteDatabaseAdapter({
            dataDir: process.env.PGLITE_DATA_DIR,
        });
        return db;
    } else if (
        process.env.QDRANT_URL &&
        process.env.QDRANT_KEY &&
        process.env.QDRANT_PORT &&
        process.env.QDRANT_VECTOR_SIZE
    ) {
        elizaLogger.info("Initializing Qdrant adapter...");
        const db = new QdrantDatabaseAdapter(
            process.env.QDRANT_URL,
            process.env.QDRANT_KEY,
            Number(process.env.QDRANT_PORT),
            Number(process.env.QDRANT_VECTOR_SIZE)
        );
        return db;
    } else {
        const filePath =
            process.env.SQLITE_FILE ?? path.resolve(dataDir, "db.sqlite");
        elizaLogger.info(`Initializing SQLite database at ${filePath}...`);
        const db = new SqliteDatabaseAdapter(new Database(filePath));

        // Test the connection
        db.init()
            .then(() => {
                elizaLogger.success(
                    "Successfully connected to SQLite database"
                );
            })
            .catch((error) => {
                elizaLogger.error("Failed to connect to SQLite:", error);
            });

        return db;
    }
}

// also adds plugins from character file into the runtime
export async function initializeClients(
    character: Character,
    runtime: IAgentRuntime
) {
    // each client can only register once
    // and if we want two we can explicitly support it
    const clients: Record<string, any> = {};
    const clientTypes: string[] =
        character.clients?.map((str) => str.toLowerCase()) || [];
    elizaLogger.log("initializeClients", clientTypes, "for", character.name);

    // Start Auto Client if "auto" detected as a configured client
    if (clientTypes.includes(Clients.AUTO)) {
        const autoClient = await AutoClientInterface.start(runtime);
        if (autoClient) clients.auto = autoClient;
    }
    {{#if client-xmtp}}
    if (clientTypes.includes(Clients.XMTP)) {
        const xmtpClient = await XmtpClientInterface.start(runtime);
        if (xmtpClient) clients.xmtp = xmtpClient;
    }
    {{/if}}
    {{#if client-discord}}
    if (clientTypes.includes(Clients.DISCORD)) {
        const discordClient = await DiscordClientInterface.start(runtime);
        if (discordClient) clients.discord = discordClient;
    }
    {{/if}}
    {{#if client-telegram}}
    if (clientTypes.includes(Clients.TELEGRAM)) {
        const telegramClient = await TelegramClientInterface.start(runtime);
        if (telegramClient) clients.telegram = telegramClient;
    }
    {{/if}}
    {{#if client-telegram-account}}
    if (clientTypes.includes(Clients.TELEGRAM_ACCOUNT)) {
        const telegramAccountClient = await TelegramAccountClientInterface.start(runtime);
        if (telegramAccountClient) clients.telegram_account = telegramAccountClient;
    }
    {{/if}}
    {{#if client-twitter}}
    if (clientTypes.includes(Clients.TWITTER)) {
        const twitterClient = await TwitterClientInterface.start(runtime);
        if (twitterClient) clients.twitter = twitterClient;
    }
    {{/if}}
    {{#if client-github}}
    if (clientTypes.includes(Clients.GITHUB)) {
        const githubClient = await GitHubClientInterface.start(runtime);
        if (githubClient) clients.github = githubClient;
    }
    {{/if}}
    {{#if client-alexa}}
    if (clientTypes.includes(Clients.ALEXA)) {
        const alexaClient = await AlexaClientInterface.start(runtime);
        if (alexaClient) clients.alexa = alexaClient;
    }
    {{/if}}
    {{#if client-instagram}}
    if (clientTypes.includes(Clients.INSTAGRAM)) {
        const instagramClient = await InstagramClientInterface.start(runtime);
        if (instagramClient) clients.instagram = instagramClient;
    }
    {{/if}}
    {{#if client-farcaster}}
    if (clientTypes.includes(Clients.FARCASTER)) {
        const farcasterClient = await FarcasterClientInterface.start(runtime);
        if (farcasterClient) clients.farcaster = farcasterClient;
    }
    {{/if}}
    {{#if client-lens}}
    if (clientTypes.includes("lens")) {
        const lensClient = new LensAgentClient(runtime);
        lensClient.start();
        clients.lens = lensClient;
    }
    {{/if}}
    {{#if client-simsai}}
    if (clientTypes.includes(Clients.SIMSAI)) {
        const simsaiClient = await JeeterClientInterface.start(runtime);
        if (simsaiClient) clients.simsai = simsaiClient;
    }
    {{/if}}
    {{#if client-deva}}
    if (clientTypes.includes("deva")) {
        const devaClient = await DevaClientInterface.start(runtime);
        if (devaClient) clients.deva = devaClient;
    }
    {{/if}}
    {{#if client-slack}}
    if (clientTypes.includes("slack")) {
        const slackClient = await SlackClientInterface.start(runtime);
        if (slackClient) clients.slack = slackClient;
    }
    {{/if}}

    elizaLogger.log("client keys", Object.keys(clients));

    function determineClientType(client: Client): string {
        // Check if client has a direct type identifier
        if ("type" in client) {
            return (client as any).type;
        }

        // Check constructor name
        const constructorName = client.constructor?.name;
        if (constructorName && !constructorName.includes("Object")) {
            return constructorName.toLowerCase().replace("client", "");
        }

        // Fallback: Generate a unique identifier
        return `client_${Date.now()}`;
    }

    if (character.plugins?.length > 0) {
        for (const plugin of character.plugins) {
            if (plugin.clients) {
                for (const client of plugin.clients) {
                    const startedClient = await client.start(runtime);
                    const clientType = determineClientType(client);
                    elizaLogger.debug(
                        `Initializing client of type: ${clientType}`
                    );
                    clients[clientType] = startedClient;
                }
            }
        }
    }

    return clients;
}

function getSecret(character: Character, secret: string) {
    return character.settings?.secrets?.[secret] || process.env[secret];
}

let nodePlugin: any | undefined;

export async function createAgent(
    character: Character,
    db: IDatabaseAdapter,
    cache: ICacheManager,
    token: string
): Promise<AgentRuntime> {
    elizaLogger.log(`Creating runtime for character ${character.name}`);

    nodePlugin ??= createNodePlugin();

    const teeMode = getSecret(character, "TEE_MODE") || "OFF";
    const walletSecretSalt = getSecret(character, "WALLET_SECRET_SALT");

    // Validate TEE configuration
    if (teeMode !== TEEMode.OFF && !walletSecretSalt) {
        elizaLogger.error(
            "A WALLET_SECRET_SALT required when TEE_MODE is enabled"
        );
        throw new Error("Invalid TEE configuration");
    }

    let goatPlugin: any | undefined;
    {{#if plugin-goat}}
    if (getSecret(character, "EVM_PRIVATE_KEY")) {
        goatPlugin = await createGoatPlugin((secret) => getSecret(character, secret));
    }
    {{/if}}

    let zilliqaPlugin: any | undefined;
    {{#if plugin-zilliqa}}
    if (getSecret(character, "ZILLIQA_PRIVATE_KEY")) {
        zilliqaPlugin = await createZilliqaPlugin((secret) => getSecret(character, secret));
    }
    {{/if}}

    let verifiableInferenceAdapter;
    {{#if plugin-opacity}}
    if (
        process.env.OPACITY_TEAM_ID &&
        process.env.OPACITY_CLOUDFLARE_NAME &&
        process.env.OPACITY_PROVER_URL &&
        process.env.VERIFIABLE_INFERENCE_ENABLED === "true"
    ) {
        verifiableInferenceAdapter = new OpacityAdapter({
            teamId: process.env.OPACITY_TEAM_ID,
            teamName: process.env.OPACITY_CLOUDFLARE_NAME,
            opacityProverUrl: process.env.OPACITY_PROVER_URL,
            modelProvider: character.modelProvider,
            token: token,
        });
        elizaLogger.log("Verifiable inference adapter initialized");
        elizaLogger.log("teamId", process.env.OPACITY_TEAM_ID);
        elizaLogger.log("teamName", process.env.OPACITY_CLOUDFLARE_NAME);
        elizaLogger.log("opacityProverUrl", process.env.OPACITY_PROVER_URL);
        elizaLogger.log("modelProvider", character.modelProvider);
        elizaLogger.log("token", token);
    }
    {{/if}}

    {{#if plugin-primus}}
    if (
        process.env.PRIMUS_APP_ID &&
        process.env.PRIMUS_APP_SECRET &&
        process.env.VERIFIABLE_INFERENCE_ENABLED === "true"
    ) {
        verifiableInferenceAdapter = new PrimusAdapter({
            appId: process.env.PRIMUS_APP_ID,
            appSecret: process.env.PRIMUS_APP_SECRET,
            attMode: "proxytls",
            modelProvider: character.modelProvider,
            token,
        });
        elizaLogger.log("Verifiable inference primus adapter initialized");
    }
    {{/if}}

    return new AgentRuntime({
        databaseAdapter: db,
        token,
        modelProvider: character.modelProvider,
        evaluators: [],
        character,
        // character.plugins are handled when clients are added
        plugins: [
            bootstrapPlugin,
            nodePlugin,
            {{#if plugin-bittensor}}
            parseBooleanFromText(getSecret(character, "BITMIND")) &&
            getSecret(character, "BITMIND_API_TOKEN")
                ? bittensorPlugin
                : null,
            {{/if}}
            {{#if plugin-email-automation}}
            parseBooleanFromText(getSecret(character, "EMAIL_AUTOMATION_ENABLED"))
                ? emailAutomationPlugin
                : null,
            {{/if}}
            {{#if plugin-iq6900}}
            getSecret(character, "IQ_WALLET_ADDRESS") &&
            getSecret(character, "IQSOlRPC")
                ? elizaCodeinPlugin
                : null,
            {{/if}}
            {{#if plugin-agentkit}}
            getSecret(character, "CDP_API_KEY_NAME") &&
            getSecret(character, "CDP_API_KEY_PRIVATE_KEY") &&
            getSecret(character, "CDP_AGENT_KIT_NETWORK")
                ? agentKitPlugin
                : null,
            {{/if}}
            {{#if plugin-dexscreener}}
            getSecret(character, "DEXSCREENER_API_KEY")
                ? dexScreenerPlugin
                : null,
            {{/if}}
            {{#if plugin-football}}
            getSecret(character, "FOOTBALL_API_KEY") ? footballPlugin : null,
            {{/if}}
            {{#if plugin-conflux}}
            getSecret(character, "CONFLUX_CORE_PRIVATE_KEY")
                ? confluxPlugin
                : null,
            {{/if}}
            {{#if plugin-router-nitro}}
            getSecret(character, "ROUTER_NITRO_EVM_PRIVATE_KEY") &&
            getSecret(character, "ROUTER_NITRO_EVM_ADDRESS")
                ? nitroPlugin
                : null,
            {{/if}}
            {{#if plugin-web-search}}
            getSecret(character, "TAVILY_API_KEY") ? webSearchPlugin : null,
            {{/if}}
            {{#if plugin-solana}}
            getSecret(character, "SOLANA_PUBLIC_KEY") ||
            (getSecret(character, "WALLET_PUBLIC_KEY") &&
                !getSecret(character, "WALLET_PUBLIC_KEY")?.startsWith("0x"))
                ? [solanaPlugin, solanaPluginV2]
                : null,
            {{/if}}
            {{#if plugin-solana-agent-kit}}
            getSecret(character, "SOLANA_PRIVATE_KEY")
                ? solanaAgentkitPlugin
                : null,
            {{/if}}
            {{#if plugin-autonome}}
            getSecret(character, "AUTONOME_JWT_TOKEN") ? autonomePlugin : null,
            {{/if}}
            {{#if plugin-near}}
            (getSecret(character, "NEAR_ADDRESS") ||
                getSecret(character, "NEAR_WALLET_PUBLIC_KEY")) &&
            getSecret(character, "NEAR_WALLET_SECRET_KEY")
                ? nearPlugin
                : null,
            {{/if}}
            {{#if plugin-evm}}
            getSecret(character, "EVM_PUBLIC_KEY") ||
            (getSecret(character, "WALLET_PUBLIC_KEY") &&
                getSecret(character, "WALLET_PUBLIC_KEY")?.startsWith("0x"))
                ? evmPlugin
                : null,
            {{/if}}
            {{#if plugin-injective}}
            (getSecret(character, "EVM_PUBLIC_KEY") ||
                getSecret(character, "INJECTIVE_PUBLIC_KEY")) &&
            getSecret(character, "INJECTIVE_PRIVATE_KEY")
                ? injectivePlugin
                : null,
            {{/if}}
            {{#if plugin-cosmos}}
            getSecret(character, "COSMOS_RECOVERY_PHRASE") &&
            getSecret(character, "COSMOS_AVAILABLE_CHAINS") &&
            createCosmosPlugin(),
            {{/if}}
            {{#if plugin-nft-generation}}
            (getSecret(character, "SOLANA_PUBLIC_KEY") ||
                (getSecret(character, "WALLET_PUBLIC_KEY") &&
                    !getSecret(character, "WALLET_PUBLIC_KEY")?.startsWith("0x"))) &&
            getSecret(character, "SOLANA_ADMIN_PUBLIC_KEY") &&
            getSecret(character, "SOLANA_PRIVATE_KEY") &&
            getSecret(character, "SOLANA_ADMIN_PRIVATE_KEY")
                ? nftGenerationPlugin
                : null,
            {{/if}}
            {{#if plugin-0g}}
            getSecret(character, "ZEROG_PRIVATE_KEY") ? zgPlugin : null,
            {{/if}}
            {{#if plugin-coinmarketcap}}
            getSecret(character, "COINMARKETCAP_API_KEY")
                ? coinmarketcapPlugin
                : null,
            {{/if}}
            {{#if plugin-zerion}}
            getSecret(character, "ZERION_API_KEY") ? zerionPlugin : null,
            {{/if}}
            {{#if plugin-coinbase}}
            getSecret(character, "COINBASE_COMMERCE_KEY")
                ? coinbaseCommercePlugin
                : null,
            {{/if}}
            {{#if plugin-image-generation}}
            getSecret(character, "FAL_API_KEY") ||
            getSecret(character, "OPENAI_API_KEY") ||
            getSecret(character, "VENICE_API_KEY") ||
            getSecret(character, "NVIDIA_API_KEY") ||
            getSecret(character, "NINETEEN_AI_API_KEY") ||
            getSecret(character, "HEURIST_API_KEY") ||
            getSecret(character, "LIVEPEER_GATEWAY_URL")
                ? imageGenerationPlugin
                : null,
            {{/if}}
            {{#if plugin-3d-generation}}
            getSecret(character, "FAL_API_KEY") ? ThreeDGenerationPlugin : null,
            {{/if}}
            {{#if plugin-coinbase}}
            ...(getSecret(character, "COINBASE_API_KEY") &&
            getSecret(character, "COINBASE_PRIVATE_KEY")
                ? [
                      coinbaseMassPaymentsPlugin,
                      tradePlugin,
                      tokenContractPlugin,
                      advancedTradePlugin,
                  ]
                : []),
            {{/if}}
            {{#if plugin-tee}}
            ...(teeMode !== TEEMode.OFF && walletSecretSalt ? [teePlugin] : []),
            {{/if}}
            {{#if plugin-tee-verifiable-log}}
            teeMode !== TEEMode.OFF &&
            walletSecretSalt &&
            getSecret(character, "VLOG")
                ? verifiableLogPlugin
                : null,
            {{/if}}
            {{#if plugin-sgx}}
            getSecret(character, "SGX") ? sgxPlugin : null,
            {{/if}}
            {{#if plugin-tee-log}}
            getSecret(character, "ENABLE_TEE_LOG") &&
            ((teeMode !== TEEMode.OFF && walletSecretSalt) ||
                getSecret(character, "SGX"))
                ? teeLogPlugin
                : null,
            {{/if}}
            {{#if plugin-omniflix}}
            getSecret(character, "OMNIFLIX_API_URL") &&
            getSecret(character, "OMNIFLIX_MNEMONIC")
                ? OmniflixPlugin
                : null,
            {{/if}}
            {{#if plugin-coinbase}}
            getSecret(character, "COINBASE_API_KEY") &&
            getSecret(character, "COINBASE_PRIVATE_KEY") &&
            getSecret(character, "COINBASE_NOTIFICATION_URI")
                ? webhookPlugin
                : null,
            {{/if}}
            {{#if plugin-goat}}
            goatPlugin,
            {{/if}}
            {{#if plugin-zilliqa}}
            zilliqaPlugin,
            {{/if}}
            {{#if plugin-coingecko}}
            getSecret(character, "COINGECKO_API_KEY") ||
            getSecret(character, "COINGECKO_PRO_API_KEY")
                ? coingeckoPlugin
                : null,
            {{/if}}
            {{#if plugin-moralis}}
            getSecret(character, "MORALIS_API_KEY") ? moralisPlugin : null,
            {{/if}}
            {{#if plugin-goat}}
            getSecret(character, "EVM_PROVIDER_URL") ? goatPlugin : null,
            {{/if}}
            {{#if plugin-abstract}}
            getSecret(character, "ABSTRACT_PRIVATE_KEY")
                ? abstractPlugin
                : null,
            {{/if}}
            {{#if plugin-b2}}
            getSecret(character, "B2_PRIVATE_KEY") ? b2Plugin : null,
            {{/if}}
            {{#if plugin-binance}}
            getSecret(character, "BINANCE_API_KEY") &&
            getSecret(character, "BINANCE_SECRET_KEY")
                ? binancePlugin
                : null,
            {{/if}}
            {{#if plugin-flow}}
            getSecret(character, "FLOW_ADDRESS") &&
            getSecret(character, "FLOW_PRIVATE_KEY")
                ? flowPlugin
                : null,
            {{/if}}
            {{#if plugin-lens-network}}
            getSecret(character, "LENS_ADDRESS") &&
            getSecret(character, "LENS_PRIVATE_KEY")
                ? lensPlugin
                : null,
            {{/if}}
            {{#if plugin-aptos}}
            getSecret(character, "APTOS_PRIVATE_KEY") ? aptosPlugin : null,
            {{/if}}
            {{#if plugin-mind-network}}
            getSecret(character, "MIND_COLD_WALLET_ADDRESS")
            ? mindNetworkPlugin
            : null,
            {{/if}}
            {{#if plugin-multiversx}}
            getSecret(character, "MVX_PRIVATE_KEY") ? multiversxPlugin : null,
            {{/if}}
            {{#if plugin-zksync-era}}
            getSecret(character, "ZKSYNC_PRIVATE_KEY") ? zksyncEraPlugin : null,
            {{/if}}
            {{#if plugin-cronoszkevm}}
            getSecret(character, "CRONOSZKEVM_PRIVATE_KEY")
                ? cronosZkEVMPlugin
                : null,
            {{/if}}
            {{#if plugin-tee-marlin}}
            getSecret(character, "TEE_MARLIN") ? teeMarlinPlugin : null,
            {{/if}}
            {{#if plugin-ton}}
            getSecret(character, "TON_PRIVATE_KEY") ? tonPlugin : null,
            {{/if}}
            {{#if plugin-thirdweb}}
            getSecret(character, "THIRDWEB_SECRET_KEY") ? thirdwebPlugin : null,
            {{/if}}
            {{#if plugin-sui}}
            getSecret(character, "SUI_PRIVATE_KEY") ? suiPlugin : null,
            {{/if}}
            {{#if plugin-story}}
            getSecret(character, "STORY_PRIVATE_KEY") ? storyPlugin : null,
            {{/if}}
            {{#if plugin-squid-router}}
            getSecret(character, "SQUID_SDK_URL") &&
            getSecret(character, "SQUID_INTEGRATOR_ID") &&
            getSecret(character, "SQUID_EVM_ADDRESS") &&
            getSecret(character, "SQUID_EVM_PRIVATE_KEY") &&
            getSecret(character, "SQUID_API_THROTTLE_INTERVAL")
                ? squidRouterPlugin
                : null,
            {{/if}}
            {{#if plugin-fuel}}
            getSecret(character, "FUEL_PRIVATE_KEY") ? fuelPlugin : null,
            {{/if}}
            {{#if plugin-avalanche}}
            getSecret(character, "AVALANCHE_PRIVATE_KEY")
                ? avalanchePlugin
                : null,
            {{/if}}
            {{#if plugin-birdeye}}
            getSecret(character, "BIRDEYE_API_KEY") ? birdeyePlugin : null,
            {{/if}}
            {{#if plugin-echochambers}}
            getSecret(character, "ECHOCHAMBERS_API_URL") &&
            getSecret(character, "ECHOCHAMBERS_API_KEY")
                ? echoChambersPlugin
                : null,
            {{/if}}
            {{#if plugin-letzai}}
            getSecret(character, "LETZAI_API_KEY") ? letzAIPlugin : null,
            {{/if}}
            {{#if plugin-stargaze}}
            getSecret(character, "STARGAZE_ENDPOINT") ? stargazePlugin : null,
            {{/if}}
            {{#if plugin-giphy}}
            getSecret(character, "GIPHY_API_KEY") ? giphyPlugin : null,
            {{/if}}
            {{#if plugin-gitcoin-passport}}
            getSecret(character, "PASSPORT_API_KEY")
                ? gitcoinPassportPlugin
                : null,
            {{/if}}
            {{#if plugin-genlayer}}
            getSecret(character, "GENLAYER_PRIVATE_KEY")
                ? genLayerPlugin
                : null,
            {{/if}}
            {{#if plugin-avail}}
            getSecret(character, "AVAIL_SEED") &&
            getSecret(character, "AVAIL_APP_ID")
                ? availPlugin
                : null,
            {{/if}}
            {{#if plugin-open-weather}}
            getSecret(character, "OPEN_WEATHER_API_KEY")
                ? openWeatherPlugin
                : null,
            {{/if}}
            {{#if plugin-obsidian}}
            getSecret(character, "OBSIDIAN_API_TOKEN") ? obsidianPlugin : null,
            {{/if}}
            {{#if plugin-arthera}}
            getSecret(character, "ARTHERA_PRIVATE_KEY")?.startsWith("0x")
                ? artheraPlugin
                : null,
            {{/if}}
            {{#if plugin-allora}}
            getSecret(character, "ALLORA_API_KEY") ? alloraPlugin : null,
            {{/if}}
            {{#if plugin-hyperliquid}}
            getSecret(character, "HYPERLIQUID_PRIVATE_KEY")
                ? hyperliquidPlugin
                : null,
            {{/if}}
            {{#if plugin-hyperliquid-testnet}}
            getSecret(character, "HYPERLIQUID_TESTNET")
                ? hyperliquidPlugin
                : null,
            {{/if}}
            {{#if plugin-akash}}
            getSecret(character, "AKASH_MNEMONIC") &&
            getSecret(character, "AKASH_WALLET_ADDRESS")
                ? akashPlugin
                : null,
            {{/if}}
            {{#if plugin-chainbase}}
            getSecret(character, "CHAINBASE_API_KEY") ? chainbasePlugin : null,
            {{/if}}
            {{#if plugin-quai}}
            getSecret(character, "QUAI_PRIVATE_KEY") ? quaiPlugin : null,
            {{/if}}
            {{#if plugin-reservoir}}
            getSecret(character, "RESERVOIR_API_KEY")
                ? createNFTCollectionsPlugin()
                : null,
            {{/if}}
            {{#if plugin-0x}}
            getSecret(character, "ZERO_EX_API_KEY") ? zxPlugin : null,
            {{/if}}
            {{#if plugin-dkg}}
            getSecret(character, "DKG_PRIVATE_KEY") ? dkgPlugin : null,
            {{/if}}
            {{#if plugin-pyth-data}}
            getSecret(character, "PYTH_TESTNET_PROGRAM_KEY") ||
            getSecret(character, "PYTH_MAINNET_PROGRAM_KEY")
                ? pythDataPlugin
                : null,
            {{/if}}
            {{#if plugin-lightning}}
            getSecret(character, "LND_TLS_CERT") &&
            getSecret(character, "LND_MACAROON") &&
            getSecret(character, "LND_SOCKET")
                ? lightningPlugin
                : null,
            {{/if}}
            {{#if plugin-openai}}
            getSecret(character, "OPENAI_API_KEY") &&
            parseBooleanFromText(
                getSecret(character, "ENABLE_OPEN_AI_COMMUNITY_PLUGIN")
            )
                ? openaiPlugin
                : null,
            {{/if}}
            {{#if plugin-devin}}
            getSecret(character, "DEVIN_API_TOKEN") ? devinPlugin : null,
            {{/if}}
            {{#if plugin-initia}}
            getSecret(character, "INITIA_PRIVATE_KEY") ? initiaPlugin : null,
            {{/if}}
            {{#if plugin-holdstation}}
            getSecret(character, "HOLDSTATION_PRIVATE_KEY")
                ? holdstationPlugin
                : null,
            {{/if}}
            {{#if plugin-nvidia-nim}}
            getSecret(character, "NVIDIA_NIM_API_KEY") ||
            getSecret(character, "NVIDIA_NGC_API_KEY")
                ? nvidiaNimPlugin
                : null,
            {{/if}}
            {{#if plugin-bnb}}
            getSecret(character, "BNB_PRIVATE_KEY") ||
            getSecret(character, "BNB_PUBLIC_KEY")?.startsWith("0x")
                ? bnbPlugin
                : null,
            {{/if}}
            {{#if plugin-email}}
            (getSecret(character, "EMAIL_INCOMING_USER") &&
                getSecret(character, "EMAIL_INCOMING_PASS")) ||
            (getSecret(character, "EMAIL_OUTGOING_USER") &&
                getSecret(character, "EMAIL_OUTGOING_PASS"))
                ? emailPlugin
                : null,
            {{/if}}
            {{#if plugin-sei}}
            getSecret(character, "SEI_PRIVATE_KEY") ? seiPlugin : null,
            {{/if}}
            {{#if plugin-hyperbolic}}
            getSecret(character, "HYPERBOLIC_API_KEY")
                ? hyperbolicPlugin
                : null,
            {{/if}}
            {{#if plugin-suno}}
            getSecret(character, "SUNO_API_KEY") ? sunoPlugin : null,
            {{/if}}
            {{#if plugin-udio}}
            getSecret(character, "UDIO_AUTH_TOKEN") ? udioPlugin : null,
            {{/if}}
            {{#if plugin-imgflip}}
            getSecret(character, "IMGFLIP_USERNAME") &&
            getSecret(character, "IMGFLIP_PASSWORD")
                ? imgflipPlugin
                : null,
            {{/if}}
            {{#if plugin-lit}}
            getSecret(character, "FUNDING_PRIVATE_KEY") &&
            getSecret(character, "EVM_RPC_URL")
                ? litPlugin
                : null,
            {{/if}}
            {{#if plugin-ethstorage}}
            getSecret(character, "ETHSTORAGE_PRIVATE_KEY")
                ? ethstoragePlugin
                : null,
            {{/if}}
            {{#if plugin-mina}}
            getSecret(character, "MINA_PRIVATE_KEY") ? minaPlugin : null,
            {{/if}}
            {{#if plugin-form}}
            getSecret(character, "FORM_PRIVATE_KEY") ? formPlugin : null,
            {{/if}}
            {{#if plugin-ankr}}
            getSecret(character, "ANKR_WALLET") ? ankrPlugin : null,
            {{/if}}
            {{#if plugin-dcap}}
            getSecret(character, "DCAP_EVM_PRIVATE_KEY") &&
            getSecret(character, "DCAP_MODE")
                ? dcapPlugin
                : null,
            {{/if}}
            {{#if plugin-quick-intel}}
            getSecret(character, "QUICKINTEL_API_KEY")
                ? quickIntelPlugin
                : null,
            {{/if}}
            {{#if plugin-gelato}}
            getSecret(character, "GELATO_RELAY_API_KEY") ? gelatoPlugin : null,
            {{/if}}
            {{#if plugin-trikon}}
            getSecret(character, "TRIKON_WALLET_ADDRESS") ? trikonPlugin : null,
            {{/if}}
            {{#if plugin-arbitrage}}
            getSecret(character, "ARBITRAGE_EVM_PRIVATE_KEY") &&
            (getSecret(character, "ARBITRAGE_EVM_PROVIDER_URL") ||
                getSecret(character, "ARBITRAGE_ETHEREUM_WS_URL")) &&
            getSecret(character, "ARBITRAGE_FLASHBOTS_RELAY_SIGNING_KEY") &&
            getSecret(character, "ARBITRAGE_BUNDLE_EXECUTOR_ADDRESS")
                ? arbitragePlugin
                : null,
            {{/if}}
            {{#if plugin-stargaze}}
            getSecret(character, "STARGAZE_ENDPOINT") ? stargazePlugin : null,
            {{/if}}
        ]
            .flat()
            .filter(Boolean),
        providers: [],
        managers: [],
        cacheManager: cache,
        fetch: logFetch,
        {{#if plugin-opacity}}
        verifiableInferenceAdapter,
        {{else if plugin-primus}}
        verifiableInferenceAdapter,
        {{/if}}
    });
}

function initializeFsCache(baseDir: string, character: Character) {
    if (!character?.id) {
        throw new Error(
            "initializeFsCache requires id to be set in character definition"
        );
    }
    const cacheDir = path.resolve(baseDir, character.id, "cache");

    const cache = new CacheManager(new FsCacheAdapter(cacheDir));
    return cache;
}

function initializeDbCache(character: Character, db: IDatabaseCacheAdapter) {
    if (!character?.id) {
        throw new Error(
            "initializeFsCache requires id to be set in character definition"
        );
    }
    const cache = new CacheManager(new DbCacheAdapter(db, character.id));
    return cache;
}

function initializeCache(
    cacheStore: string,
    character: Character,
    baseDir?: string,
    db?: IDatabaseCacheAdapter
) {
    switch (cacheStore) {
        case CacheStore.REDIS:
            if (process.env.REDIS_URL) {
                elizaLogger.info("Connecting to Redis...");
                const redisClient = new RedisClient(process.env.REDIS_URL);
                if (!character?.id) {
                    throw new Error(
                        "CacheStore.REDIS requires id to be set in character definition"
                    );
                }
                return new CacheManager(
                    new DbCacheAdapter(redisClient, character.id) // Using DbCacheAdapter since RedisClient also implements IDatabaseCacheAdapter
                );
            } else {
                throw new Error("REDIS_URL environment variable is not set.");
            }

        case CacheStore.DATABASE:
            if (db) {
                elizaLogger.info("Using Database Cache...");
                return initializeDbCache(character, db);
            } else {
                throw new Error(
                    "Database adapter is not provided for CacheStore.Database."
                );
            }

        case CacheStore.FILESYSTEM:
            elizaLogger.info("Using File System Cache...");
            if (!baseDir) {
                throw new Error(
                    "baseDir must be provided for CacheStore.FILESYSTEM."
                );
            }
            return initializeFsCache(baseDir, character);

        default:
            throw new Error(
                `Invalid cache store: ${cacheStore} or required configuration missing.`
            );
    }
}

async function startAgent(
    character: Character,
    directClient: DirectClient
): Promise<AgentRuntime> {
    let db: IDatabaseAdapter & IDatabaseCacheAdapter;
    try {
        character.id ??= stringToUuid(character.name);
        character.username ??= character.name;

        const token = getTokenForProvider(character.modelProvider, character);
        const dataDir = path.join(__dirname, "../data");

        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        db = initializeDatabase(dataDir) as IDatabaseAdapter &
            IDatabaseCacheAdapter;

        await db.init();

        const cache = initializeCache(
            process.env.CACHE_STORE ?? CacheStore.DATABASE,
            character,
            "",
            db
        ); // "" should be replaced with dir for file system caching. THOUGHTS: might probably make this into an env
        const runtime: AgentRuntime = await createAgent(
            character,
            db,
            cache,
            token
        );

        // start services/plugins/process knowledge
        await runtime.initialize();

        // start assigned clients
        runtime.clients = await initializeClients(character, runtime);

        // add to container
        directClient.registerAgent(runtime);

        // report to console
        elizaLogger.debug(`Started ${character.name} as ${runtime.agentId}`);

        return runtime;
    } catch (error) {
        elizaLogger.error(
            `Error starting agent for character ${character.name}:`,
            error
        );
        elizaLogger.error(error);
        if (db) {
            await db.close();
        }
        throw error;
    }
}

const checkPortAvailable = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.once("error", (err: NodeJS.ErrnoException) => {
            if (err.code === "EADDRINUSE") {
                resolve(false);
            }
        });

        server.once("listening", () => {
            server.close();
            resolve(true);
        });

        server.listen(port);
    });
};

const hasValidRemoteUrls = () =>
    process.env.REMOTE_CHARACTER_URLS &&
    process.env.REMOTE_CHARACTER_URLS !== "" &&
    process.env.REMOTE_CHARACTER_URLS.startsWith("http");

const startAgents = async () => {
    const directClient = new DirectClient();
    let serverPort = Number.parseInt(settings.SERVER_PORT || "3000");
    const args = parseArguments();
    const charactersArg = args.characters || args.character;
    let characters = [defaultCharacter];

    if (process.env.IQ_WALLET_ADDRESS && process.env.IQSOlRPC) {
        characters = await loadCharacterFromOnchain();
    }

    const notOnchainJson = !onchainJson || onchainJson == "null";

    if ((notOnchainJson && charactersArg) || hasValidRemoteUrls()) {
        characters = await loadCharacters(charactersArg);
    }

    // Normalize characters for injectable plugins
    characters = await Promise.all(characters.map(normalizeCharacter));

    try {
        for (const character of characters) {
            await startAgent(character, directClient);
        }
    } catch (error) {
        elizaLogger.error("Error starting agents:", error);
    }

    // Find available port
    while (!(await checkPortAvailable(serverPort))) {
        elizaLogger.warn(
            `Port ${serverPort} is in use, trying ${serverPort + 1}`
        );
        serverPort++;
    }

    // upload some agent functionality into directClient
    directClient.startAgent = async (character) => {
        // Handle plugins
        character.plugins = await handlePluginImporting(character.plugins);

        // wrap it so we don't have to inject directClient later
        return startAgent(character, directClient);
    };

    directClient.loadCharacterTryPath = loadCharacterTryPath;
    directClient.jsonToCharacter = jsonToCharacter;

    directClient.start(serverPort);

    if (serverPort !== Number.parseInt(settings.SERVER_PORT || "3000")) {
        elizaLogger.log(`Server started on alternate port ${serverPort}`);
    }

    elizaLogger.log(
        "Run `pnpm start:client` to start the client and visit the outputted URL (http://localhost:5173) to chat with your agents. When running multiple agents, use client with different port `SERVER_PORT=3001 pnpm start:client`"
    );
};

startAgents().catch((error) => {
    elizaLogger.error("Unhandled error in startAgents:", error);
    process.exit(1);
});

// Prevent unhandled exceptions from crashing the process if desired
if (
    process.env.PREVENT_UNHANDLED_EXIT &&
    parseBooleanFromText(process.env.PREVENT_UNHANDLED_EXIT)
) {
    // Handle uncaught exceptions to prevent the process from crashing
    process.on("uncaughtException", function (err) {
        console.error("uncaughtException", err);
    });

    // Handle unhandled rejections to prevent the process from crashing
    process.on("unhandledRejection", function (err) {
        console.error("unhandledRejection", err);
    });
}
