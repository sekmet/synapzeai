import { type PluginInfo } from '@/types/plugins';

/**
* Extracts the first paragraph after the title from a README markdown string.
* @param {string} readmeContent - The raw README content.
* @returns {string | null} The extracted description or null if not found.
*/
const extractDescriptionFromReadme = (readmeContent: string) => {
  const lines = readmeContent.split('\n');
  let titleFound = false;
  let paragraphLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!titleFound && trimmed.startsWith('# ')) {
      titleFound = true;
      continue;
    }
    if (titleFound) {
      if (trimmed === '') {
        if (paragraphLines.length > 0) break; // End of paragraph
      } else if (trimmed.startsWith('#')) {
        break; // Another header
      } else {
        paragraphLines.push(trimmed);
      }
    }
  }

  return paragraphLines.length > 0 ? paragraphLines.join(' ') : null;
};

function formatCapitalizedString(input: string): string {
 // Handle empty/null cases
 if (!input) return '';
 
 // If no hyphens, just capitalize first letter
 if (!input.includes('-')) {
   return input.charAt(0).toUpperCase() + input.slice(1);
 }

 return input
   .split('-')
   .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
   .join(' ');
}

/**
 * Fetches plugin data and returns it in the specified data structure.
 * @param {boolean} forceRefresh - If true, logs a message indicating a refresh.
 * @returns {Promise<Array<{value: string, label: string, category: string, package: string, description: string}>>} An array of plugin objects.
 */
export const fetchPluginsListingLocal = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        console.log('Fetching plugins...');
      }
  
      // Fetch the registry index from GitHub
      const registryResponse = await fetch(
        'https://raw.githubusercontent.com/aisynapze/registry/synapze/index.json'
      );
  
      if (!registryResponse.ok) {
        throw new Error('Failed to fetch plugin registry');
      }
  
      const registry = await registryResponse.json();
      const pluginEntries = Object.entries(registry);
  
      // Process each plugin entry
      const pluginData = await Promise.all(
        pluginEntries.map(async ([name, githubUrl]) => {
          const shortName = name.replace('@elizaos-plugins/', ''); // e.g., "plugin-0g"
          const value = shortName.replace('plugin-', '');  // e.g., "0g"
          const [owner, repo] = (githubUrl as string).replace('github:', '').split('/');
          let branch = 'main';
          let packageJsonContent;
  
          // Attempt to fetch package.json from the main branch
          try {
            const response = await fetch(
              `https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`
            );
            if (!response.ok) {
              throw new Error('Main branch not found');
            }
            packageJsonContent = await response.json();
          } catch {
            // Fallback to master branch if main fails
            try {
              const response = await fetch(
                `https://raw.githubusercontent.com/${owner}/${repo}/master/package.json`
              );
              if (!response.ok) {
                throw new Error('Master branch not found');
              }
              packageJsonContent = await response.json();
              branch = 'master';
            } catch {
              console.warn(`Failed to fetch package.json for ${name}`);
              return {
                value: value,
                label: formatCapitalizedString(value),
                category: "Blockchain & Web3",
                package: name, //.replace('@elizaos-plugins/', '@elizaos/'),
                description: 'Plugin information unavailable',
              };
            }
          }
  
          // Fetch README.md to extract a description
          let readmeDescription = null;
          try {
            const readmeResponse = await fetch(
              `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`
            );
            if (readmeResponse.ok) {
              const readmeContent = await readmeResponse.text();
              readmeDescription = extractDescriptionFromReadme(readmeContent);
            } else {
              console.warn(`README.md not found for ${name} on branch ${branch}`);
            }
          } catch {
            console.warn(`Failed to fetch README.md for ${name}`);
          }
  
          // Determine the description, prioritizing README over package.json
          const description =
            readmeDescription || packageJsonContent.description || 'No description available';
  
          return {
            value: value,
            label: formatCapitalizedString(value),
            category: "Blockchain & Web3",
            package: name, //.replace('@elizaos-plugins/', '@elizaos/'),
            description: description,
          };
        })
      );
  
      return pluginData;
    } catch (err) {
      console.log(err || 'Failed to load plugins. Please try again later.');
      console.error('Failed to load plugins:', err);
      return []; // Return an empty array on failure
    } finally {
      console.log('Plugins loaded');
    }
};


export const fetchPluginsListing = async (forceRefresh = false) => {
  try {
    if (forceRefresh) {
      console.log('Fetching plugins...');
    }

    const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/plugins/listing`,{
      method: 'GET',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch plugins');
    }
  
    const plugins = await response.json();
    return plugins;

  } catch (err) {
    console.error('Failed to fetch plugins:', err);
    throw err;
  }
};



export async function loadPluginParameters(pluginName: string): Promise<PluginInfo | null> {
  
    if (!pluginName) return null;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/plugins/${pluginName}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        console.error(`Failed to load plugin ${pluginName}:`, response.statusText);
        return null;
      }
      const loadedPlugin: PluginInfo = await response.json();
      return loadedPlugin;
    } catch (error) {
      console.error(`Error loading plugin ${pluginName}:`, error);
      return null;
    }
}