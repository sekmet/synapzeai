import { useAgentDeployStore, AgentPluginsSecrets } from '@/stores/agentDeployStore';
import { AgentEnvironmentVars } from '@/types/agent-enviroment-v1';
import { providerMappings as mMappings, clientMappings as cMappings /*, pluginMappings as pMappings*/ } from './mappings';
import { loadPluginParameters } from '@/lib/plugins';
import { type PluginInfo, type PluginParameter } from '@/types/plugins';

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
  const results: Partial<AgentEnvironmentVars> = {};
  // Model Provider mappings
  const providerMappings: Record<string, readonly string[]> = mMappings;

  // Client mappings
  const clientMappings: Record<string, readonly string[]> = cMappings;

  // Add model provider vars
  const normalizedProvider = modelProvider.toLowerCase();
  if (providerMappings[normalizedProvider]) {
    const matchedVars: Partial<AgentEnvironmentVars> = {};
    //providerMappings[normalizedProvider].forEach(key => {
    //  matchedVars[key as keyof AgentEnvironmentVars] = undefined;
    //});
    providerMappings[normalizedProvider].forEach(key => {
      //matchedVars[normalizedProvider][key as keyof AgentEnvironmentVars] = undefined;
      matchedVars[key as keyof AgentEnvironmentVars] = undefined;
      //console.log(key, matchedVars[key as keyof AgentEnvironmentVars]);
    });

    //console.log({[normalizedProvider]: matchedVars});
    Object.assign(results, {[normalizedProvider]: matchedVars});
  }

  // Add client vars
  selectedClients.forEach(client => {
    const matchedVars: Partial<AgentEnvironmentVars> = {};
    const normalizedClient = client.toLowerCase();
    if (clientMappings[normalizedClient]) {
      clientMappings[normalizedClient].forEach(key => {
        matchedVars[key as keyof AgentEnvironmentVars] = undefined;
      });
      //console.log(clientMappings[normalizedClient]);
      //console.log({[normalizedClient]: matchedVars});
      Object.assign(results, {[normalizedClient]: matchedVars});
    }
  });

  //console.log({results});
  return results;
}


export async function saveTemplateState(template: Template) {
  const agentDeployStore = useAgentDeployStore.getState();

  // Convert template format to AgentConfig format
  const config = {
    name: template.name,
    pluginsConfig: template.plugins.map(name => ({ name, enabled: true })),
    plugins: template.plugins.map(name => name),
    clientsConfig: template.clients.map(name => ({ name, enabled: true })),
    clients: template.clients.map(name => name),
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

  const envSections = getMatchedEnvironmentVars(template.modelProvider, template.clients);
  //console.log({envSections})
  const env: any = {};

  // Properly iterate through the nested structure
  for (const sectionKey in envSections) {
    // get env vars with default values
    const keysToExtract: string[] = [];

    const section = envSections[sectionKey as keyof typeof envSections];
    if (typeof section === 'object' && section !== null) {
      Object.keys(section).forEach(envKey => {
        keysToExtract.push(envKey);
      });
    }

    //console.log('Keys to extract:', keysToExtract);
    // fetch the api to get the default values for the env vars
    const envDefaultValues = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/envs/extract`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keysToExtract }),
    });

    const defaultValuesResponse = await envDefaultValues.json();
    //console.log(`${sectionKey} Default values:`, defaultValuesResponse);
    const envVariablesChecked = defaultValuesResponse.envVariables;

    if (typeof section === 'object' && section !== null) {
      Object.assign(env, {[sectionKey]: {} })
      Object.keys(section).forEach((envKey: any) => {
        //console.log({envKey})
        //console.log(envVariablesChecked[envKey])
        Object.assign(env[sectionKey], {[envKey]: envVariablesChecked[envKey] ?? ''})
      });
    }

  }

  // Set the environment variables in the store
  agentDeployStore.setEnv(env);

  const secrets: AgentPluginsSecrets = {};
  // Load the plugin parameters
  template.plugins.forEach(async (plugin) => {
    const pluginName = plugin.replace('@elizaos-plugins/', '');
    const pluginInfo: PluginInfo | null = await loadPluginParameters(pluginName);
    const pluginParams: any = pluginInfo?.agentConfig?.pluginParameters;
    //console.log({pluginParams})
    
    if (pluginParams) {
      // Initialize the section for this plugin if it doesn't exist
      if (!secrets[pluginName]) {
        secrets[pluginName] = {};
      }
      
      Object.keys(pluginParams).forEach((key: string) => {
        const value = pluginParams[key as keyof PluginParameter] as any;
        secrets[pluginName][key] = value?.default || '';
      });
    }
    
    // Set the agent secrets in the store
    agentDeployStore.setPluginSecrets(secrets);
  });


  // Update the agent config in the store
  agentDeployStore.setConfig(config);

  return config;
}