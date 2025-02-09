export const hyperlaneActionTemplate = `Look at your LAST RESPONSE in the conversation where you confirmed a Hyperlane action request.
Based on ONLY that last message, extract the action details:

Supported actions:
- **Send a message**:
  Examples:
    - "Send 'Hello' to chain2 at 0xRecipientAddress" 
      -> { "action": "send_message", "destination_chain": "chain2", "recipient": "0xRecipientAddress", "message": "Hello" }
    - "Dispatch 'Welcome' to chain1 at 0xAddress"
      -> { "action": "send_message", "destination_chain": "chain1", "recipient": "0xAddress", "message": "Welcome" }

- **Relay a message**:
  Examples:
    - "Relay message 0x1234abc from chain1" 
      -> { "action": "relay_message", "origin_chain": "chain1", "message_id": "0x1234abc" }
    - "Relay 0x5678def from chain2"
      -> { "action": "relay_message", "origin_chain": "chain2", "message_id": "0x5678def" }

- **Token transfer**:
  Examples:
    - "Transfer 10 tokens to chain2 at 0xRecipientAddress with token 0xTokenAddress" 
      -> { "action": "transfer_token", "destination_chain": "chain2", "recipient": "0xRecipientAddress", "token_address": "0xTokenAddress", "amount": 10 }
    - "Bridge 5 tokens to chain1 at 0xAddress with 0xTokenAddress"
      -> { "action": "transfer_token", "destination_chain": "chain1", "recipient": "0xAddress", "token_address": "0xTokenAddress", "amount": 5 }

- **Execute a contract call**:
  Examples:
    - "Execute exampleFunction on chain2 at 0xContractAddress with args ['arg1', 'arg2']" 
      -> { "action": "execute_contract_call", "destination_chain": "chain2", "contract_address": "0xContractAddress", "function_name": "exampleFunction", "args": ["arg1", "arg2"] }
    - "Call myFunction on chain1 at 0xAddress with arguments ['x', 'y']"
      -> { "action": "execute_contract_call", "destination_chain": "chain1", "contract_address": "0xAddress", "function_name": "myFunction", "args": ["x", "y"] }

- **Cross-chain query**:
  Examples:
    - "Query exampleFunction on chain2 at 0xContractAddress with args ['arg1', 'arg2']" 
      -> { "action": "cross_chain_query", "chain": "chain2", "contract_address": "0xContractAddress", "function_name": "exampleFunction", "args": ["arg1", "arg2"] }
    - "Fetch data from chain1 at 0xAddress calling getData with ['key']"
      -> { "action": "cross_chain_query", "chain": "chain1", "contract_address": "0xAddress", "function_name": "getData", "args": ["key"] }

\`\`\`json
{
    "action": "<action_name>",
    "destination_chain": "<destination chain (if applicable)>",
    "origin_chain": "<origin chain (if applicable)>",
    "recipient": "<recipient address (if applicable)>",
    "token_address": "<token address (if applicable)>",
    "contract_address": "<contract address (if applicable)>",
    "function_name": "<function name (if applicable)>",
    "args": ["<arguments (if applicable)>"],
    "message": "<message content (if applicable)>",
    "message_id": "<message ID (if applicable)>",
    "amount": "<amount for token transfer (if applicable)>"
}
\`\`\`

Note:
- Extract only the necessary details based on the action.
- If the action isn't explicitly clear, infer it based on the context and clarify it in the output.
- Ensure all extracted fields align with the examples above.

Recent conversation:
{{recentMessages}}`;
