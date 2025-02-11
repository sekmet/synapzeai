import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AgentEnvironmentVars {
  // ####################################
  // #### Server & DB Configurations ####
  // ####################################
  CACHE_STORE?: 'database' | 'redis' | 'filesystem'
  REDIS_URL?: string
  PGLITE_DATA_DIR?: string
  SERVER_PORT?: string
  SUPABASE_URL?: string
  SUPABASE_ANON_KEY?: string
  MONGODB_CONNECTION_STRING?: string
  MONGODB_DATABASE?: string
  REMOTE_CHARACTER_URLS?: string
  USE_CHARACTER_STORAGE?: boolean
  DEFAULT_LOG_LEVEL?: 'info' | 'debug' | 'warn' | 'error'
  LOG_JSON_FORMAT?: boolean
  EXPRESS_MAX_PAYLOAD?: string

  // ###############################
  // #### Client Configurations ####
  // ###############################
  // BitMind Bittensor API
  BITMIND?: boolean
  BITMIND_API_TOKEN?: string

  // Discord Configuration
  DISCORD_APPLICATION_ID?: string
  DISCORD_API_TOKEN?: string
  DISCORD_VOICE_CHANNEL_ID?: string

  // Devin Configuration
  DEVIN_API_TOKEN?: string

  // Gelato Configuration
  GELATO_RELAY_API_KEY?: string

  // Farcaster Configuration
  FARCASTER_FID?: string
  FARCASTER_NEYNAR_API_KEY?: string
  FARCASTER_NEYNAR_SIGNER_UUID?: string
  FARCASTER_DRY_RUN?: boolean
  FARCASTER_POLL_INTERVAL?: number

  // Telegram Configuration
  TELEGRAM_BOT_TOKEN?: string
  TELEGRAM_ACCOUNT_PHONE?: string
  TELEGRAM_ACCOUNT_APP_ID?: string
  TELEGRAM_ACCOUNT_APP_HASH?: string
  TELEGRAM_ACCOUNT_DEVICE_MODEL?: string
  TELEGRAM_ACCOUNT_SYSTEM_VERSION?: string

  // Twitter/X Configuration
  TWITTER_DRY_RUN?: boolean
  TWITTER_USERNAME?: string
  TWITTER_PASSWORD?: string
  TWITTER_EMAIL?: string
  TWITTER_2FA_SECRET?: string
  TWITTER_COOKIES_AUTH_TOKEN?: string
  TWITTER_COOKIES_CT0?: string
  TWITTER_COOKIES_GUEST_ID?: string
  TWITTER_POLL_INTERVAL?: number
  TWITTER_SEARCH_ENABLE?: boolean
  TWITTER_TARGET_USERS?: string
  TWITTER_RETRY_LIMIT?: number
  TWITTER_SPACES_ENABLE?: boolean
  ENABLE_TWITTER_POST_GENERATION?: boolean
  POST_INTERVAL_MIN?: number
  POST_INTERVAL_MAX?: number
  POST_IMMEDIATELY?: boolean
  ACTION_INTERVAL?: number
  ENABLE_ACTION_PROCESSING?: boolean
  MAX_ACTIONS_PROCESSING?: number
  ACTION_TIMELINE_TYPE?: 'foryou' | 'following'
  TWITTER_APPROVAL_DISCORD_CHANNEL_ID?: string
  TWITTER_APPROVAL_DISCORD_BOT_TOKEN?: string
  TWITTER_APPROVAL_ENABLED?: boolean
  TWITTER_APPROVAL_CHECK_INTERVAL?: number

  // WhatsApp Configuration
  WHATSAPP_ACCESS_TOKEN?: string
  WHATSAPP_PHONE_NUMBER_ID?: string
  WHATSAPP_BUSINESS_ACCOUNT_ID?: string
  WHATSAPP_WEBHOOK_VERIFY_TOKEN?: string
  WHATSAPP_API_VERSION?: string

  // Alexa Configuration
  ALEXA_SKILL_ID?: string
  ALEXA_CLIENT_ID?: string
  ALEXA_CLIENT_SECRET?: string

  // Simsai Configuration
  SIMSAI_API_KEY?: string
  SIMSAI_AGENT_ID?: string
  SIMSAI_USERNAME?: string
  SIMSAI_DRY_RUN?: boolean

  // Model Provider Configurations
  // OpenAI
  OPENAI_API_KEY?: string
  OPENAI_API_URL?: string
  SMALL_OPENAI_MODEL?: string
  MEDIUM_OPENAI_MODEL?: string
  LARGE_OPENAI_MODEL?: string
  EMBEDDING_OPENAI_MODEL?: string
  IMAGE_OPENAI_MODEL?: string
  USE_OPENAI_EMBEDDING?: boolean
  ENABLE_OPEN_AI_COMMUNITY_PLUGIN?: boolean
  OPENAI_DEFAULT_MODEL?: string
  OPENAI_MAX_TOKENS?: number
  OPENAI_TEMPERATURE?: number

  // Atoma SDK
  ATOMASDK_BEARER_AUTH?: string
  ATOMA_API_URL?: string
  SMALL_ATOMA_MODEL?: string
  MEDIUM_ATOMA_MODEL?: string
  LARGE_ATOMA_MODEL?: string

  // Eternal AI
  ETERNALAI_URL?: string
  ETERNALAI_MODEL?: string
  ETERNALAI_CHAIN_ID?: number
  ETERNALAI_RPC_URL?: string
  ETERNALAI_AGENT_CONTRACT_ADDRESS?: string
  ETERNALAI_AGENT_ID?: string
  ETERNALAI_API_KEY?: string
  ETERNALAI_LOG?: boolean

  // Hyperbolic
  HYPERBOLIC_API_KEY?: string
  HYPERBOLIC_MODEL?: string
  IMAGE_HYPERBOLIC_MODEL?: string
  SMALL_HYPERBOLIC_MODEL?: string
  MEDIUM_HYPERBOLIC_MODEL?: string
  LARGE_HYPERBOLIC_MODEL?: string
  HYPERBOLIC_ENV?: 'production' | 'development'
  HYPERBOLIC_GRANULAR_LOG?: boolean
  HYPERBOLIC_SPASH?: boolean
  HYPERBOLIC_LOG_LEVEL?: string

  // Infera
  INFERA_API_KEY?: string
  INFERA_MODEL?: string
  INFERA_SERVER_URL?: string
  SMALL_INFERA_MODEL?: string
  MEDIUM_INFERA_MODEL?: string
  LARGE_INFERA_MODEL?: string

  // Venice
  VENICE_API_KEY?: string
  SMALL_VENICE_MODEL?: string
  MEDIUM_VENICE_MODEL?: string
  LARGE_VENICE_MODEL?: string
  IMAGE_VENICE_MODEL?: string

  // Nineteen.ai
  NINETEEN_AI_API_KEY?: string
  SMALL_NINETEEN_AI_MODEL?: string
  MEDIUM_NINETEEN_AI_MODEL?: string
  LARGE_NINETEEN_AI_MODEL?: string
  IMAGE_NINETEEN_AI_MODE?: string

  // Akash Chat API
  AKASH_CHAT_API_KEY?: string
  AKASH_CHAT_API_URL?: string
  SMALL_AKASH_CHAT_API_MODEL?: string
  MEDIUM_AKASH_CHAT_API_MODEL?: string
  LARGE_AKASH_CHAT_API_MODEL?: string

  // Galadriel
  GALADRIEL_API_KEY?: string
  SMALL_GALADRIEL_MODEL?: string
  MEDIUM_GALADRIEL_MODEL?: string
  LARGE_GALADRIEL_MODEL?: string
  GALADRIEL_FINE_TUNE_API_KEY?: string

  // LM Studio
  LMSTUDIO_SERVER_URL?: string

  // Speech & Transcription
  ELEVENLABS_XI_API_KEY?: string
  TRANSCRIPTION_PROVIDER?: 'local' | 'openai' | 'deepgram'
  
  // Cosmos
  COSMOS_CHAIN_ID?: string
  COSMOS_DENOM?: string
  COSMOS_GAS_PRICE?: string
  COSMOS_RPC_URL?: string
  COSMOS_REST_URL?: string
  COSMOS_PRIVATE_KEY?: string
  COSMOS_PUBLIC_KEY?: string

  // Livepeer configuration
  LIVEPEER_GATEWAY_URL?: string
  IMAGE_LIVEPEER_MODEL?: string
  SMALL_LIVEPEER_MODEL?: string
  MEDIUM_LIVEPEER_MODEL?: string
  LARGE_LIVEPEER_MODEL?: string

  // ElevenLabs Settings
  ELEVENLABS_MODEL_ID?: string
  ELEVENLABS_VOICE_ID?: string
  ELEVENLABS_VOICE_STABILITY?: number
  ELEVENLABS_VOICE_SIMILARITY_BOOST?: number
  ELEVENLABS_VOICE_STYLE?: number
  ELEVENLABS_VOICE_USE_SPEAKER_BOOST?: boolean
  ELEVENLABS_OPTIMIZE_STREAMING_LATENCY?: number
  ELEVENLABS_OUTPUT_FORMAT?: string

  // OpenRouter Configuration
  OPENROUTER_API_KEY?: string
  OPENROUTER_MODEL?: string
  SMALL_OPENROUTER_MODEL?: string
  MEDIUM_OPENROUTER_MODEL?: string
  LARGE_OPENROUTER_MODEL?: string

  // REDPILL Configuration (https://docs.red-pill.ai/get-started/supported-models)
  REDPILL_API_KEY?: string
  REDPILL_MODEL?: string
  SMALL_REDPILL_MODEL?: string
  MEDIUM_REDPILL_MODEL?: string
  LARGE_REDPILL_MODEL?: string

  // Grok Configuration
  GROK_API_KEY?: string
  SMALL_GROK_MODEL?: string
  MEDIUM_GROK_MODEL?: string
  LARGE_GROK_MODEL?: string
  EMBEDDING_GROK_MODEL?: string

  // Ollama Configuration
  OLLAMA_SERVER_URL?: string
  OLLAMA_MODEL?: string
  USE_OLLAMA_EMBEDDING?: boolean
  OLLAMA_EMBEDDING_MODEL?: string
  SMALL_OLLAMA_MODEL?: string
  MEDIUM_OLLAMA_MODEL?: string
  LARGE_OLLAMA_MODEL?: string

  // Google Configuration
  GOOGLE_MODEL?: string
  SMALL_GOOGLE_MODEL?: string
  MEDIUM_GOOGLE_MODEL?: string
  LARGE_GOOGLE_MODEL?: string
  EMBEDDING_GOOGLE_MODEL?: string

  // Mistral Configuration
  MISTRAL_MODEL?: string
  SMALL_MISTRAL_MODEL?: string
  MEDIUM_MISTRAL_MODEL?: string
  LARGE_MISTRAL_MODEL?: string

  // Groq Configuration
  GROQ_API_KEY?: string
  SMALL_GROQ_MODEL?: string
  MEDIUM_GROQ_MODEL?: string
  LARGE_GROQ_MODEL?: string
  EMBEDDING_GROQ_MODEL?: string

  // LlamaLocal Configuration
  LLAMALOCAL_PATH?: string

  // NanoGPT Configuration
  SMALL_NANOGPT_MODEL?: string
  MEDIUM_NANOGPT_MODEL?: string
  LARGE_NANOGPT_MODEL?: string

  // Anthropic Configuration
  ANTHROPIC_API_KEY?: string
  SMALL_ANTHROPIC_MODEL?: string
  MEDIUM_ANTHROPIC_MODEL?: string
  LARGE_ANTHROPIC_MODEL?: string

  // Heurist Configuration
  HEURIST_API_KEY?: string
  SMALL_HEURIST_MODEL?: string
  MEDIUM_HEURIST_MODEL?: string
  LARGE_HEURIST_MODEL?: string
  HEURIST_IMAGE_MODEL?: string
  HEURIST_EMBEDDING_MODEL?: string
  USE_HEURIST_EMBEDDING?: boolean

  // Gaianet Configuration
  GAIANET_MODEL?: string
  GAIANET_SERVER_URL?: string
  SMALL_GAIANET_MODEL?: string
  SMALL_GAIANET_SERVER_URL?: string
  MEDIUM_GAIANET_MODEL?: string
  MEDIUM_GAIANET_SERVER_URL?: string
  LARGE_GAIANET_MODEL?: string
  LARGE_GAIANET_SERVER_URL?: string
  GAIANET_EMBEDDING_MODEL?: string
  USE_GAIANET_EMBEDDING?: boolean

  // Volcengine Configuration
  VOLENGINE_API_URL?: string
  VOLENGINE_MODEL?: string
  SMALL_VOLENGINE_MODEL?: string
  MEDIUM_VOLENGINE_MODEL?: string
  LARGE_VOLENGINE_MODEL?: string
  VOLENGINE_EMBEDDING_MODEL?: string

  // DeepSeek Configuration
  DEEPSEEK_API_KEY?: string
  DEEPSEEK_API_URL?: string
  SMALL_DEEPSEEK_MODEL?: string
  MEDIUM_DEEPSEEK_MODEL?: string
  LARGE_DEEPSEEK_MODEL?: string

  // fal.ai Configuration
  FAL_API_KEY?: string
  FAL_AI_LORA_PATH?: string

  // LetzAI Configuration
  LETZAI_API_KEY?: string
  LETZAI_MODELS?: string

  // Remaining Provider Configurations
  GOOGLE_GENERATIVE_AI_API_KEY?: string
  ALI_BAILIAN_API_KEY?: string
  NANOGPT_API_KEY?: string
  TOGETHER_API_KEY?: string

  // ######################################
  // #### Crypto Plugin Configurations ####
  // ######################################
  // CoinMarketCap / CMC
  COINMARKETCAP_API_KEY?: string

  // Zerion
  ZERION_API_KEY?: string

  // CoinGecko
  COINGECKO_API_KEY?: string
  COINGECKO_PRO_API_KEY?: string

  // Moralis
  MORALIS_API_KEY?: string

  // EVM
  EVM_PRIVATE_KEY?: string
  EVM_PROVIDER_URL?: string

  // Zilliqa
  ZILLIQA_PRIVATE_KEY?: string
  ZILLIQA_PROVIDER_URL?: string

  // Avalanche
  AVALANCHE_PRIVATE_KEY?: string
  AVALANCHE_PUBLIC_KEY?: string

  // Arthera
  ARTHERA_PRIVATE_KEY?: string

  // Solana
  SOLANA_PRIVATE_KEY?: string
  SOLANA_PUBLIC_KEY?: string
  SOLANA_CLUSTER?: string
  SOLANA_ADMIN_PRIVATE_KEY?: string
  SOLANA_ADMIN_PUBLIC_KEY?: string
  SOLANA_VERIFY_TOKEN?: string

  // Injective
  INJECTIVE_PRIVATE_KEY?: string
  INJECTIVE_PUBLIC_KEY?: string
  INJECTIVE_NETWORK?: string
  // Fallback Wallet Configuration (deprecated)
  WALLET_PRIVATE_KEY?: string
  WALLET_PUBLIC_KEY?: string

  BIRDEYE_API_KEY?: string

  // Solana Configuration
  SOL_ADDRESS?: string
  SLIPPAGE?: number
  BASE_MINT?: string
  SOLANA_RPC_URL?: string
  HELIUS_API_KEY?: string

  // Abstract Configuration
  ABSTRACT_ADDRESS?: string
  ABSTRACT_PRIVATE_KEY?: string
  ABSTRACT_RPC_URL?: string

  // Starknet Configuration
  STARKNET_ADDRESS?: string
  STARKNET_PRIVATE_KEY?: string
  STARKNET_RPC_URL?: string

  // Lens Network Configuration
  LENS_ADDRESS?: string
  LENS_PRIVATE_KEY?: string

  // Form Chain
  FORM_PRIVATE_KEY?: string
  FORM_TESTNET?: boolean

  // Coinbase
  COINBASE_COMMERCE_KEY?: string
  COINBASE_API_KEY?: string
  COINBASE_PRIVATE_KEY?: string
  COINBASE_GENERATED_WALLET_ID?: string
  COINBASE_GENERATED_WALLET_HEX_SEED?: string
  COINBASE_NOTIFICATION_URI?: string

  // Coinbase AgentKit
  CDP_API_KEY_NAME?: string
  CDP_API_KEY_PRIVATE_KEY?: string
  CDP_AGENT_KIT_NETWORK?: string

  // Coinbase Charity Configuration
  IS_CHARITABLE?: boolean
  CHARITY_ADDRESS_BASE?: string
  CHARITY_ADDRESS_SOL?: string
  CHARITY_ADDRESS_ETH?: string
  CHARITY_ADDRESS_ARB?: string
  CHARITY_ADDRESS_POL?: string

  // thirdweb
  THIRDWEB_SECRET_KEY?: string

  // Conflux Configuration
  CONFLUX_CORE_PRIVATE_KEY?: string
  CONFLUX_CORE_SPACE_RPC_URL?: string
  CONFLUX_ESPACE_PRIVATE_KEY?: string
  CONFLUX_ESPACE_RPC_URL?: string
  CONFLUX_MEME_CONTRACT_ADDRESS?: string

  // Mind Network Configuration
  MIND_HOT_WALLET_PRIVATE_KEY?: string
  MIND_COLD_WALLET_ADDRESS?: string

  // ZeroG
  ZEROG_INDEXER_RPC?: string
  ZEROG_EVM_RPC?: string
  ZEROG_PRIVATE_KEY?: string
  ZEROG_FLOW_ADDRESS?: string

  // IQ6900
  // Load json recorded on-chain through IQ
  // Inscribe your json character file here: https://elizacodein.com/
  IQ_WALLET_ADDRESS?: string
  IQSOlRPC?: string

  // Squid Router
  SQUID_SDK_URL?: string
  SQUID_INTEGRATOR_ID?: string
  SQUID_EVM_ADDRESS?: string
  SQUID_EVM_PRIVATE_KEY?: string
  SQUID_API_THROTTLE_INTERVAL?: number

  // TEE Configuration
  // TEE_MODE options:
  // - LOCAL: Uses simulator at localhost:8090 (for local development)
  // - DOCKER: Uses simulator at host.docker.internal:8090 (for docker development)
  // - PRODUCTION: No simulator, uses production endpoints
  // Defaults to OFF if not specified
  TEE_MODE?: string
  TEE_LOG_DB_PATH?: string

  // TEE Verifiable Log Configuration
  VLOG?: boolean

  // Flow Blockchain Configuration
  FLOW_ADDRESS?: string
  FLOW_PRIVATE_KEY?: string
  FLOW_NETWORK?: string
  FLOW_ENDPOINT_URL?: string

  // ICP
  INTERNET_COMPUTER_PRIVATE_KEY?: string
  INTERNET_COMPUTER_ADDRESS?: string

  //Cloudflare AI Gateway
  CLOUDFLARE_GW_ENABLED?: boolean
  CLOUDFLARE_AI_ACCOUNT_ID?: string
  CLOUDFLARE_AI_GATEWAY_ID?: string

  // Aptos
  APTOS_PRIVATE_KEY?: string
  APTOS_NETWORK?: string

  // MultiversX
  MVX_PRIVATE_KEY?: string
  MVX_NETWORK?: string
  ACCESS_TOKEN_MANAGEMENT_TO?: string

  // NEAR
  NEAR_WALLET_SECRET_KEY?: string
  NEAR_WALLET_PUBLIC_KEY?: string
  NEAR_ADDRESS?: string
  NEAR_SLIPPAGE?: number
  NEAR_RPC_URL?: string
  NEAR_NETWORK?: string

  // ZKsync Era Configuration
  ZKSYNC_ADDRESS?: string
  ZKSYNC_PRIVATE_KEY?: string

  // HoldStation Wallet Configuration
  HOLDSTATION_PRIVATE_KEY?: string

  // Avail DA Configuration
  AVAIL_ADDRESS?: string
  AVAIL_SEED?: string
  AVAIL_APP_ID?: number
  AVAIL_RPC_URL?: string

  // Marlin
  TEE_MARLIN?: string
  TEE_MARLIN_ATTESTATION_ENDPOINT?: string

  // Ton
  TON_PRIVATE_KEY?: string
  TON_RPC_URL?: string
  TON_RPC_API_KEY?: string
  TON_NFT_IMAGES_FOLDER?: string
  TON_NFT_METADATA_FOLDER?: string
  PINATA_API_KEY?: string
  PINATA_API_SECRET?: string

  // Sui
  SUI_PRIVATE_KEY?: string
  SUI_NETWORK?: string

  // Mina Settings
  MINA_PRIVATE_KEY?: string
  MINA_NETWORK?: string

  // Story
  STORY_PRIVATE_KEY?: string
  STORY_API_BASE_URL?: string
  STORY_API_KEY?: string
  PINATA_JWT?: string

  // Cosmos
  COSMOS_RECOVERY_PHRASE?: string
  COSMOS_AVAILABLE_CHAINS?: string
  // Cronos zkEVM
  CRONOSZKEVM_ADDRESS?: string
  CRONOSZKEVM_PRIVATE_KEY?: string

  // Fuel Ecosystem (FuelVM)
  FUEL_WALLET_PRIVATE_KEY?: string

  // Tokenizer Settings
  TOKENIZER_MODEL?: string
  TOKENIZER_TYPE?: string

  // Spheron
  SPHERON_PRIVATE_KEY?: string
  SPHERON_PROVIDER_PROXY_URL?: string
  SPHERON_WALLET_ADDRESS?: string

  // Stargaze NFT marketplace from Cosmos (You can use https://graphql.mainnet.stargaze-apis.com/graphql)
  STARGAZE_ENDPOINT?: string

  // GenLayer
  GENLAYER_PRIVATE_KEY?: string

  // BNB chain
  BNB_PRIVATE_KEY?: string
  BNB_PUBLIC_KEY?: string
  BSC_PROVIDER_URL?: string
  OPBNB_PROVIDER_URL?: string

  // ####################################
  // #### Misc Plugin Configurations ####
  // ####################################
  // Intiface Configuration
  INTIFACE_WEBSOCKET_URL?: string

  // API key for giphy from https://developers.giphy.com/dashboard/
  GIPHY_API_KEY?: string

  // OpenWeather
  OPEN_WEATHER_API_KEY?: string

  //GITCOIN Passport
  PASSPORT_API_KEY?: string
  PASSPORT_SCORER?: string

  // EchoChambers Configuration
  ECHOCHAMBERS_API_URL?: string
  ECHOCHAMBERS_API_KEY?: string
  ECHOCHAMBERS_USERNAME?: string
  ECHOCHAMBERS_ROOMS?: string
  ECHOCHAMBERS_POLL_INTERVAL?: number
  ECHOCHAMBERS_MAX_MESSAGES?: number
  // How often the agent checks if it should start a conversation
  ECHOCHAMBERS_CONVERSATION_STARTER_INTERVAL?: number
  // How long a room must be quiet before starting a new conversation
  ECHOCHAMBERS_QUIET_PERIOD?: number

  // Allora
  ALLORA_API_KEY?: string
  ALLORA_CHAIN_SLUG?: string

  // B2 Network
  B2_PRIVATE_KEY?: string

  // Opacity zkTLS
  OPACITY_TEAM_ID?: string
  OPACITY_CLOUDFLARE_NAME?: string
  OPACITY_PROVER_URL?: string

  // AWS Credentials for S3 File Upload and Amazon Bedrock
  AWS_ACCESS_KEY_ID?: string
  AWS_SECRET_ACCESS_KEY?: string
  AWS_REGION?: string
  AWS_S3_BUCKET?: string
  AWS_S3_UPLOAD_PATH?: string
  AWS_S3_ENDPOINT?: string
  AWS_S3_SSL_ENABLED?: boolean
  AWS_S3_FORCE_PATH_STYLE?: boolean

  // Deva Configuration
  DEVA_API_KEY?: string
  DEVA_API_BASE_URL?: string

  // Deepgram
  DEEPGRAM_API_KEY?: string

  // Verifiable Inference Configuration
  VERIFIABLE_INFERENCE_ENABLED?: boolean
  VERIFIABLE_INFERENCE_PROVIDER?: string

  // Qdrant
  // URL of your Qdrant instance (e.g., https://your-instance.qdrant.tech)
  QDRANT_URL?: string
  // API key for authentication (optional for local instances)
  QDRANT_KEY?: string
  // Qdrant service port (default: 443 for cloud, typically 6333 for local)
  QDRANT_PORT?: number
  // Vector size matching your embedding model (default: 1536 for OpenAI embeddings)
  QDRANT_VECTOR_SIZE?: number

  // Autonome Configuration
  AUTONOME_JWT_TOKEN?: string
  AUTONOME_RPC?: string

  // ####################################
  // #### Akash Network Configuration ####
  // ####################################
  AKASH_ENV?: string
  AKASH_NET?: string
  RPC_ENDPOINT?: string
  AKASH_GAS_PRICES?: string
  AKASH_GAS_ADJUSTMENT?: number
  AKASH_KEYRING_BACKEND?: string
  AKASH_FROM?: string
  AKASH_FEES?: string
  AKASH_DEPOSIT?: string
  AKASH_MNEMONIC?: string
  AKASH_WALLET_ADDRESS?: string
  // Akash Pricing API
  AKASH_PRICING_API_URL?: string
  // Default values # 1 CPU = 1000 1GB = 1000000000 1GB = 1000000000
  AKASH_DEFAULT_CPU?: number
  AKASH_DEFAULT_MEMORY?: number
  AKASH_DEFAULT_STORAGE?: number
  AKASH_SDL?: string
  // Close deployment
  // Close all deployments = closeAll
  // Close a single deployment = dseq and add the value in AKASH_CLOSE_DSEQ
  AKASH_CLOSE_DEP?: string
  AKASH_CLOSE_DSEQ?: number
  // Provider Info we added one to check you will have to pass this into the action
  AKASH_PROVIDER_INFO?: string
  // Deployment Status
  // AKASH_DEP_STATUS = dseq or param_passed when you are building you wil pass the dseq dinamically to test you
  // you can pass the dseq using AKASH_DEP_DSEQ 19729929 is an example of a dseq we test while build.
  AKASH_DEP_STATUS?: string
  AKASH_DEP_DSEQ?: number
  // Gas Estimation Options: close, create, or update
  // qseq is required when operation is "close" 19729929 is an example of a dseq we test while build.
  AKASH_GAS_OPERATION?: string
  AKASH_GAS_DSEQ?: number
  // Manifest
  // Values: "auto" | "manual" | "validate_only" Default: "auto"
  AKASH_MANIFEST_MODE?: string
  // Default: Will use the SDL directory
  AKASH_MANIFEST_PATH?: string
  // Values: "strict" | "lenient" | "none" - Default: "strict"
  AKASH_MANIFEST_VALIDATION_LEVEL?: string
  // Quai Network Ecosystem
  QUAI_PRIVATE_KEY?: string
  QUAI_RPC_URL?: string

  // Chainbase
  // demo is a free tier key
  CHAINBASE_API_KEY?: string

  // 0x
  ZERO_EX_API_KEY?: string
  ALCHEMY_HTTP_TRANSPORT_URL?: string

  // Instagram Configuration
  INSTAGRAM_DRY_RUN?: boolean
  INSTAGRAM_USERNAME?: string
  INSTAGRAM_PASSWORD?: string
  INSTAGRAM_APP_ID?: string
  INSTAGRAM_APP_SECRET?: string
  INSTAGRAM_BUSINESS_ACCOUNT_ID?: string
  INSTAGRAM_POST_INTERVAL_MIN?: number
  INSTAGRAM_POST_INTERVAL_MAX?: number
  INSTAGRAM_ENABLE_ACTION_PROCESSING?: boolean
  INSTAGRAM_ACTION_INTERVAL?: number
  INSTAGRAM_MAX_ACTIONS?: number

  // ####################################
  // #### Pyth Plugin Configuration ####
  // ####################################
  // Network Environment (mainnet or testnet)git
  PYTH_NETWORK_ENV?: string

  // Mainnet Network Configuration
  PYTH_MAINNET_HERMES_URL?: string
  PYTH_MAINNET_WSS_URL?: string
  PYTH_MAINNET_PYTHNET_URL?: string
  PYTH_MAINNET_CONTRACT_REGISTRY?: string
  PYTH_MAINNET_PROGRAM_KEY?: string

  // Testnet Network Configuration
  PYTH_TESTNET_HERMES_URL?: string
  PYTH_TESTNET_WSS_URL?: string
  PYTH_TESTNET_PYTHNET_URL?: string
  PYTH_TESTNET_CONTRACT_REGISTRY?: string
  PYTH_TESTNET_PROGRAM_KEY?: string

  // Connection Settings
  PYTH_MAX_RETRIES?: number
  PYTH_RETRY_DELAY?: number
  PYTH_TIMEOUT?: number
  PYTH_GRANULAR_LOG?: boolean
  PYTH_LOG_LEVEL?: string

  // Runtime Settings
  RUNTIME_CHECK_MODE?: boolean

  // Pyth Price Streaming and test ID
  PYTH_ENABLE_PRICE_STREAMING?: boolean
  PYTH_MAX_PRICE_STREAMS?: number
  PYTH_TEST_ID01?: string
  PYTH_TEST_ID02?: string

  // Router Nitro EVM Configuration
  ROUTER_NITRO_EVM_ADDRESS?: string
  ROUTER_NITRO_EVM_PRIVATE_KEY?: string

  // OriginTrail DKG
  DKG_ENVIRONMENT?: string
  // Values: "development", "testnet", "mainnet"
  DKG_HOSTNAME?: string
  DKG_PORT?: string
  DKG_PUBLIC_KEY?: string
  DKG_PRIVATE_KEY?: string
  DKG_BLOCKCHAIN_NAME?: string
  // Values: (mainnet) "base:8453", "gnosis:100", "otp:2043" (testnet) "base:84532", "gnosis:10200", "otp:20430"

  // Initia Plugin Configuration
  INITIA_PRIVATE_KEY?: string
  INITIA_NODE_URL?: string
  INITIA_CHAIN_ID?: string

  // # ####################################
  // #### NVIDIA Configuration ##########
  // # ####################################
  NVIDIA_NIM_ENV?: string
  NVIDIA_NIM_SPASH?: boolean
  // Api Keys
  NVIDIA_NIM_API_KEY?: string
  NVIDIA_NGC_API_KEY?: string
  NVIDIA_NIM_MAX_RETRIES?: number
  NVIDIA_NIM_RETRY_DELAY?: number
  NVIDIA_NIM_TIMEOUT?: number
  // Logging Configuration
  NVIDIA_GRANULAR_LOG?: boolean
  NVIDIA_LOG_LEVEL?: string
  // NVIDIA Off-topic system and user configuration
  NVIDIA_OFFTOPIC_SYSTEM?: string
  NVIDIA_OFFTOPIC_USER?: string
  // NVIDIA Cosmos Model Configuration
  NVIDIA_NIM_BASE_VISION_URL?: string
  NVIDIA_COSMOS_MODEL?: string
  NVIDIA_COSMOS_INVOKE_URL?: string
  NVIDIA_COSMOS_ASSET_URL?: string
  NVIDIA_COSMOS_MAX_TOKENS?: number

  // Email Plugin Configuration
  // Outgoing Email Settings (SMTP/Gmail)
  EMAIL_OUTGOING_SERVICE?: string
  EMAIL_OUTGOING_HOST?: string
  EMAIL_OUTGOING_PORT?: number
  EMAIL_OUTGOING_USER?: string
  EMAIL_OUTGOING_PASS?: string

  // Incoming Email Settings (IMAP)
  EMAIL_INCOMING_SERVICE?: string
  EMAIL_INCOMING_HOST?: string
  EMAIL_INCOMING_PORT?: number
  EMAIL_INCOMING_USER?: string
  EMAIL_INCOMING_PASS?: string

  // SEI Network Ecosystem
  SEI_PRIVATE_KEY?: string
  SEI_NETWORK?: string
  SEI_RPC_URL?: string

  // Omniflix
  OMNIFLIX_API_URL?: string
  OMNIFLIX_MNEMONIC?: string
  OMNIFLIX_RPC_ENDPOINT?: string
  OMNIFLIX_PRIVATE_KEY?: string

  // Suno AI Music Generation
  SUNO_API_KEY?: string

  // Udio AI Music Generation
  UDIO_AUTH_TOKEN?: string

  // Football Plugin Configuration
  FOOTBALL_API_KEY?: string

  // Imgflip
  IMGFLIP_USERNAME?: string
  IMGFLIP_PASSWORD?: string

  // Hyperliquid Api
  HYPERLIQUID_PRIVATE_KEY?: string
  HYPERLIQUID_TESTNET?: boolean

  // Lit Protocol
  FUNDING_PRIVATE_KEY?: string
  EVM_RPC_URL?: string

  // EthStorage DA Configuration
  ETHSTORAGE_PRIVATE_KEY?: string
  ETHSTORAGE_ADDRESS?: string
  ETHSTORAGE_RPC_URL?: string

  // Email Automation Plugin Configuration
  RESEND_API_KEY?: string
  DEFAULT_TO_EMAIL?: string
  DEFAULT_FROM_EMAIL?: string

  // Optional Settings
  EMAIL_AUTOMATION_ENABLED?: boolean
  EMAIL_EVALUATION_PROMPT?: string

  // ####################################
  // #### ANKR Configuration ####
  // ####################################
  ANKR_ENV?: string
  ANKR_WALLET?: string
  ANKR_MAX_RETRIES?: number
  ANKR_RETRY_DELAY?: number
  ANKR_TIMEOUT?: number
  ANKR_GRANULAR_LOG?: boolean
  ANKR_LOG_LEVEL?: string
  ANKR_RUNTIME_CHECK_MODE?: boolean
  ANKR_SPASH?: boolean

  // DCAP Plugin Configuration
  DCAP_EVM_PRIVATE_KEY?: string
  DCAP_MODE?: string

  // QuickIntel Token Security API
  QUICKINTEL_API_KEY?: string

  // News API Key
  NEWS_API_KEY?: string

  // BTCFUN Plugin Configuration
  BTCFUN_API_URL?: string
  BTC_PRIVATE_KEY_WIF?: string
  BTC_ADDRESS?: string
  BTC_MINT_CAP?: number
  BTC_MINT_DEADLINE?: number
  BTC_FUNDRAISING_CAP?: number

  // Trikon Plugin Configuration
  TRIKON_WALLET_ADDRESS?: string
  TRIKON_INITIAL_BALANCE?: string

  // ####################################
  // #### Arbitrage Plugin Configuration ####
  // ####################################
  ARBITRAGE_ETHEREUM_WS_URL?: string
  ARBITRAGE_EVM_PROVIDER_URL?: string
  ARBITRAGE_EVM_PRIVATE_KEY?: string
  FLASHBOTS_RELAY_SIGNING_KEY?: string
  BUNDLE_EXECUTOR_ADDRESS?: string

  // DESK Exchange Plugin Configration
  DESK_EXCHANGE_PRIVATE_KEY?: string
  DESK_EXCHANGE_NETWORK?: string
}

interface AgentPlugin {
  name: string
  enabled: boolean
  config?: Record<string, any>
}

interface AgentClient {
  name: string
  enabled: boolean
  config?: Record<string, any>
}

interface AgentVoiceSettings {
  model: string
  provider?: string
}

interface AgentSettings {
  secrets: Record<string, string>
  voice?: AgentVoiceSettings
  transcriptionProvider?: string
  modelProvider?: string
  customModelEndpoint?: string
}

interface AgentConfig {
  name: string
  plugins: AgentPlugin[]
  clients: AgentClient[]
  modelProvider: string
  settings: AgentSettings
  system?: string
  bio: string[]
  lore?: string[]
  knowledge?: string[]
  messageExamples?: Array<Array<{
    user: string
    content: {
      text: string
    }
  }>>
  style?: {
    all: string[]
    chat: string[]
    post: string[]
  }
  postExamples?: string[]
  topics?: string[]
  adjectives?: string[]
}

interface AgentDeploySettings {
    config: AgentConfig | null
    env: AgentEnvironmentVars
    setConfig: (config: AgentConfig | null) => void
    getConfig: () => AgentConfig | null
    updateSettings: (settings: Partial<AgentSettings>) => void
    setEnv: (env: AgentEnvironmentVars) => void
    getEnv: () => AgentEnvironmentVars
    updateEnv: (env: Partial<AgentEnvironmentVars>) => void
    addPlugin: (plugin: AgentPlugin) => void
    removePlugin: (pluginName: string) => void
    addClient: (client: AgentClient) => void
    removeClient: (clientName: string) => void
    reset: () => void
}

export interface AgentDeployState extends AgentDeploySettings {}

export const useAgentDeployStore = create<AgentDeployState>()(
  persist(
    (set, get) => ({
        config: null,
        env: {},
        setConfig: (config) =>
          set((state) => ({ ...state, config })),
        getConfig: () => get().config,
        updateSettings: (settings) =>
          set((state) => ({
            ...state,
            config: state.config
              ? {
                  ...state.config,
                  settings: { ...state.config.settings, ...settings },
                }
              : null,
          })),
        addPlugin: (plugin) =>
          set((state) => ({
            ...state,
            config: state.config
              ? {
                  ...state.config,
                  plugins: [...state.config.plugins, plugin],
                }
              : null,
          })),
        removePlugin: (pluginName) =>
          set((state) => ({
            ...state,
            config: state.config
              ? {
                  ...state.config,
                  plugins: state.config.plugins.filter(
                    (p) => p.name !== pluginName
                  ),
                }
              : null,
          })),
        addClient: (client) =>
          set((state) => ({
            ...state,
            config: state.config
              ? {
                  ...state.config,
                  clients: [...state.config.clients, client],
                }
              : null,
          })),
        removeClient: (clientName) =>
          set((state) => ({
            ...state,
            config: state.config
              ? {
                  ...state.config,
                  clients: state.config.clients.filter(
                    (c) => c.name !== clientName
                  ),
                }
              : null,
          })),
        setEnv: (env) =>
          set((state) => ({ ...state, env })),
        getEnv: () => get().env,
        updateEnv: (env) =>
          set((state) => ({
            ...state,
            env: { ...state.env, ...env },
          })),
        reset: () =>
          set((state) => ({
            ...state,
            config: null,
            env: {},
          })),
    }),
    {
      name: 'agent-deploy-storage',
    }
  )
)

//export const useAgentDeploy = () => useAgentDeployStore((state) => state)