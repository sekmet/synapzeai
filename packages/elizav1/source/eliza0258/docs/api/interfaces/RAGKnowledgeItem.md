[@elizaos/core v0.25.8](../index.md) / RAGKnowledgeItem

# Interface: RAGKnowledgeItem

## Properties

### id

> **id**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Defined in

[packages/core/src/types.ts:1548](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1548)

***

### agentId

> **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Defined in

[packages/core/src/types.ts:1549](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1549)

***

### content

> **content**: `object`

#### text

> **text**: `string`

#### metadata?

> `optional` **metadata**: `object`

##### Index Signature

 \[`key`: `string`\]: `unknown`

#### metadata.isMain?

> `optional` **isMain**: `boolean`

#### metadata.isChunk?

> `optional` **isChunk**: `boolean`

#### metadata.originalId?

> `optional` **originalId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### metadata.chunkIndex?

> `optional` **chunkIndex**: `number`

#### metadata.source?

> `optional` **source**: `string`

#### metadata.type?

> `optional` **type**: `string`

#### metadata.isShared?

> `optional` **isShared**: `boolean`

#### Defined in

[packages/core/src/types.ts:1550](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1550)

***

### embedding?

> `optional` **embedding**: `Float32Array`

#### Defined in

[packages/core/src/types.ts:1563](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1563)

***

### createdAt?

> `optional` **createdAt**: `number`

#### Defined in

[packages/core/src/types.ts:1564](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1564)

***

### similarity?

> `optional` **similarity**: `number`

#### Defined in

[packages/core/src/types.ts:1565](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1565)

***

### score?

> `optional` **score**: `number`

#### Defined in

[packages/core/src/types.ts:1566](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1566)
