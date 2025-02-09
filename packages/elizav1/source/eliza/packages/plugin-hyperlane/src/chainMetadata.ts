import type { ChainMetadata } from "@hyperlane-xyz/sdk";
import { ProtocolType } from "@hyperlane-xyz/utils";
import { ChainMap } from "@hyperlane-xyz/sdk";

export const chainData: ChainMap<ChainMetadata> = {
    ethereum: {
      name: 'ethereum',
      chainId: 17000,
      domainId: 17000,
      protocol: ProtocolType.Ethereum,
      rpcUrls: [
        {
          //@ts-ignore
          http: runtime.getSetting("ETHEREUM_RPC_URL"),
          pagination: {
            maxBlockRange: 2000,
            minBlockNumber: 0,
          },
          retry: {
            maxRequests: 5,
            baseRetryMs: 1000,
          },
        },
      ],
      blockExplorers: [
        {
          name: 'Etherscan',
          url: 'https://etherscan.io',
          apiUrl: 'https://api.etherscan.io',
          //@ts-ignore
          apiKey: runtime.getSetting("ETHERSCAN_API")
        },
      ],
    },
    polygon: {
      name: 'polygon',
      chainId:80002,
      domainId:80002,
      protocol: ProtocolType.Ethereum,
      rpcUrls: [
        {
          //@ts-ignore
          http: runtime.getSetting("POLYGON_RPC_URL"),
          pagination: {
            maxBlockRange: 2000,
            minBlockNumber: 0,
          },
          retry: {
            maxRequests: 5,
            baseRetryMs: 1000,
          },
        },
      ],
      blockExplorers: [
        {
          name: 'Polygonscan',
          url: 'https://polygonscan.com',
          apiUrl: 'https://api.polygonscan.com',
          //@ts-ignore
        },
      ],
    },
  };
