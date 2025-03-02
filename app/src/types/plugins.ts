export interface PluginParameters {
    [key: string]: {
      type: string;
      description: string;
    };
  }
  
export interface AgentConfig {
    pluginType: string;
    pluginParameters: PluginParameters;
  }
  

export interface Plugin {
    logo?: any;
    icon: any;
    name: string;
    value: string;
    version: string;
    description: string;
    author: string;
    githubUrl: string;
    package: string;
    installed: boolean;
    agentConfig?: AgentConfig;
  }

export interface PluginParameter {
    type: string | number | boolean;
    description?: string;
    minLength?: number;
    maxLength?: number;
    default?: string | number | boolean;
    enum?: (string | number | boolean)[];
}

export interface PluginInfo {
    name: string;
    version: string;
    type: string;
    agentConfig?: {
        pluginType: string;
        pluginParameters: Record<string, PluginParameter>;
    };
}
