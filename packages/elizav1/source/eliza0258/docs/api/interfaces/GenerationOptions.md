[@elizaos/core v0.25.8](../index.md) / GenerationOptions

# Interface: GenerationOptions

Configuration options for generating objects with a model.

## Properties

### runtime

> **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Defined in

[packages/core/src/generation.ts:2114](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2114)

***

### context

> **context**: `string`

#### Defined in

[packages/core/src/generation.ts:2115](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2115)

***

### modelClass

> **modelClass**: [`ModelClass`](../enumerations/ModelClass.md)

#### Defined in

[packages/core/src/generation.ts:2116](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2116)

***

### schema?

> `optional` **schema**: `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[packages/core/src/generation.ts:2117](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2117)

***

### schemaName?

> `optional` **schemaName**: `string`

#### Defined in

[packages/core/src/generation.ts:2118](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2118)

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

#### Defined in

[packages/core/src/generation.ts:2119](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2119)

***

### stop?

> `optional` **stop**: `string`[]

#### Defined in

[packages/core/src/generation.ts:2120](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2120)

***

### mode?

> `optional` **mode**: `"auto"` \| `"json"` \| `"tool"`

#### Defined in

[packages/core/src/generation.ts:2121](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2121)

***

### experimental\_providerMetadata?

> `optional` **experimental\_providerMetadata**: `Record`\<`string`, `unknown`\>

#### Defined in

[packages/core/src/generation.ts:2122](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2122)
