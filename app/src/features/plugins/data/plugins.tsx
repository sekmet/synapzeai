import {
  IconDatabaseCog,
  IconRouter,
  IconPlug,
} from '@tabler/icons-react'

/**
 * Returns an icon component based on the provided string.
 * 
 * @param str - The input string to search for a keyword.
 * @returns The corresponding icon component or null if no keyword is found.
 */
export function getIconForString(str: string): any {
  if (str.includes('adapter-')) {
    return <IconDatabaseCog />;
  }
  if (str.includes('plugin-')) {
    return <IconPlug />;
  }
  if (str.includes('client-')) {
    return <IconRouter />;
  }
  return null;
}



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
 

const extractDescriptionFromReadme = (readmeContent: string): string | null => {
  const lines = readmeContent.split('\n');
  let titleFound = false;
  let paragraphLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!titleFound && trimmed.startsWith('# ')) {
      titleFound = true;
      continue;
    }
    if (titleFound) {
      if (trimmed === '') {
        if (paragraphLines.length > 0) {
          break; // End of paragraph
        }
      } else if (trimmed.startsWith('#')) {
        break; // Another header, end of paragraph
      } else {
        paragraphLines.push(trimmed);
      }
    }
  }

  return paragraphLines.length > 0 ? paragraphLines.join(' ') : null;
};

export const fetchPlugins = async (forceRefresh = false) => {
  try {
    if (forceRefresh) {
      console.log('Fetching plugins...');
    }

    const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/plugins`,{
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
    const pluginData = [];

    for (const plugin of plugins) {
      pluginData.push({
        logo: <img src={plugin.logo} alt={plugin.name} className='rounded-lg' />,
        icon: getIconForString(plugin.icon),
        name: plugin.name,
        value: plugin.name,
        version: plugin.version,
        description: plugin.description,
        author: plugin.author,
        githubUrl: plugin.githubUrl,
        package: plugin.package,
        installed: plugin.installed,
        agentConfig: plugin.agentConfig,
      });
    }

    return pluginData;

  } catch (err) {
    console.error('Failed to fetch plugins:', err);
    throw err;
  }
};



export const fetchPluginsLocal = async (forceRefresh = false) => {
  try {
    if (forceRefresh) {
      console.log('Fetching plugins...');
    }

    // Fetch the registry index
    const registryResponse = await fetch(
      'https://raw.githubusercontent.com/aisynapze/registry/synapze/index.json'
    );

    if (!registryResponse.ok) {
      throw new Error('Failed to fetch plugin registry');
    }

    const registry = await registryResponse.json();
    const pluginEntries = Object.entries(registry);

    // Fetch package.json, check for logo, and fetch README.md for each plugin
    const pluginData = await Promise.all(
      pluginEntries.map(async ([name, githubUrl]) => {
        const shortName = name.replace('@elizaos-plugins/', '');
        const value = shortName.replace('plugin-', '');  // e.g., "0g"
        const packageName = name; //.replace('@elizaos-plugins/', '@elizaos/');
        const [owner, repo] = (githubUrl as string).replace('github:', '').split('/');
        let branch = 'main';
        let packageJsonContent;

        // Try fetching package.json from main branch
        try {
          const response = await fetch(
            `https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`
          );
          if (!response.ok) {
            throw new Error('Main branch not found');
          }
          packageJsonContent = await response.json();
        } catch {
          // Fallback to master branch
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
              logo: '',
              icon: getIconForString(shortName),
              name: formatCapitalizedString(value),
              value,
              version: 'unknown',
              description: 'Plugin information unavailable',
              author: 'unknown',
              githubUrl: `https://github.com/${owner}/${repo}`,
              package: packageName,
              installed: false,
              agentConfig: null, // Set agentConfig to null when package.json fetch fails
            };
          }
        }

        // Check for images/logo.jpg in the determined branch
        let logo: any = '';
        if (packageJsonContent) {
          const logoUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/images/logo.jpg`;
          try {
            const logoResponse = await fetch(logoUrl, { method: 'HEAD' });
            if (logoResponse.ok) {
              logo = <img src={logoUrl} alt={shortName} className='rounded-lg' />;
            }
          } catch {
            console.warn(`Failed to check for logo in ${name}`);
            // logo remains ''
          }
        }

        // Fetch README.md from the determined branch
        let readmeDescription: string | null = null;
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

        // Use README description if available, else package.json description
        const description =
          readmeDescription || packageJsonContent.description || 'No description available';

        return {
          logo,
          icon: getIconForString(shortName),
          name: formatCapitalizedString(value),
          value,
          version: packageJsonContent.version || 'unknown',
          description,
          author: packageJsonContent.author || 'unknown',
          githubUrl: `https://github.com/${owner}/${repo}`,
          package: packageName,
          installed: false,
          agentConfig: packageJsonContent.agentConfig || null, // Pull agentConfig if it exists
        };
      })
    );

    return pluginData;
  } catch (err: any) {
    console.log(err.message || 'Failed to load plugins. Please try again later.');
    console.error('Failed to load plugins:', err);
  } finally {
    console.log('Plugins loaded');
  }
};