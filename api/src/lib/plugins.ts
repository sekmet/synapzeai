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
                icon: shortName,
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
                logo = logoUrl;
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
            icon: shortName,
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


/**
 * Fetches plugin data and returns it in the specified data structure.
 * @param {boolean} forceRefresh - If true, logs a message indicating a refresh.
 * @returns {Promise<Array<{value: string, label: string, category: string, package: string, description: string}>>} An array of plugin objects.
 */
export const fetchPluginsListing = async (forceRefresh = false) => {
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