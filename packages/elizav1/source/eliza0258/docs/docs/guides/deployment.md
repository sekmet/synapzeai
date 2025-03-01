# Deployment


---

## FAQ

### How do I run Eliza in production?
Deploy using Docker containers on a VPS with PM2 for process management. Avoid serverless platforms and consider residential IPs for Twitter bots.

### How do I run multiple agents?
Create separate projects or Docker containers for each agent with unique configurations and credentials.

### What are the resource requirements?
Minimum 2GB RAM for basic setup, 4GB recommended for multiple agents. CUDA optional unless using local LLMs.
