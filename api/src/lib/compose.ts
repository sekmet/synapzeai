import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

interface ComposeParams {
  dockerImageName: string;
  envVars: string[]; // Now an array of environment variable strings.
  agentServerPort: string;
  agentJwtSecret: string;
  agentHostDomain: string;
}

export function generateDockerComposeFile(params: ComposeParams): string {

  // Define the 'agents' directory in the current working directory.
  const agentsDir = path.join(process.cwd(), 'agents');
  if (!fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir, { recursive: true });
  }

  // Create a temporary directory inside the 'agents' directory.
  // The directory name will be prefixed with "docker-compose-".
  const tmpDir = fs.mkdtempSync(path.join(agentsDir, 'agent-'));

  // Define the full file path for docker-compose.yaml.
  const filePath = path.join(tmpDir, 'docker-compose.yaml');

  // build agent host url
  ////'`agent-klpvho.synapze.xyz`'
  const agentSubdomain = `${tmpDir.split('/').pop()}`.toLocaleLowerCase();
  const agentHostUrl = '`'+ agentSubdomain+'.'+params.agentHostDomain+'`';

  // YAML template updated so that the placeholder is not already prefixed with a dash.
  // The envVars will be inserted as multiple lines.
const yamlTemplate = `
services:
    eliza:
        image: {{DOCKER-IMAGE-NAME}}
        stdin_open: true
        tty: true
        networks:
          - proxy
        volumes:
            - /var/run/tappd.sock:/var/run/tappd.sock
            - eliza:/app/packages/client-twitter/src/tweetcache
            - eliza:/app/db.sqlite
        environment:
{{ENV-VARS}}
            - JWT_SECRET={{AGENT-JWT-SECRET}}
            - SERVER_PORT={{AGENT-SERVER-PORT}}
        ports:
            - "{{AGENT-SERVER-PORT}}:3000"
        labels:
        - traefik.enable=true
        - traefik.http.middlewares.test-compress.compress=true
        - traefik.http.routers.{{AGENT-HOST}}-https.rule=Host({{AGENT-HOST-URL}})
        - traefik.http.routers.{{AGENT-HOST}}-https.entrypoints=http,https
        - traefik.http.middlewares.https-redirect.redirectscheme.scheme=https
        - traefik.http.routers.{{AGENT-HOST}}-https.middlewares=https-redirect
        - traefik.http.routers.{{AGENT-HOST}}-https.service={{AGENT-HOST}}-v1@docker
        - traefik.http.services.{{AGENT-HOST}}-v1.loadbalancer.server.port={{AGENT-SERVER-PORT}}
        - traefik.http.services.{{AGENT-HOST}}-v1.loadbalancer.sticky=true
        restart: always

networks:
  proxy:
    external: {}

volumes:
    eliza:
`;

  // Generate the environment variables block.
  // Each environment variable is prefixed with 12 spaces followed by "- ".
  const envVarsLines = params.envVars
    .map(envVar => `            - ${envVar}`)
    .join('\n');

  // Replace the placeholders with the actual values.
  const updatedYaml = yamlTemplate
    .replace(/{{DOCKER-IMAGE-NAME}}/g, params.dockerImageName)
    .replace(/{{ENV-VARS}}/g, envVarsLines)
    .replace(/{{AGENT-JWT-SECRET}}/g, params.agentJwtSecret)
    .replace(/{{AGENT-HOST}}/g, agentSubdomain)
    .replace(/{{AGENT-HOST-URL}}/g, agentHostUrl)
    .replace(/{{AGENT-SERVER-PORT}}/g, params.agentServerPort);


  // Write the updated YAML content to the file.
  fs.writeFileSync(filePath, updatedYaml, 'utf8');

  console.log(`Docker Compose file created at: ${filePath}`);
  return filePath;
}

