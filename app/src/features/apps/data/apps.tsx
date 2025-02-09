import {
  /*IconBrandDiscord,
  IconBrandDocker,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandGmail,
  IconBrandMedium,
  IconBrandNotion,
  IconBrandSkype,
  IconBrandSlack,
  IconBrandStripe,
  //IconBrandTelegram,
  IconBrandTrello,
  IconBrandWhatsapp,
  IconBrandZoom,*/
  IconPlug,
} from '@tabler/icons-react'

export const fetchPlugins = async (forceRefresh = false) => {
  try {
    //setError(null);
    if (forceRefresh) {
      //setLoading(true);
      console.log('Fetching plugins...');
    }

    // Fetch the registry index
    const registryResponse = await fetch(
      'https://raw.githubusercontent.com/elizaos-plugins/registry/main/index.json'
    );
    
    if (!registryResponse.ok) {
      throw new Error('Failed to fetch plugin registry');
    }

    const registry = await registryResponse.json();
    
    // Convert registry object to array of entries
    const pluginEntries = Object.entries(registry);

    // Fetch package.json for each plugin
    const pluginData = await Promise.all(
      pluginEntries.map(async ([name, githubUrl]) => {
        // Parse GitHub URL to get owner and repo
        // Format is "github:owner/repo"
        const [owner, repo] = (githubUrl as string).replace('github:', '').split('/');
        
        try {
          const packageJsonResponse = await fetch(
            `https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`
          );
          
          if (!packageJsonResponse.ok) {
            console.warn(`Failed to fetch package.json for ${name}, trying 'master' branch`);
            // Try master branch as fallback
            const fallbackResponse = await fetch(
              `https://raw.githubusercontent.com/${owner}/${repo}/master/package.json`
            );
            
            if (!fallbackResponse.ok) {
              throw new Error(`Failed to fetch package.json for ${name}`);
            }
            
            const content = await fallbackResponse.json();
            return {
              logo: <IconPlug />,
              name: name.replace('@elizaos/', ''),
              version: content.version,
              description: content.description,
              author: content.author,
              githubUrl: `https://github.com/${owner}/${repo}`,
              installed: false
            };
          }

          const content = await packageJsonResponse.json();
          return {
            logo: <IconPlug />,
            name: name.replace('@elizaos/', ''),
            version: content.version,
            description: content.description,
            author: content.author,
            githubUrl: `https://github.com/${owner}/${repo}`,
            installed: false
          };
        } catch (err) {
          console.warn(`Failed to fetch package.json for ${name}:`, err);
          // Return partial data if package.json fetch fails
          return {
            logo: <IconPlug />,
            name: name.replace('@elizaos/', ''),
            version: 'unknown',
            description: 'Plugin information unavailable',
            author: 'unknown',
            githubUrl: `https://github.com/${owner}/${repo}`,
            installed: false
          };
        }
      })
    );

    return pluginData;

  } catch (err: any) {
    console.log(err.message || 'Failed to load plugins. Please try again later.');
    console.error('Failed to load plugins:', err);
  } finally {
    console.log('Plugins loaded');
    //setLoading(false);
  }
};

/*export const apps = [
  {
    name: 'Telegram',
    logo: <IconPlug />,
    installed: false,
    desc: 'Connect with Telegram for real-time communication.',
  },
  {
    name: 'Notion',
    logo: <IconBrandNotion />,
    installed: true,
    desc: 'Effortlessly sync Notion pages for seamless collaboration.',
  },
  {
    name: 'Figma',
    logo: <IconBrandFigma />,
    installed: true,
    desc: 'View and collaborate on Figma designs in one place.',
  },
  {
    name: 'Trello',
    logo: <IconBrandTrello />,
    installed: false,
    desc: 'Sync Trello cards for streamlined project management.',
  },
  {
    name: 'Slack',
    logo: <IconBrandSlack />,
    installed: false,
    desc: 'Integrate Slack for efficient team communication',
  },
  {
    name: 'Zoom',
    logo: <IconBrandZoom />,
    installed: true,
    desc: 'Host Zoom meetings directly from the dashboard.',
  },
  {
    name: 'Stripe',
    logo: <IconBrandStripe />,
    installed: false,
    desc: 'Easily manage Stripe transactions and payments.',
  },
  {
    name: 'Gmail',
    logo: <IconBrandGmail />,
    installed: true,
    desc: 'Access and manage Gmail messages effortlessly.',
  },
  {
    name: 'Medium',
    logo: <IconBrandMedium />,
    installed: false,
    desc: 'Explore and share Medium stories on your dashboard.',
  },
  {
    name: 'Skype',
    logo: <IconBrandSkype />,
    installed: false,
    desc: 'Connect with Skype contacts seamlessly.',
  },
  {
    name: 'Docker',
    logo: <IconBrandDocker />,
    installed: false,
    desc: 'Effortlessly manage Docker containers on your dashboard.',
  },
  {
    name: 'GitHub',
    logo: <IconBrandGithub />,
    installed: false,
    desc: 'Streamline code management with GitHub integration.',
  },
  {
    name: 'GitLab',
    logo: <IconBrandGitlab />,
    installed: false,
    desc: 'Efficiently manage code projects with GitLab integration.',
  },
  {
    name: 'Discord',
    logo: <IconBrandDiscord />,
    installed: false,
    desc: 'Connect with Discord for seamless team communication.',
  },
  {
    name: 'WhatsApp',
    logo: <IconBrandWhatsapp />,
    installed: false,
    desc: 'Easily integrate WhatsApp for direct messaging.',
  },
]
*/