export interface ListItem {
    id: string
    content: string
  }
  
export interface MessageExample {
    id: string
    userMessage: string
    assistantMessage: string
  }
  
export interface AgentVoiceSettings {
    model: string
    provider?: string
  }
  
export  interface AgentSettings {
    secrets: Record<string, string>
    voice?: AgentVoiceSettings
    transcriptionProvider?: string
    modelProvider?: string
    customModelEndpoint?: string
  }
  
export interface Plugin {
    value: string
    label: string
    category: string
    package: string
    description: string
  }