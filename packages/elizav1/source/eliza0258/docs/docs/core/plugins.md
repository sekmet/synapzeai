# ElizaOS Plugins

ElizaOS plugins are modular extensions that enhance the capabilities of ElizaOS agents. They provide a flexible way to add new functionality, integrate external services, and customize agent behavior across different platforms.

## Overview

Plugins in ElizaOS can provide various components:

- **Actions**: Custom behaviors and responses
- **Providers**: Data sources and context providers
- **Evaluators**: Analysis and learning systems
- **Services**: Background processes and integrations
- **Clients**: Platform-specific communication interfaces
- **Adapters**: Database and storage implementations

## Using Plugins

### Installation

1. Add the plugin to your project's dependencies:

```json
{
  "dependencies": {
    "@elizaos/plugin-example": "github:elizaos-plugins/plugin-example"
  }
}
```

2. Configure the plugin in your character file:

```json
{
  "name": "MyAgent",
  "plugins": [
    "@elizaos/plugin-example"
  ],
  "settings": {
    "example-plugin": {
      // Plugin-specific configuration
    }
  }
}
```

### Available Plugins

ElizaOS maintains an official plugin registry at [github.com/elizaos-plugins/registry](https://github.com/elizaos-plugins/registry). Some key categories include:

#### Database Adapters
- `@elizaos-plugins/adapter-mongodb`: MongoDB integration
- `@elizaos-plugins/adapter-postgres`: PostgreSQL with vector support
- `@elizaos-plugins/adapter-sqlite`: Lightweight SQLite storage
- `@elizaos-plugins/adapter-qdrant`: Vector-focused storage
- `@elizaos-plugins/adapter-supabase`: Cloud-hosted vector database

#### Platform Clients
- `@elizaos-plugins/client-discord`: Discord bot integration
- `@elizaos-plugins/client-twitter`: Twitter/X integration
- `@elizaos-plugins/client-telegram`: Telegram messaging
- `@elizaos-plugins/client-slack`: Slack workspace integration
- `@elizaos-plugins/client-farcaster`: Web3 social networking

#### Utility Plugins
- `@elizaos-plugins/plugin-browser`: Web scraping capabilities
- `@elizaos-plugins/plugin-pdf`: PDF processing
- `@elizaos-plugins/plugin-image`: Image analysis and generation
- `@elizaos-plugins/plugin-video`: Video processing
- `@elizaos-plugins/plugin-llama`: Local LLaMA model integration

## Creating Plugins

### Project Structure

```
plugin-name/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts        # Main plugin entry
│   ├── actions/        # Custom actions
│   ├── providers/      # Data providers
│   ├── types.ts        # Type definitions
│   └── environment.ts  # Configuration
├── README.md
└── LICENSE
```

### Basic Plugin Implementation

```typescript
import { Plugin, Action, Provider } from "@elizaos/core";

const exampleAction: Action = {
    name: "EXAMPLE_ACTION",
    similes: ["ALTERNATE_NAME"],
    description: "Description of what this action does",
    validate: async (runtime, message) => {
        // Validation logic
        return true;
    },
    handler: async (runtime, message) => {
        // Implementation logic
        return true;
    }
};

const exampleProvider: Provider = {
    get: async (runtime, message) => {
        // Provider implementation
        return "Context string";
    }
};

export const examplePlugin: Plugin = {
    name: "example-plugin",
    description: "Plugin description",
    actions: [exampleAction],
    providers: [exampleProvider]
};
```

### Package Configuration

Your `package.json` must include:

```json
{
  "name": "@elizaos/plugin-example",
  "version": "1.0.0",
  "agentConfig": {
    "pluginType": "elizaos:plugin:1.0.0",
    "pluginParameters": {
      "API_KEY": {
        "type": "string",
        "description": "API key for the service"
      }
    }
  }
}
```



## Best Practices

1. **Minimal Dependencies**
   - Only include necessary dependencies
   - Use peer dependencies when possible
   - Document all required dependencies

2. **Error Handling**
   - Validate configuration before use
   - Provide meaningful error messages
   - Implement proper error recovery

3. **Type Safety**
   - Use TypeScript throughout
   - Define clear interfaces
   - Document type constraints

4. **Documentation**
   - Include clear README
   - Document all configuration options
   - Provide usage examples

5. **Testing**
   - Include unit tests
   - Provide integration tests
   - Document testing procedures

## FAQ

### What exactly is a plugin in ElizaOS?

A plugin is a modular extension that adds new capabilities to ElizaOS agents, such as API integrations, custom actions, or platform connections. Plugins allow you to expand agent functionality and share reusable components with other developers.

### When should I create a plugin versus using existing ones?

Create a plugin when you need custom functionality not available in existing plugins, want to integrate with external services, or plan to share reusable agent capabilities with the community.

### What are the main types of plugin components?

Actions handle specific tasks, Providers supply data, Evaluators analyze responses, Services run background processes, Clients manage platform connections, and Adapters handle storage solutions.

### How do I test a plugin during development?

Use the mock client with `pnpm mock-eliza --characters=./characters/test.character.json` for rapid testing, then progress to platform-specific testing like web interface or Twitter integration.

### Why isn't my plugin being recognized?

Most commonly this occurs due to missing dependencies, incorrect registration in your character file, or build configuration issues. Ensure you've run `pnpm build` and properly imported the plugin.

### Can I monetize my plugin?

Yes, plugins can be monetized through the ElizaOS marketplace or by offering premium features/API access, making them an effective distribution mechanism for software products.

### How do I debug plugin issues?

Enable debug logging, use the mock client for isolated testing, and check the runtime logs for detailed error messages about plugin initialization and execution.

### What's the difference between Actions and Services?

Actions handle specific agent responses or behaviors, while Services provide ongoing background functionality or external API integrations that multiple actions might use.

## Additional Resources

- [ElizaOS Registry](https://github.com/elizaos-plugins/registry)
- [Example Plugins](https://github.com/elizaos-plugins)
