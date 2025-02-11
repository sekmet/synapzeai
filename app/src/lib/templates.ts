interface Template {
  name: string;
  clients: string[];
  modelProvider: string;
  settings: {
    secrets: Record<string, any>;
    voice?: {
      model: string;
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
    const response = await fetch(`/src/components/templates/${template.json}`);
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

export function getTemplateFileName(displayName: string): string {
  
  // Find the matching template name
  const templateName: TemplateInfo | undefined = templateNames.find(tmpl => 
    tmpl.name === displayName
  );
  
  return templateName?.json || '';
}
