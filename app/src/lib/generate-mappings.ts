import { Project } from 'ts-morph';
import * as fs from 'fs';

/**
 * Generates provider and client mappings from an interface file.
 * @param interfaceFilePath - Path to the TypeScript file containing the AgentEnvironmentVars interface.
 * @param outputFilePath - Path where the generated mappings file will be saved.
 */
function generateMappings(interfaceFilePath: string, outputFilePath: string): void {
  // Initialize a new ts-morph project
  const project = new Project();
  
  // Add the interface file to the project
  project.addSourceFileAtPath(interfaceFilePath);
  const sourceFile = project.getSourceFileOrThrow(interfaceFilePath);

  // Find the AgentEnvironmentVars interface
  const interfaceDecl = sourceFile.getInterface('AgentEnvironmentVars');
  if (!interfaceDecl) {
    throw new Error('Interface "AgentEnvironmentVars" not found in the specified file.');
  }

  // Initialize mappings objects
  const providerMappings: Record<string, string[]> = {};
  const clientMappings: Record<string, string[]> = {};
  const pluginMappings: Record<string, string[]> = {};

  // Iterate over all properties in the interface
  for (const prop of interfaceDecl.getProperties()) {
    const propName = prop.getName();

    if (propName.startsWith('provider_')) {
        // Extract provider name (e.g., 'openrouter' from 'provider_openrouter')
        const providerName = propName.slice('provider_'.length);
        // Get the type of the nested object and its property names
        const nestedType = prop.getType();
        const nestedProps = nestedType.getProperties().map(p => p.getName());
        providerMappings[providerName] = nestedProps;
    } else if (propName.startsWith('client_')) {
        // Extract client name (e.g., 'discord' from 'client_discord')
        const clientName = propName.slice('client_'.length);
        // Get the type of the nested object and its property names
        const nestedType = prop.getType();
        const nestedProps = nestedType.getProperties().map(p => p.getName());
        clientMappings[clientName] = nestedProps;
    } else if (propName.startsWith('plugin_')) {
        // Extract plugin name (e.g., 'discord' from 'plugin_discord')
        const pluginName = propName.slice('plugin_'.length);
        // Get the type of the nested object and its property names
        const nestedType = prop.getType();
        const nestedProps = nestedType.getProperties().map(p => p.getName());
        pluginMappings[pluginName] = nestedProps;
      }
  }

  // Generate the content for the mappings file
  const mappingsFileContent = `
// Auto-generated mappings file
export const providerMappings = ${JSON.stringify(providerMappings, null, 2)} as const;

export const clientMappings = ${JSON.stringify(clientMappings, null, 2)} as const;

export const pluginMappings = ${JSON.stringify(pluginMappings, null, 2)} as const;
`;

  // Write the content to the output file
  fs.writeFileSync(outputFilePath, mappingsFileContent);
  console.log(`Mappings file generated successfully at ${outputFilePath}`);
}

// Example usage
try {
  generateMappings(`./src/types/agent-enviroment-v1.ts`, './src/lib/mappings.ts');
} catch (error) {
  console.error('Error generating mappings:', error);
}