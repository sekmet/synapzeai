export interface AgentEnvironmentVars {

    // ####################################
    // #### Server & DB Configurations ####
    // ####################################
    
    server: {
      // Cache Configs
      CACHE_STORE?: string;           // Defaults to 'database'. Other options: 'redis', 'filesystem'
      CACHE_DIR?: string;             // Directory to store cache files if using filesystem cache
      REDIS_URL?: string;             // Redis URL, supports rediss:// URLs
      SERVER_URL?: string;            // Server URL, e.g., 'http://localhost'
      SERVER_PORT?: number;           // Server port number, e.g., 3000

      REMOTE_CHARACTER_URLS?: string; // Comma-separated list of remote character URLs
      USE_CHARACTER_STORAGE?: boolean; // Whether to store characters in data/character folder

      DEFAULT_LOG_LEVEL?: string;     // Logging level, e.g., 'info'
      LOG_JSON_FORMAT?: boolean;      // Whether to print logs in JSON format
      EXPRESS_MAX_PAYLOAD?: string;   // Max payload size for Express, e.g., '100kb'
      TRANSCRIPTION_PROVIDER?: string; // Transcription provider, e.g., 'local', 'openai', 'deepgram'

      //# Fallback Wallet Configuration (deprecated)
      WALLET_PRIVATE_KEY?: string;    // Fallback wallet private key
      WALLET_PUBLIC_KEY?: string;     // Fallback wallet public key

      // # Tokenizer Settings
      tokenizer: {
        TOKENIZER_MODEL?: string;       // Tokenizer model
        TOKENIZER_TYPE?: string;        // Type, e.g., 'tiktoken', 'auto'
      };

      // Cloudflare AI Configuration
      cloudflare: {
        CLOUDFLARE_GW_ENABLED?: boolean; // Enable Cloudflare gateway
        CLOUDFLARE_AI_ACCOUNT_ID?: string; // Account ID
        CLOUDFLARE_AI_GATEWAY_ID?: string; // Gateway ID
      }

      // # AWS Credentials for S3 File Upload and Amazon Bedrock
      aws: {
        AWS_ACCESS_KEY_ID?: string;     // AWS access key ID
        AWS_SECRET_ACCESS_KEY?: string; // AWS secret access key
        AWS_REGION?: string;            // AWS region
        AWS_S3_BUCKET?: string;         // S3 bucket
        AWS_S3_UPLOAD_PATH?: string;    // S3 upload path
        AWS_S3_ENDPOINT?: string;       // S3 endpoint
        AWS_S3_SSL_ENABLED?: boolean;   // SSL enabled
        AWS_S3_FORCE_PATH_STYLE?: boolean; // Force path style
      };      


      // # Verifiable Inference Configuration
      verifiable_inference: {
        VERIFIABLE_INFERENCE_ENABLED?: boolean; // Enable verifiable inference
        VERIFIABLE_INFERENCE_PROVIDER?: string; // Provider, e.g., 'opacity'
      };

    };
  
    adapter_pglite: {
      PGLITE_DATA_DIR?: string;       // Directory or 'memory://' for PGLite data
    };
  
    adapter_supabase: {
      SUPABASE_URL?: string;          // Supabase API URL
      SUPABASE_ANON_KEY?: string;     // Supabase anonymous key
    };
  
    adapter_mongodb: {
      MONGODB_CONNECTION_STRING?: string; // MongoDB connection string
      MONGODB_DATABASE?: string;      // MongoDB database name, e.g., 'elizaAgent'
    };
  
    // ###############################
    // #### Client Configurations ####
    // ###############################

    client_discord: {
      DISCORD_APPLICATION_ID?: string; // Discord app ID
      DISCORD_API_TOKEN?: string;     // Discord bot token
      DISCORD_VOICE_CHANNEL_ID?: string; // Voice channel ID for the bot
    };
  
    client_farcaster: {
      FARCASTER_FID?: string;         // Farcaster FID
      FARCASTER_NEYNAR_API_KEY?: string; // Neynar API key
      FARCASTER_NEYNAR_SIGNER_UUID?: string; // Neynar signer UUID
      FARCASTER_DRY_RUN?: boolean;    // Dry run mode for Farcaster
      FARCASTER_POLL_INTERVAL?: number; // Poll interval in seconds
    };
  
    client_telegram: {
      TELEGRAM_BOT_TOKEN?: string;    // Telegram bot token
      TELEGRAM_ACCOUNT_PHONE?: string; // Account phone number
      TELEGRAM_ACCOUNT_APP_ID?: string; // Telegram app ID
      TELEGRAM_ACCOUNT_APP_HASH?: string; // Telegram app hash
      TELEGRAM_ACCOUNT_DEVICE_MODEL?: string; // Device model
      TELEGRAM_ACCOUNT_SYSTEM_VERSION?: string; // System version
    };
  
    client_twitter: {
      TWITTER_DRY_RUN?: boolean;      // Dry run mode for Twitter
      TWITTER_USERNAME?: string;      // Twitter username
      TWITTER_PASSWORD?: string;      // Twitter password
      TWITTER_EMAIL?: string;         // Twitter email
      TWITTER_2FA_SECRET?: string;    // 2FA secret
      TWITTER_COOKIES_AUTH_TOKEN?: string; // Auth token cookie
      TWITTER_COOKIES_CT0?: string;   // CT0 cookie
      TWITTER_COOKIES_GUEST_ID?: string; // Guest ID cookie
      TWITTER_POLL_INTERVAL?: number; // Poll interval in seconds
      TWITTER_SEARCH_ENABLE?: boolean; // Enable timeline search
      TWITTER_TARGET_USERS?: string;  // Comma-separated target users
      TWITTER_RETRY_LIMIT?: number;   // Max retry attempts
      TWITTER_SPACES_ENABLE?: boolean; // Enable Twitter Spaces
      ENABLE_TWITTER_POST_GENERATION?: boolean; // Enable tweet generation
      POST_INTERVAL_MIN?: number;     // Min post interval in minutes
      POST_INTERVAL_MAX?: number;     // Max post interval in minutes
      POST_IMMEDIATELY?: boolean;     // Post immediately
      ACTION_INTERVAL?: number;       // Action interval in minutes
      ENABLE_ACTION_PROCESSING?: boolean; // Enable action processing
      MAX_ACTIONS_PROCESSING?: number; // Max actions per cycle
      ACTION_TIMELINE_TYPE?: string;  // Timeline type, e.g., 'foryou'
      TWITTER_APPROVAL_DISCORD_CHANNEL_ID?: string; // Discord channel ID
      TWITTER_APPROVAL_DISCORD_BOT_TOKEN?: string; // Discord bot token
      TWITTER_APPROVAL_ENABLED?: boolean; // Enable approval
      TWITTER_APPROVAL_CHECK_INTERVAL?: number; // Check interval in ms
    };
  
    client_whatsapp: {
      WHATSAPP_ACCESS_TOKEN?: string; // WhatsApp access token
      WHATSAPP_PHONE_NUMBER_ID?: string; // Phone number ID
      WHATSAPP_BUSINESS_ACCOUNT_ID?: string; // Business account ID
      WHATSAPP_WEBHOOK_VERIFY_TOKEN?: string; // Webhook verify token
      WHATSAPP_API_VERSION?: string;  // API version, e.g., 'v17.0'
    };
  
    client_instagram: {
        INSTAGRAM_DRY_RUN?: boolean;    // Dry run mode
        INSTAGRAM_USERNAME?: string;    // Username
        INSTAGRAM_PASSWORD?: string;    // Password
        INSTAGRAM_APP_ID?: string;      // App ID
        INSTAGRAM_APP_SECRET?: string;  // App secret
        INSTAGRAM_BUSINESS_ACCOUNT_ID?: string; // Business account ID
        INSTAGRAM_POST_INTERVAL_MIN?: number; // Min post interval
        INSTAGRAM_POST_INTERVAL_MAX?: number; // Max post interval
        INSTAGRAM_ENABLE_ACTION_PROCESSING?: boolean; // Enable action processing
        INSTAGRAM_ACTION_INTERVAL?: number; // Action interval
        INSTAGRAM_MAX_ACTIONS?: number; // Max actions
    };

    client_alexa: {
      ALEXA_SKILL_ID?: string;        // Alexa skill ID
      ALEXA_CLIENT_ID?: string;       // OAuth2 client ID
      ALEXA_CLIENT_SECRET?: string;   // OAuth2 client secret
    };
  
    client_simsai: {
      SIMSAI_API_KEY?: string;        // SimsAI API key
      SIMSAI_AGENT_ID?: string;       // SimsAI agent ID
      SIMSAI_USERNAME?: string;       // SimsAI username
      SIMSAI_DRY_RUN?: boolean;       // Dry run mode
    };
  
    // #######################################
    // #### Model Provider Configurations ####
    // #######################################
  
    provider_openai: {
      OPENAI_API_KEY?: string;        // OpenAI API key
      OPENAI_API_URL?: string;        // OpenAI API endpoint
      SMALL_OPENAI_MODEL?: string;    // Small model name
      MEDIUM_OPENAI_MODEL?: string;   // Medium model name
      LARGE_OPENAI_MODEL?: string;    // Large model name
      EMBEDDING_OPENAI_MODEL?: string; // Embedding model name
      IMAGE_OPENAI_MODEL?: string;    // Image model name
      USE_OPENAI_EMBEDDING?: boolean; // Use OpenAI embedding
      ENABLE_OPEN_AI_COMMUNITY_PLUGIN?: boolean; // Enable community plugin
      OPENAI_DEFAULT_MODEL?: string;  // Default model
      OPENAI_MAX_TOKENS?: number;     // Max tokens
      OPENAI_TEMPERATURE?: number;    // Temperature
    };
  
    provider_atoma: {
      ATOMASDK_BEARER_AUTH?: string;  // Atoma bearer auth token
      ATOMA_API_URL?: string;         // Atoma API URL
      SMALL_ATOMA_MODEL?: string;     // Small model
      MEDIUM_ATOMA_MODEL?: string;    // Medium model
      LARGE_ATOMA_MODEL?: string;     // Large model
    };
  
    provider_eternalai: {
      ETERNALAI_URL?: string;         // Eternal AI URL
      ETERNALAI_MODEL?: string;       // Model name
      ETERNALAI_CHAIN_ID?: string;    // Chain ID
      ETERNALAI_RPC_URL?: string;     // RPC URL
      ETERNALAI_AGENT_CONTRACT_ADDRESS?: string; // Contract address
      ETERNALAI_AGENT_ID?: string;    // Agent ID
      ETERNALAI_API_KEY?: string;     // API key
      ETERNALAI_LOG?: boolean;        // Logging
    };
  
    provider_hyperbolic: {
      HYPERBOLIC_API_KEY?: string;    // Hyperbolic API key
      HYPERBOLIC_MODEL?: string;      // Model name
      IMAGE_HYPERBOLIC_MODEL?: string; // Image model
      SMALL_HYPERBOLIC_MODEL?: string; // Small model
      MEDIUM_HYPERBOLIC_MODEL?: string; // Medium model
      LARGE_HYPERBOLIC_MODEL?: string; // Large model
      HYPERBOLIC_ENV?: string;        // Environment
      HYPERBOLIC_GRANULAR_LOG?: boolean; // Granular logging
      HYPERBOLIC_SPASH?: boolean;     // Spash setting
      HYPERBOLIC_LOG_LEVEL?: string;  // Log level
    };
  
    provider_infera: {
      INFERA_API_KEY?: string;        // Infera API key
      INFERA_MODEL?: string;          // Model name
      INFERA_SERVER_URL?: string;     // Server URL
      SMALL_INFERA_MODEL?: string;    // Small model
      MEDIUM_INFERA_MODEL?: string;   // Medium model
      LARGE_INFERA_MODEL?: string;    // Large model
    };
  
    provider_venice: {
      VENICE_API_KEY?: string;        // Venice API key
      SMALL_VENICE_MODEL?: string;    // Small model
      MEDIUM_VENICE_MODEL?: string;   // Medium model
      LARGE_VENICE_MODEL?: string;    // Large model
      IMAGE_VENICE_MODEL?: string;    // Image model
    };
  
    provider_nineteen_ai: {
      NINETEEN_AI_API_KEY?: string;   // Nineteen.ai API key
      SMALL_NINETEEN_AI_MODEL?: string; // Small model
      MEDIUM_NINETEEN_AI_MODEL?: string; // Medium model
      LARGE_NINETEEN_AI_MODEL?: string; // Large model
      IMAGE_NINETEEN_AI_MODE?: string; // Image mode (likely typo in envs-sample)
    };
  
    provider_akash_chat_api: {
      AKASH_CHAT_API_KEY?: string;    // Akash chat API key
      SMALL_AKASH_CHAT_API_MODEL?: string; // Small model
      MEDIUM_AKASH_CHAT_API_MODEL?: string; // Medium model
      LARGE_AKASH_CHAT_API_MODEL?: string; // Large model
    };
  
    provider_livepeer: {
      LIVEPEER_GATEWAY_URL?: string;  // Livepeer gateway URL
      IMAGE_LIVEPEER_MODEL?: string;  // Image model
      SMALL_LIVEPEER_MODEL?: string;  // Small model
      MEDIUM_LIVEPEER_MODEL?: string; // Medium model
      LARGE_LIVEPEER_MODEL?: string;  // Large model
    };
  
    provider_elevenlabs: {
      ELEVENLABS_XI_API_KEY?: string; // ElevenLabs API key
      ELEVENLABS_MODEL_ID?: string;   // Model ID
      ELEVENLABS_VOICE_ID?: string;   // Voice ID
      ELEVENLABS_VOICE_STABILITY?: number; // Voice stability
      ELEVENLABS_VOICE_SIMILARITY_BOOST?: number; // Similarity boost
      ELEVENLABS_VOICE_STYLE?: number; // Voice style
      ELEVENLABS_VOICE_USE_SPEAKER_BOOST?: boolean; // Speaker boost
      ELEVENLABS_OPTIMIZE_STREAMING_LATENCY?: number; // Latency optimization
      ELEVENLABS_OUTPUT_FORMAT?: string; // Output format
    };
  
    provider_openrouter: {
      OPENROUTER_API_KEY?: string;    // OpenRouter API key
      OPENROUTER_MODEL?: string;      // Model name
      SMALL_OPENROUTER_MODEL?: string; // Small model
      MEDIUM_OPENROUTER_MODEL?: string; // Medium model
      LARGE_OPENROUTER_MODEL?: string; // Large model
    };
  
    provider_redpill: {
      REDPILL_API_KEY?: string;       // REDPILL API key
      REDPILL_MODEL?: string;         // Model name
      SMALL_REDPILL_MODEL?: string;   // Small model
      MEDIUM_REDPILL_MODEL?: string;  // Medium model
      LARGE_REDPILL_MODEL?: string;   // Large model
    };
  
    provider_grok: {
      GROK_API_KEY?: string;          // GROK/xAI API key
      SMALL_GROK_MODEL?: string;      // Small model
      MEDIUM_GROK_MODEL?: string;     // Medium model
      LARGE_GROK_MODEL?: string;      // Large model
      EMBEDDING_GROK_MODEL?: string;  // Embedding model
    };
  
    provider_ollama: {
      OLLAMA_SERVER_URL?: string;     // Ollama server URL
      OLLAMA_MODEL?: string;          // Model name
      USE_OLLAMA_EMBEDDING?: boolean; // Use Ollama embedding
      OLLAMA_EMBEDDING_MODEL?: string; // Embedding model
      SMALL_OLLAMA_MODEL?: string;    // Small model
      MEDIUM_OLLAMA_MODEL?: string;   // Medium model
      LARGE_OLLAMA_MODEL?: string;    // Large model
    };
  
    provider_google: {
      GOOGLE_MODEL?: string;          // Model name
      SMALL_GOOGLE_MODEL?: string;    // Small model
      MEDIUM_GOOGLE_MODEL?: string;   // Medium model
      LARGE_GOOGLE_MODEL?: string;    // Large model
      EMBEDDING_GOOGLE_MODEL?: string; // Embedding model
      GOOGLE_GENERATIVE_AI_API_KEY?: string; // Gemini API key
    };
  
    provider_mistral: {
      MISTRAL_MODEL?: string;         // Model name
      SMALL_MISTRAL_MODEL?: string;   // Small model
      MEDIUM_MISTRAL_MODEL?: string;  // Medium model
      LARGE_MISTRAL_MODEL?: string;   // Large model
    };
  
    provider_groq: {
      GROQ_API_KEY?: string;          // Groq API key
      SMALL_GROQ_MODEL?: string;      // Small model
      MEDIUM_GROQ_MODEL?: string;     // Medium model
      LARGE_GROQ_MODEL?: string;      // Large model
      EMBEDDING_GROQ_MODEL?: string;  // Embedding model
    };
  
    provider_llamalocal: {
      LLAMALOCAL_PATH?: string;       // Path for LlamaLocal
    };
  
    provider_nanogpt: {
      SMALL_NANOGPT_MODEL?: string;   // Small model
      MEDIUM_NANOGPT_MODEL?: string;  // Medium model
      LARGE_NANOGPT_MODEL?: string;   // Large model
      NANOGPT_API_KEY?: string;       // NanoGPT API key
    };
  
    provider_anthropic: {
      ANTHROPIC_API_KEY?: string;     // Anthropic API key
      SMALL_ANTHROPIC_MODEL?: string; // Small model
      MEDIUM_ANTHROPIC_MODEL?: string; // Medium model
      LARGE_ANTHROPIC_MODEL?: string; // Large model
    };
  
    provider_heurist: {
      HEURIST_API_KEY?: string;       // Heurist API key
      SMALL_HEURIST_MODEL?: string;   // Small model
      MEDIUM_HEURIST_MODEL?: string;  // Medium model
      LARGE_HEURIST_MODEL?: string;   // Large model
      HEURIST_IMAGE_MODEL?: string;   // Image model
      HEURIST_EMBEDDING_MODEL?: string; // Embedding model
      USE_HEURIST_EMBEDDING?: boolean; // Use Heurist embedding
    };
  
    provider_gaianet: {
      GAIANET_MODEL?: string;         // Model name
      GAIANET_SERVER_URL?: string;    // Server URL
      SMALL_GAIANET_MODEL?: string;   // Small model
      SMALL_GAIANET_SERVER_URL?: string; // Small server URL
      MEDIUM_GAIANET_MODEL?: string;  // Medium model
      MEDIUM_GAIANET_SERVER_URL?: string; // Medium server URL
      LARGE_GAIANET_MODEL?: string;   // Large model
      LARGE_GAIANET_SERVER_URL?: string; // Large server URL
      GAIANET_EMBEDDING_MODEL?: string; // Embedding model
      USE_GAIANET_EMBEDDING?: boolean; // Use Gaianet embedding
    };
  
    provider_volengine: {
      VOLENGINE_API_URL?: string;     // Volengine API URL
      VOLENGINE_MODEL?: string;       // Model name
      SMALL_VOLENGINE_MODEL?: string; // Small model
      MEDIUM_VOLENGINE_MODEL?: string; // Medium model
      LARGE_VOLENGINE_MODEL?: string; // Large model
      VOLENGINE_EMBEDDING_MODEL?: string; // Embedding model
    };
  
    provider_deepseek: {
      DEEPSEEK_API_KEY?: string;      // DeepSeek API key
      DEEPSEEK_API_URL?: string;      // API URL
      SMALL_DEEPSEEK_MODEL?: string;  // Small model
      MEDIUM_DEEPSEEK_MODEL?: string; // Medium model
      LARGE_DEEPSEEK_MODEL?: string;  // Large model
    };
  
    provider_falai: {
      FAL_API_KEY?: string;           // fal.ai API key
      FAL_AI_LORA_PATH?: string;      // LORA path
    };
  
    provider_letzai: {
      LETZAI_API_KEY?: string;        // LetzAI API key
      LETZAI_MODELS?: string;         // List of models
    };
  
    provider_galadriel: {
      GALADRIEL_API_KEY?: string;     // Galadriel API key
      SMALL_GALADRIEL_MODEL?: string; // Small model
      MEDIUM_GALADRIEL_MODEL?: string; // Medium model
      LARGE_GALADRIEL_MODEL?: string; // Large model
      GALADRIEL_FINE_TUNE_API_KEY?: string; // Fine-tune API key
    };
  
    provider_lmstudio: {
      LMSTUDIO_SERVER_URL?: string;   // LM Studio server URL
      LMSTUDIO_MODEL?: string;        // Model name
      SMALL_LMSTUDIO_MODEL?: string;  // Small model
      MEDIUM_LMSTUDIO_MODEL?: string; // Medium model
      LARGE_LMSTUDIO_MODEL?: string;  // Large model
    };
  
    provider_secret_ai: {
      SECRET_AI_API_KEY?: string;     // Secret AI API key
      SECRET_AI_URL?: string;         // API URL
      SMALL_SECRET_AI_MODEL?: string; // Small model
      MEDIUM_SECRET_AI_MODEL?: string; // Medium model
      LARGE_SECRET_AI_MODEL?: string; // Large model
    };
  
    provider_nearai: {
      NEARAI_API_URL?: string;        // NEAR AI API URL
      NEARAI_API_KEY?: string;        // API key
      NEARAI_MODEL?: string;          // Model name
      SMALL_NEARAI_MODEL?: string;    // Small model
      MEDIUM_NEARAI_MODEL?: string;   // Medium model
      LARGE_NEARAI_MODEL?: string;    // Large model
      IMAGE_NEARAI_MODEL?: string;    // Image model
    };
  
    provider_together: {
      TOGETHER_API_KEY?: string;      // Together API key
    };
  
    provider_ali_bailian: {
      ALI_BAILIAN_API_KEY?: string;   // Ali Bailian API key
    };
  
    // ######################################
    // #### Crypto Plugin Configurations ####
    // ######################################
  
    plugin_coinmarketcap: {
      COINMARKETCAP_API_KEY?: string; // CoinMarketCap API key
    };
  
    plugin_zerion: {
      ZERION_API_KEY?: string;        // Zerion API key
    };
  
    plugin_coingecko: {
      COINGECKO_API_KEY?: string;     // CoinGecko API key
      COINGECKO_PRO_API_KEY?: string; // CoinGecko Pro API key
    };
  
    plugin_moralis: {
      MORALIS_API_KEY?: string;       // Moralis API key
    };
  
    plugin_evm: {
      EVM_PRIVATE_KEY?: string;       // EVM private key
      EVM_PROVIDER_URL?: string;      // EVM provider URL
    };
  
    plugin_zilliqa: {
      ZILLIQA_PRIVATE_KEY?: string;   // Zilliqa private key
      ZILLIQA_PROVIDER_URL?: string;  // Zilliqa provider URL
    };
  
    plugin_avalanche: {
      AVALANCHE_PRIVATE_KEY?: string; // Avalanche private key
      AVALANCHE_PUBLIC_KEY?: string;  // Avalanche public key
    };
  
    plugin_arthera: {
      ARTHERA_PRIVATE_KEY?: string;   // Arthera private key
    };
  
    plugin_solana: {
      SOLANA_PRIVATE_KEY?: string;    // Solana private key
      SOLANA_PUBLIC_KEY?: string;     // Solana public key
      SOLANA_CLUSTER?: string;        // Cluster, e.g., 'devnet'
      SOLANA_ADMIN_PRIVATE_KEY?: string; // Admin private key
      SOLANA_ADMIN_PUBLIC_KEY?: string; // Admin public key
      SOLANA_VERIFY_TOKEN?: string;   // Verification token
      SOL_ADDRESS?: string;           // SOL address
      SLIPPAGE?: number;              // Slippage
      BASE_MINT?: string;             // Base mint address
      SOLANA_RPC_URL?: string;        // RPC URL
      HELIUS_API_KEY?: string;        // Helius API key
    };
  
    plugin_injective: {
      INJECTIVE_PRIVATE_KEY?: string; // Injective private key
      INJECTIVE_PUBLIC_KEY?: string;  // Injective public key
      INJECTIVE_NETWORK?: string;     // Network
    };
  
    plugin_birdeye: {
      BIRDEYE_API_KEY?: string;       // Birdeye API key
    };
  
    plugin_abstract: {
      ABSTRACT_ADDRESS?: string;      // Abstract address
      ABSTRACT_PRIVATE_KEY?: string;  // Abstract private key
      ABSTRACT_RPC_URL?: string;      // Abstract RPC URL
    };
  
    plugin_starknet: {
      STARKNET_ADDRESS?: string;      // Starknet address
      STARKNET_PRIVATE_KEY?: string;  // Starknet private key
      STARKNET_RPC_URL?: string;      // Starknet RPC URL
    };
  
    plugin_lens: {
      LENS_ADDRESS?: string;          // Lens address
      LENS_PRIVATE_KEY?: string;      // Lens private key
    };
  
    plugin_form: {
      FORM_PRIVATE_KEY?: string;      // Form private key
      FORM_TESTNET?: boolean;         // Testnet flag
    };
  
    plugin_coinbase: {
      COINBASE_COMMERCE_KEY?: string; // Coinbase commerce key
      COINBASE_API_KEY?: string;      // Coinbase API key
      COINBASE_PRIVATE_KEY?: string;  // Coinbase private key
      COINBASE_GENERATED_WALLET_ID?: string; // Wallet ID
      COINBASE_GENERATED_WALLET_HEX_SEED?: string; // Wallet hex seed
      COINBASE_NOTIFICATION_URI?: string; // Notification URI
    };
  
    plugin_coinbase_agentkit: {
      CDP_API_KEY_NAME?: string;      // AgentKit API key name
      CDP_API_KEY_PRIVATE_KEY?: string; // AgentKit private key
      CDP_AGENT_KIT_NETWORK?: string; // Network, e.g., 'base-sepolia'
    };
  
    plugin_coinbase_charity: {
      IS_CHARITABLE?: boolean;        // Enable charity
      CHARITY_ADDRESS_BASE?: string;  // Base charity address
      CHARITY_ADDRESS_SOL?: string;   // Solana charity address
      CHARITY_ADDRESS_ETH?: string;   // Ethereum charity address
      CHARITY_ADDRESS_ARB?: string;   // Arbitrum charity address
      CHARITY_ADDRESS_POL?: string;   // Polygon charity address
    };
  
    plugin_thirdweb: {
      THIRDWEB_SECRET_KEY?: string;   // Thirdweb secret key
    };
  
    plugin_conflux: {
      CONFLUX_CORE_PRIVATE_KEY?: string; // Core private key
      CONFLUX_CORE_SPACE_RPC_URL?: string; // Core RPC URL
      CONFLUX_ESPACE_PRIVATE_KEY?: string; // ESpace private key
      CONFLUX_ESPACE_RPC_URL?: string; // ESpace RPC URL
      CONFLUX_MEME_CONTRACT_ADDRESS?: string; // Meme contract address
    };
  
    plugin_mind_network: {
      MIND_HOT_WALLET_PRIVATE_KEY?: string; // Hot wallet private key
      MIND_COLD_WALLET_ADDRESS?: string; // Cold wallet address
    };
  
    plugin_0g: {
      ZEROG_INDEXER_RPC?: string;     // Indexer RPC
      ZEROG_EVM_RPC?: string;         // EVM RPC
      ZEROG_PRIVATE_KEY?: string;     // Private key
      ZEROG_FLOW_ADDRESS?: string;    // Flow address
    };
  
    plugin_iq6900: {
      IQ_WALLET_ADDRESS?: string;     // Wallet address
      IQSOlRPC?: string;              // RPC URL (likely typo in envs-sample)
    };
  
    plugin_squid_router: {
      SQUID_SDK_URL?: string;         // Squid SDK URL
      SQUID_INTEGRATOR_ID?: string;   // Integrator ID
      SQUID_EVM_ADDRESS?: string;     // EVM address
      SQUID_EVM_PRIVATE_KEY?: string; // EVM private key
      SQUID_API_THROTTLE_INTERVAL?: number; // Throttle interval in ms
    };
  
    plugin_tee: {
      TEE_MODE?: string;              // Mode: 'LOCAL', 'DOCKER', 'PRODUCTION', 'OFF'
      WALLET_SECRET_SALT?: string;    // Secret salt
      TEE_LOG_DB_PATH?: string;       // Log database path
      VLOG?: boolean;                 // Verifiable log
      ENABLE_TEE_LOG?: boolean;       // Enable TEE logging
    };
  
    plugin_flow: {
      FLOW_ADDRESS?: string;          // Flow address
      FLOW_PRIVATE_KEY?: string;      // Flow private key
      FLOW_NETWORK?: string;          // Network, e.g., 'mainnet'
      FLOW_ENDPOINT_URL?: string;     // Endpoint URL
    };
  
    plugin_icp: {
      INTERNET_COMPUTER_PRIVATE_KEY?: string; // ICP private key
      INTERNET_COMPUTER_ADDRESS?: string; // ICP address
    };
  
    plugin_aptos: {
      APTOS_PRIVATE_KEY?: string;     // Aptos private key
      APTOS_NETWORK?: string;         // Network, e.g., 'mainnet'
    };
  
    plugin_multiversx: {
      MVX_PRIVATE_KEY?: string;       // MultiversX private key
      MVX_NETWORK?: string;           // Network, e.g., 'mainnet'
      ACCESS_TOKEN_MANAGEMENT_TO?: string; // User ID for token management
    };
  
    plugin_near: {
      NEAR_WALLET_SECRET_KEY?: string; // NEAR secret key
      NEAR_WALLET_PUBLIC_KEY?: string; // NEAR public key
      NEAR_ADDRESS?: string;          // NEAR address
      NEAR_SLIPPAGE?: number;         // Slippage
      NEAR_RPC_URL?: string;          // RPC URL
      NEAR_NETWORK?: string;          // Network, e.g., 'testnet'
    };
  
    plugin_zksync: {
      ZKSYNC_ADDRESS?: string;        // ZKsync address
      ZKSYNC_PRIVATE_KEY?: string;    // ZKsync private key
    };
  
    plugin_holdstation: {
      HOLDSTATION_PRIVATE_KEY?: string; // HoldStation private key
    };
  
    plugin_avail: {
      AVAIL_ADDRESS?: string;         // Avail address
      AVAIL_SEED?: string;            // Avail seed
      AVAIL_APP_ID?: number;          // App ID
      AVAIL_RPC_URL?: string;         // RPC URL
    };
  
    plugin_tee_marlin: {
      TEE_MARLIN?: string;            // Enable plugin
      TEE_MARLIN_ATTESTATION_ENDPOINT?: string; // Attestation endpoint
    };
  
    plugin_ton: {
      TON_PRIVATE_KEY?: string;       // Ton private key
      TON_RPC_URL?: string;           // RPC URL
      TON_RPC_API_KEY?: string;       // RPC API key
      TON_NFT_IMAGES_FOLDER?: string; // NFT images folder
      TON_NFT_METADATA_FOLDER?: string; // NFT metadata folder
      PINATA_API_KEY?: string;        // Pinata API key
      PINATA_API_SECRET?: string;     // Pinata API secret
    };
  
    plugin_sui: {
      SUI_PRIVATE_KEY?: string;       // Sui private key
      SUI_NETWORK?: string;           // Network, e.g., 'mainnet'
    };
  
    plugin_mina: {
      MINA_PRIVATE_KEY?: string;      // Mina private key
      MINA_NETWORK?: string;          // Network, e.g., 'devnet'
    };
  
    plugin_story: {
      STORY_PRIVATE_KEY?: string;     // Story private key
      STORY_API_BASE_URL?: string;    // API base URL
      STORY_API_KEY?: string;         // API key
      PINATA_JWT?: string;            // Pinata JWT
    };
  
    plugin_cosmos: {
      COSMOS_RECOVERY_PHRASE?: string; // Recovery phrase
      COSMOS_AVAILABLE_CHAINS?: string; // Comma-separated chains
    };
  
    plugin_cronoszkevm: {
      CRONOSZKEVM_ADDRESS?: string;   // Cronos zkEVM address
      CRONOSZKEVM_PRIVATE_KEY?: string; // Cronos zkEVM private key
    };
  
    plugin_fuel: {
      FUEL_WALLET_PRIVATE_KEY?: string; // Fuel wallet private key
    };
  
    plugin_spheron: {
      SPHERON_PRIVATE_KEY?: string;   // Spheron private key
      SPHERON_PROVIDER_PROXY_URL?: string; // Provider proxy URL
      SPHERON_WALLET_ADDRESS?: string; // Wallet address
    };
  
    plugin_stargaze: {
      STARGAZE_ENDPOINT?: string;     // Stargaze endpoint
    };
  
    plugin_genlayer: {
      GENLAYER_PRIVATE_KEY?: string;  // GenLayer private key
    };
  
    plugin_gelato: {
        GELATO_RELAY_API_KEY?: string;  // Gelato relay API key
    };

    plugin_bnb: {
      BNB_PRIVATE_KEY?: string;       // BNB private key
      BNB_PUBLIC_KEY?: string;        // BNB public key
      BSC_PROVIDER_URL?: string;      // BSC provider URL
      OPBNB_PROVIDER_URL?: string;    // OPBNB provider URL
    };
  
    // ####################################
    // #### Misc Plugin Configurations ####
    // ####################################
  
    plugin_web_search: {
        TAVILY_API_KEY?: string;        // Tavily API key
      };

    plugin_bitmind: {
        BITMIND?: boolean;              // Enable BitMind Bittensor API
        BITMIND_API_TOKEN?: string;     // BitMind API token
    };    
    
    plugin_devin: {
      DEVIN_API_TOKEN?: string;       // Devin API token from docs.devin.ai
    };

    plugin_intiface: {
      INTIFACE_WEBSOCKET_URL?: string; // Intiface WebSocket URL
    };
  
    plugin_giphy: {
      GIPHY_API_KEY?: string;         // Giphy API key
    };
  
    plugin_openweather: {
      OPEN_WEATHER_API_KEY?: string;  // OpenWeather API key
    };
  
    plugin_gitcoin_passport: {
      PASSPORT_API_KEY?: string;      // Gitcoin Passport key
      PASSPORT_SCORER?: string;       // Scorer number
    };
  
    plugin_echochambers: {
      ECHOCHAMBERS_API_URL?: string;  // API URL
      ECHOCHAMBERS_API_KEY?: string;  // API key
      ECHOCHAMBERS_USERNAME?: string; // Username
      ECHOCHAMBERS_ROOMS?: string;    // Comma-separated rooms
      ECHOCHAMBERS_POLL_INTERVAL?: number; // Poll interval in seconds
      ECHOCHAMBERS_MAX_MESSAGES?: number; // Max messages
      ECHOCHAMBERS_CONVERSATION_STARTER_INTERVAL?: number; // Starter interval in seconds
      ECHOCHAMBERS_QUIET_PERIOD?: number; // Quiet period in seconds
    };
  
    plugin_allora: {
      ALLORA_API_KEY?: string;        // Allora API key
      ALLORA_CHAIN_SLUG?: string;     // Chain slug, e.g., 'mainnet'
    };
  
    plugin_b2: {
      B2_PRIVATE_KEY?: string;        // B2 Network private key
    };
  
    plugin_opacity: {
      OPACITY_TEAM_ID?: string;       // Opacity team ID
      OPACITY_CLOUDFLARE_NAME?: string; // Cloudflare name
      OPACITY_PROVER_URL?: string;    // Prover URL
    };
  
    plugin_deva: {
      DEVA_API_KEY?: string;          // Deva API key
      DEVA_API_BASE_URL?: string;     // API base URL
    };
  
    plugin_deepgram: {
      DEEPGRAM_API_KEY?: string;      // Deepgram API key
    };
  
    plugin_qdrant: {
      QDRANT_URL?: string;            // Qdrant instance URL
      QDRANT_KEY?: string;            // API key
      QDRANT_PORT?: number;           // Service port
      QDRANT_VECTOR_SIZE?: number;    // Vector size
    };
  
    plugin_autonome: {
      AUTONOME_JWT_TOKEN?: string;    // JWT token
      AUTONOME_RPC?: string;          // RPC URL
    };
  
    // ####################################
    // #### Akash Network Configuration ####
    // ####################################
  
    plugin_akash: {
      AKASH_ENV?: string;             // Environment, e.g., 'mainnet'
      AKASH_NET?: string;             // Network URL
      RPC_ENDPOINT?: string;          // RPC endpoint
      AKASH_GAS_PRICES?: string;      // Gas prices
      AKASH_GAS_ADJUSTMENT?: number;  // Gas adjustment
      AKASH_KEYRING_BACKEND?: string; // Keyring backend
      AKASH_FROM?: string;            // From address
      AKASH_FEES?: string;            // Fees
      AKASH_DEPOSIT?: string;         // Deposit
      AKASH_MNEMONIC?: string;        // Mnemonic
      AKASH_WALLET_ADDRESS?: string;  // Wallet address
      AKASH_PRICING_API_URL?: string; // Pricing API URL
      AKASH_DEFAULT_CPU?: number;     // Default CPU
      AKASH_DEFAULT_MEMORY?: number;  // Default memory
      AKASH_DEFAULT_STORAGE?: number; // Default storage
      AKASH_SDL?: string;             // SDL file
      AKASH_CLOSE_DEP?: string;       // Close deployment mode
      AKASH_CLOSE_DSEQ?: string;      // DSEQ for closing
      AKASH_PROVIDER_INFO?: string;   // Provider info
      AKASH_DEP_STATUS?: string;      // Deployment status
      AKASH_DEP_DSEQ?: string;        // DSEQ for status
      AKASH_GAS_OPERATION?: string;   // Gas operation
      AKASH_GAS_DSEQ?: string;        // DSEQ for gas
      AKASH_MANIFEST_MODE?: string;   // Manifest mode
      AKASH_MANIFEST_PATH?: string;   // Manifest path
      AKASH_MANIFEST_VALIDATION_LEVEL?: string; // Validation level
    };
  
    plugin_quai: {
      QUAI_PRIVATE_KEY?: string;      // Quai private key
      QUAI_RPC_URL?: string;          // RPC URL
    };
  
    plugin_chainbase: {
      CHAINBASE_API_KEY?: string;     // Chainbase API key
    };
  
    plugin_0x: {
      ZERO_EX_API_KEY?: string;       // 0x API key
      ALCHEMY_HTTP_TRANSPORT_URL?: string; // Alchemy transport URL
    };

  
    // ####################################
    // #### Pyth Plugin Configuration ####
    // ####################################
  
    plugin_pyth_data: {
      PYTH_NETWORK_ENV?: string;      // Network environment
      PYTH_MAINNET_HERMES_URL?: string; // Mainnet Hermes URL
      PYTH_MAINNET_WSS_URL?: string;  // Mainnet WSS URL
      PYTH_MAINNET_PYTHNET_URL?: string; // Mainnet Pythnet URL
      PYTH_MAINNET_CONTRACT_REGISTRY?: string; // Mainnet contract registry
      PYTH_MAINNET_PROGRAM_KEY?: string; // Mainnet program key
      PYTH_TESTNET_HERMES_URL?: string; // Testnet Hermes URL
      PYTH_TESTNET_WSS_URL?: string;  // Testnet WSS URL
      PYTH_TESTNET_PYTHNET_URL?: string; // Testnet Pythnet URL
      PYTH_TESTNET_CONTRACT_REGISTRY?: string; // Testnet contract registry
      PYTH_TESTNET_PROGRAM_KEY?: string; // Testnet program key
      PYTH_MAX_RETRIES?: number;      // Max retries
      PYTH_RETRY_DELAY?: number;      // Retry delay in ms
      PYTH_TIMEOUT?: number;          // Timeout in ms
      PYTH_GRANULAR_LOG?: boolean;    // Granular logging
      PYTH_LOG_LEVEL?: string;        // Log level
      RUNTIME_CHECK_MODE?: boolean;   // Runtime check mode
      PYTH_ENABLE_PRICE_STREAMING?: boolean; // Enable price streaming
      PYTH_MAX_PRICE_STREAMS?: number; // Max price streams
      PYTH_TEST_ID01?: string;        // Test ID 1
      PYTH_TEST_ID02?: string;        // Test ID 2
    };
  
    plugin_router_nitro: {
      ROUTER_NITRO_EVM_ADDRESS?: string; // Router Nitro EVM address
      ROUTER_NITRO_EVM_PRIVATE_KEY?: string; // Router Nitro EVM private key
    };
  
    plugin_dkg: {
      DKG_ENVIRONMENT?: string;       // Environment
      DKG_HOSTNAME?: string;          // Hostname
      DKG_PORT?: string;              // Port
      DKG_PUBLIC_KEY?: string;        // Public key
      DKG_PRIVATE_KEY?: string;       // Private key
      DKG_BLOCKCHAIN_NAME?: string;   // Blockchain name
    };
  
    plugin_initia: {
      INITIA_PRIVATE_KEY?: string;    // Initia private key
      INITIA_NODE_URL?: string;       // Node URL
      INITIA_CHAIN_ID?: string;       // Chain ID
    };
  
    // ####################################
    // #### NVIDIA Configuration ##########
    // ####################################
  
    plugin_nvidia_nim: {
      NVIDIA_NIM_ENV?: string;        // Environment
      NVIDIA_NIM_SPASH?: boolean;     // Spash setting
      NVIDIA_NIM_API_KEY?: string;    // NIM API key
      NVIDIA_NGC_API_KEY?: string;    // NGC API key
      NVIDIA_NIM_MAX_RETRIES?: number; // Max retries
      NVIDIA_NIM_RETRY_DELAY?: number; // Retry delay
      NVIDIA_NIM_TIMEOUT?: number;    // Timeout
      NVIDIA_GRANULAR_LOG?: boolean;  // Granular logging
      NVIDIA_LOG_LEVEL?: string;      // Log level
      NVIDIA_OFFTOPIC_SYSTEM?: string; // Off-topic system
      NVIDIA_OFFTOPIC_USER?: string;  // Off-topic user
      NVIDIA_NIM_BASE_VISION_URL?: string; // Base vision URL
      NVIDIA_COSMOS_MODEL?: string;   // Cosmos model
      NVIDIA_COSMOS_INVOKE_URL?: string; // Cosmos invoke URL
      NVIDIA_COSMOS_ASSET_URL?: string; // Cosmos asset URL
      NVIDIA_COSMOS_MAX_TOKENS?: number; // Max tokens
    };
  
    plugin_email: {
      EMAIL_OUTGOING_SERVICE?: string; // Service, e.g., 'smtp', 'gmail'
      EMAIL_OUTGOING_HOST?: string;   // Outgoing host
      EMAIL_OUTGOING_PORT?: number;   // Outgoing port
      EMAIL_OUTGOING_USER?: string;   // Outgoing user
      EMAIL_OUTGOING_PASS?: string;   // Outgoing password
      EMAIL_INCOMING_SERVICE?: string; // Incoming service, e.g., 'imap'
      EMAIL_INCOMING_HOST?: string;   // Incoming host
      EMAIL_INCOMING_PORT?: number;   // Incoming port
      EMAIL_INCOMING_USER?: string;   // Incoming user
      EMAIL_INCOMING_PASS?: string;   // Incoming password
    };
  
    plugin_sei: {
      SEI_PRIVATE_KEY?: string;       // SEI private key
      SEI_NETWORK?: string;           // Network
      SEI_RPC_URL?: string;           // RPC URL
    };
  
    plugin_omniflix: {
      OMNIFLIX_API_URL?: string;      // API URL
      OMNIFLIX_MNEMONIC?: string;     // Mnemonic
      OMNIFLIX_RPC_ENDPOINT?: string; // RPC endpoint
      OMNIFLIX_PRIVATE_KEY?: string;  // Private key
    };
  
    plugin_suno: {
      SUNO_API_KEY?: string;          // Suno API key
    };
  
    plugin_udio: {
      UDIO_AUTH_TOKEN?: string;       // Udio auth token
    };
  
    plugin_football: {
      FOOTBALL_API_KEY?: string;      // Football API key
    };
  
    plugin_imgflip: {
      IMGFLIP_USERNAME?: string;      // Imgflip username
      IMGFLIP_PASSWORD?: string;      // Imgflip password
    };
  
    plugin_hyperliquid: {
      HYPERLIQUID_PRIVATE_KEY?: string; // Hyperliquid private key
      HYPERLIQUID_TESTNET?: boolean;  // Testnet flag
    };
  
    plugin_lit: {
      FUNDING_PRIVATE_KEY?: string;   // Funding private key
      EVM_RPC_URL?: string;           // EVM RPC URL
    };
  
    plugin_ethstorage: {
      ETHSTORAGE_PRIVATE_KEY?: string; // EthStorage private key
      ETHSTORAGE_ADDRESS?: string;    // EthStorage address
      ETHSTORAGE_RPC_URL?: string;    // RPC URL
    };
  
    plugin_email_automation: {
      RESEND_API_KEY?: string;        // Resend API key
      DEFAULT_TO_EMAIL?: string;      // Default recipient
      DEFAULT_FROM_EMAIL?: string;    // Default sender
      EMAIL_AUTOMATION_ENABLED?: boolean; // Enable automation
      EMAIL_EVALUATION_PROMPT?: string; // Evaluation prompt
    };
  
    plugin_ankr: {
      ANKR_ENV?: string;              // Environment
      ANKR_WALLET?: string;           // Wallet
      ANKR_MAX_RETRIES?: number;      // Max retries
      ANKR_RETRY_DELAY?: number;      // Retry delay
      ANKR_TIMEOUT?: number;          // Timeout
      ANKR_GRANULAR_LOG?: boolean;    // Granular logging
      ANKR_LOG_LEVEL?: string;        // Log level
      ANKR_RUNTIME_CHECK_MODE?: boolean; // Runtime check mode
      ANKR_SPASH?: boolean;           // Spash setting
    };
  
    plugin_dcap: {
      DCAP_EVM_PRIVATE_KEY?: string;  // EVM private key
      DCAP_MODE?: string;             // Mode
    };
  
    plugin_quick_intel: {
      QUICKINTEL_API_KEY?: string;    // QuickIntel API key
    };
  
    plugin_news: {
      NEWS_API_KEY?: string;          // News API key
    };
  
    plugin_btcfun: {
      BTCFUN_API_URL?: string;        // BTCFUN API URL
      BTC_PRIVATE_KEY_WIF?: string;   // BTC private key in WIF
      BTC_ADDRESS?: string;           // BTC address
      BTC_MINT_CAP?: number;          // Mint cap
      BTC_MINT_DEADLINE?: number;     // Mint deadline
      BTC_FUNDRAISING_CAP?: number;   // Fundraising cap
    };
  
    plugin_trikon: {
      TRIKON_WALLET_ADDRESS?: string; // Trikon wallet address
      TRIKON_INITIAL_BALANCE?: string; // Initial balance
    };
  
    plugin_arbitrage: {
      ARBITRAGE_ETHEREUM_WS_URL?: string; // Ethereum WS URL
      ARBITRAGE_EVM_PROVIDER_URL?: string; // EVM provider URL
      ARBITRAGE_EVM_PRIVATE_KEY?: string; // EVM private key
      FLASHBOTS_RELAY_SIGNING_KEY?: string; // Flashbots signing key
      BUNDLE_EXECUTOR_ADDRESS?: string; // Bundle executor address
    };
  
    plugin_desk_exchange: {
      DESK_EXCHANGE_PRIVATE_KEY?: string; // Private key
      DESK_EXCHANGE_NETWORK?: string; // Network
    };
  
    plugin_compass: {
      COMPASS_WALLET_PRIVATE_KEY?: string; // Wallet private key
      COMPASS_ARBITRUM_RPC_URL?: string; // Arbitrum RPC URL
      COMPASS_ETHEREUM_RPC_URL?: string; // Ethereum RPC URL
      COMPASS_BASE_RPC_URL?: string;  // Base RPC URL
    };
  
    'plugin_d.a.t.a': {
      DATA_API_KEY?: string;          // d.a.t.a API key
      DATA_AUTH_TOKEN?: string;       // Auth token
    };
  
    plugin_nkn: {
      NKN_CLIENT_PRIVATE_KEY?: string; // NKN client private key
      NKN_CLIENT_ID?: string;         // NKN client ID
    };
}