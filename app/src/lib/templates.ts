import { useAgentDeployStore, AgentEnvironmentVars } from '@/stores/agentDeployStore';

interface Template {
  name: string;
  clients: string[];
  modelProvider: string;
  settings: {
    secrets: Record<string, any>;
    voice?: {
      model: string;
      modelProvider?: string;
    };
  };
  plugins: string[];
  bio: string[];
  lore: string[];
  knowledge: string[];
  messageExamples: Array<Array<{
    user: string;
    content: { text: string };
  }>>;
  postExamples: string[];
  topics: string[];
  style: {
    all: string[];
    chat: string[];
    post: string[];
  };
  adjectives: string[];
  twitterSpaces?: {
    maxSpeakers: number;
    topics: string[];
    typicalDurationMinutes: number;
    idleKickTimeoutMs: number;
    minIntervalBetweenSpacesMinutes: number;
    businessHoursOnly: boolean;
    randomChance: number;
    enableIdleMonitor: boolean;
    enableSttTts: boolean;
    enableRecording: boolean;
    voiceId: string;
    sttLanguage: string;
    gptModel: string;
    systemPrompt: string;
  };
}

type TemplateInfo = {
  name: string;
  json: string;
}

const templateNames = [
  { name: 'C-3PO', json: 'c3po.character.json' },
  { name: 'CosmosHelper', json: 'cosmosHelper.character.json' },
  { name: 'Dobby', json: 'dobby.character.json' },
  { name: 'TrollDetective.Exe', json: 'eternalai.character.json' },
  { name: 'LP Manager', json: 'lpmanager.character.json' },
  { name: 'Omniflix', json: 'omniflix.character.json' },
  { name: 'SBF', json: 'sbf.character.json' },
  { name: 'Shaw', json: 'shaw.character.json' },
  { name: 'ethereal-being-bot', json: 'simsai.character.json' },
  { name: 'snoop', json: 'snoop.character.json' },
  { name: 'spanish_trump', json: 'spanish_trump.character.json' },
  { name: 'trump', json: 'trump.character.json' },
];

export async function loadTemplate(templateName: string): Promise<Template | null> {
  
  if (!templateName) return null;

    // Find the matching template name
    const template: TemplateInfo | undefined = templateNames.find(tmpl => 
      tmpl.name === templateName
    );

    if (!template) return null;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/templates/${template.json}`,{
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      console.error(`Failed to load template ${template.name}:`, response.statusText);
      return null;
    }
    const loadedTemplate: Template = await response.json();
    return loadedTemplate;
  } catch (error) {
    console.error(`Error loading template ${template.name}:`, error);
    return null;
  }
}

export function getAvailableTemplates(): string[] {
  return templateNames.map(tmpl => {
    // Remove .character suffix and capitalize first letter
    const displayName = tmpl.name
    return displayName;
  });
}

export function getTemplateFileName(displayName: string): string
{
  // Find the matching template name
  const templateName: TemplateInfo | undefined = templateNames.find(tmpl => 
    tmpl.name === displayName
  );
  
  return templateName?.json || '';
}

/**
 * Saves the template state to the agent deploy store
 * @param template The template to save
 */
export function getAgentEnvironmentFields(): string[] {
  // Get the current environment variables from the store
  const agentDeploy = useAgentDeployStore.getState();
  const env = agentDeploy.getEnv();

  // Get all the keys from AgentEnvironmentVars type
  const envFields = Object.keys(env || {}).filter(key => {
    // Filter out undefined or empty values
    //const value = env[key as keyof AgentEnvironmentVars];
    //return value !== undefined && value !== '';
    return key;
  });

  return envFields;
}

/**
 * Get matched environment variables based on selected model provider and clients
 * @param modelProvider The selected model provider
 * @param selectedClients Array of selected client names
 * @returns Array of matched environment variable names
 */
export function getMatchedEnvironmentVars(modelProvider: string, selectedClients: string[]): Partial<AgentEnvironmentVars> {
  const matchedVars: Partial<AgentEnvironmentVars> = {};

  // Model Provider mappings
  const providerMappings: Record<string, (keyof AgentEnvironmentVars)[]> = {
    'openai': [
      'OPENAI_API_KEY',
      'OPENAI_API_URL',
      'SMALL_OPENAI_MODEL',
      'MEDIUM_OPENAI_MODEL',
      'LARGE_OPENAI_MODEL',
      'EMBEDDING_OPENAI_MODEL',
      'IMAGE_OPENAI_MODEL',
      'USE_OPENAI_EMBEDDING',
      'ENABLE_OPEN_AI_COMMUNITY_PLUGIN',
      'OPENAI_DEFAULT_MODEL',
      'OPENAI_MAX_TOKENS',
      'OPENAI_TEMPERATURE'
    ],
    'atoma': [
      'ATOMASDK_BEARER_AUTH',
      'ATOMA_API_URL',
      'SMALL_ATOMA_MODEL',
      'MEDIUM_ATOMA_MODEL',
      'LARGE_ATOMA_MODEL'
    ],
    'eternal': [
      'ETERNALAI_URL',
      'ETERNALAI_MODEL',
      'ETERNALAI_CHAIN_ID',
      'ETERNALAI_RPC_URL',
      'ETERNALAI_AGENT_CONTRACT_ADDRESS',
      'ETERNALAI_AGENT_ID',
      'ETERNALAI_API_KEY',
      'ETERNALAI_LOG'
    ],
    'hyperbolic': [
      'HYPERBOLIC_API_KEY',
      'HYPERBOLIC_MODEL',
      'IMAGE_HYPERBOLIC_MODEL',
      'SMALL_HYPERBOLIC_MODEL',
      'MEDIUM_HYPERBOLIC_MODEL',
      'LARGE_HYPERBOLIC_MODEL',
      'HYPERBOLIC_ENV',
      'HYPERBOLIC_GRANULAR_LOG',
      'HYPERBOLIC_SPASH',
      'HYPERBOLIC_LOG_LEVEL'
    ],
    'infera': [
      'INFERA_API_KEY',
      'INFERA_MODEL',
      'INFERA_SERVER_URL',
      'SMALL_INFERA_MODEL',
      'MEDIUM_INFERA_MODEL',
      'LARGE_INFERA_MODEL'
    ],
    'venice': [
      'VENICE_API_KEY',
      'SMALL_VENICE_MODEL',
      'MEDIUM_VENICE_MODEL',
      'LARGE_VENICE_MODEL',
      'IMAGE_VENICE_MODEL'
    ],
    'nineteen': [
      'NINETEEN_AI_API_KEY',
      'SMALL_NINETEEN_AI_MODEL',
      'MEDIUM_NINETEEN_AI_MODEL',
      'LARGE_NINETEEN_AI_MODEL',
      'IMAGE_NINETEEN_AI_MODE'
    ],
    'galadriel': [
      'GALADRIEL_API_KEY',
      'SMALL_GALADRIEL_MODEL',
      'MEDIUM_GALADRIEL_MODEL',
      'LARGE_GALADRIEL_MODEL',
      'GALADRIEL_FINE_TUNE_API_KEY'
    ],
    'lmstudio': [
      'LMSTUDIO_SERVER_URL'
    ],
    'akash_chat_api': [
      'AKASH_CHAT_API_KEY',
      'AKASH_CHAT_API_URL',
      'SMALL_AKASH_CHAT_API_MODEL',
      'MEDIUM_AKASH_CHAT_API_MODEL',
      'LARGE_AKASH_CHAT_API_MODEL'
    ],
    'elevenlabs': [
      'ELEVENLABS_XI_API_KEY',
      'ELEVENLABS_MODEL_ID',
      'ELEVENLABS_VOICE_ID',
      'ELEVENLABS_VOICE_STABILITY',
      'ELEVENLABS_VOICE_SIMILARITY_BOOST',
      'ELEVENLABS_VOICE_STYLE',
      'ELEVENLABS_VOICE_USE_SPEAKER_BOOST',
      'ELEVENLABS_OPTIMIZE_STREAMING_LATENCY',
      'ELEVENLABS_OUTPUT_FORMAT'
    ],
    'openrouter': [
      'OPENROUTER_API_KEY',
      'OPENROUTER_MODEL',
      'SMALL_OPENROUTER_MODEL',
      'MEDIUM_OPENROUTER_MODEL',
      'LARGE_OPENROUTER_MODEL'
    ],
    'redpill': [
      'REDPILL_API_KEY',
      'REDPILL_MODEL',
      'SMALL_REDPILL_MODEL',
      'MEDIUM_REDPILL_MODEL',
      'LARGE_REDPILL_MODEL'
    ],
    'grok': [
      'GROK_API_KEY',
      'SMALL_GROK_MODEL',
      'MEDIUM_GROK_MODEL',
      'LARGE_GROK_MODEL',
      'EMBEDDING_GROK_MODEL'
    ],
    'ollama': [
      'OLLAMA_SERVER_URL',
      'OLLAMA_MODEL',
      'USE_OLLAMA_EMBEDDING',
      'OLLAMA_EMBEDDING_MODEL',
      'SMALL_OLLAMA_MODEL',
      'MEDIUM_OLLAMA_MODEL',
      'LARGE_OLLAMA_MODEL'
    ],
    'google': [
      'GOOGLE_MODEL',
      'SMALL_GOOGLE_MODEL',
      'MEDIUM_GOOGLE_MODEL',
      'LARGE_GOOGLE_MODEL',
      'EMBEDDING_GOOGLE_MODEL'
    ],
    'mistral': [
      'MISTRAL_MODEL',
      'SMALL_MISTRAL_MODEL',
      'MEDIUM_MISTRAL_MODEL',
      'LARGE_MISTRAL_MODEL'
    ],
    'livepeer': [
      'LIVEPEER_GATEWAY_URL',
      'IMAGE_LIVEPEER_MODEL',
      'SMALL_LIVEPEER_MODEL',
      'MEDIUM_LIVEPEER_MODEL',
      'LARGE_LIVEPEER_MODEL'
    ]
  };

  // Client mappings
  const clientMappings: Record<string, (keyof AgentEnvironmentVars)[]> = {
    'discord': [
      'DISCORD_APPLICATION_ID',
      'DISCORD_API_TOKEN',
      'DISCORD_VOICE_CHANNEL_ID'
    ],
    'telegram': [
      'TELEGRAM_BOT_TOKEN',
      'TELEGRAM_ACCOUNT_PHONE',
      'TELEGRAM_ACCOUNT_APP_ID',
      'TELEGRAM_ACCOUNT_APP_HASH',
      'TELEGRAM_ACCOUNT_DEVICE_MODEL',
      'TELEGRAM_ACCOUNT_SYSTEM_VERSION'
    ],
    'twitter': [
      'TWITTER_DRY_RUN',
      'TWITTER_USERNAME',
      'TWITTER_PASSWORD',
      'TWITTER_EMAIL',
      'TWITTER_2FA_SECRET',
      'TWITTER_COOKIES_AUTH_TOKEN',
      'TWITTER_COOKIES_CT0',
      'TWITTER_COOKIES_GUEST_ID',
      'TWITTER_POLL_INTERVAL',
      'TWITTER_SEARCH_ENABLE',
      'TWITTER_TARGET_USERS',
      'TWITTER_RETRY_LIMIT',
      'TWITTER_SPACES_ENABLE',
      'ENABLE_TWITTER_POST_GENERATION',
      'POST_INTERVAL_MIN',
      'POST_INTERVAL_MAX',
      'POST_IMMEDIATELY',
      'ACTION_INTERVAL',
      'ENABLE_ACTION_PROCESSING',
      'MAX_ACTIONS_PROCESSING',
      'ACTION_TIMELINE_TYPE',
      'TWITTER_APPROVAL_DISCORD_CHANNEL_ID',
      'TWITTER_APPROVAL_DISCORD_BOT_TOKEN',
      'TWITTER_APPROVAL_ENABLED',
      'TWITTER_APPROVAL_CHECK_INTERVAL'
    ],
    'whatsapp': [
      'WHATSAPP_ACCESS_TOKEN',
      'WHATSAPP_PHONE_NUMBER_ID',
      'WHATSAPP_BUSINESS_ACCOUNT_ID',
      'WHATSAPP_WEBHOOK_VERIFY_TOKEN',
      'WHATSAPP_API_VERSION'
    ],
    'alexa': [
      'ALEXA_SKILL_ID',
      'ALEXA_CLIENT_ID',
      'ALEXA_CLIENT_SECRET'
    ],
    'simsai': [
      'SIMSAI_API_KEY',
      'SIMSAI_AGENT_ID',
      'SIMSAI_USERNAME',
      'SIMSAI_DRY_RUN'
    ],
    'farcaster': [
      'FARCASTER_FID',
      'FARCASTER_NEYNAR_API_KEY',
      'FARCASTER_NEYNAR_SIGNER_UUID',
      'FARCASTER_DRY_RUN',
      'FARCASTER_POLL_INTERVAL'
    ]
  };

  // Add model provider vars
  const normalizedProvider = modelProvider.toLowerCase();
  if (providerMappings[normalizedProvider]) {
    providerMappings[normalizedProvider].forEach(key => {
      matchedVars[key] = undefined;
    });
  }

  // Add client vars
  selectedClients.forEach(client => {
    const normalizedClient = client.toLowerCase();
    if (clientMappings[normalizedClient]) {
      clientMappings[normalizedClient].forEach(key => {
        matchedVars[key] = undefined;
      });
    }
  });

  return matchedVars;
}

export async function saveTemplateState(template: Template) {
  const agentDeployStore = useAgentDeployStore.getState();

  //console.log(agentDeployStore.getConfig())
  
  // Convert template format to AgentConfig format
  const config = {
    name: template.name,
    plugins: template.plugins.map(name => ({ name, enabled: true })),
    clients: template.clients.map(name => ({ name, enabled: true })),
    modelProvider: template.modelProvider,
    settings: template.settings,
    bio: template.bio,
    lore: template.lore,
    knowledge: template.knowledge,
    messageExamples: template.messageExamples,
    postExamples: template.postExamples,
    topics: template.topics,
    style: template.style,
    adjectives: template.adjectives
  };

  const envVars = getMatchedEnvironmentVars(template.modelProvider, template.clients);
  console.log({envVars})

  // get env vars with default values
  const keysToExtract: string[] = [];
  Object.keys(envVars).forEach(envKey => {
    keysToExtract.push(envKey)
  })
  // fetch the api to get the default values for the env vars
  const envDefaultValues = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/envs/extract`,{
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keysToExtract }),
  });

  const envDefaultValuesJson = await envDefaultValues.json();
  console.log({envDefaultValuesJson})

  // check if the env var value is undefined and set it to an empty string
  const env: any = {};
  Object.keys(envDefaultValuesJson).forEach(key => {
    if (env[key] === undefined) {
      env[key] = '';
    }
  });
  // Set the environment variables in the store
  agentDeployStore.setEnv(env);
  // Update the agent config in the store
  agentDeployStore.setConfig(config);

  return config;
}