import { Agent } from '@/stores/agentActive';
import { useAgentStore } from '@/stores/agentStore';
import { UUID } from '@/types/elizaosv1';

class ApiClient {
    private baseUrl: string;
    private agentId: string;
    private token: string;

    /**
     * Private constructor to initialize the ApiClient with an agent and a signed token.
     * @param agent The agent object containing metadata and organization details.
     * @param token The signed JWT token obtained from the server.
     */
    private constructor(agent: Agent, token: string) {
        this.baseUrl = agent.metadata.agentSubdomain; // e.g., "https://agent-p4fyff.synapze.xyz"
        this.agentId = agent.metadata.agentClientId;  // e.g., "3950d40f-ebba-01ee-8df4-f3e54499650c"
        this.token = token;
    }

    /**
     * Static factory method to create an ApiClient instance asynchronously.
     * Fetches agent data using agentId, validates parameters, fetches a signed JWT token,
     * and returns a new instance.
     * @param agentId The UUID of the agent to load.
     * @param userid The user ID to include in the JWT payload.
     * @param apikey The API key to include in the JWT payload.
     * @returns A Promise resolving to an ApiClient instance.
     * @throws Error if agent is not found, validation fails, or token fetching fails.
     */
    static async create(agentId: UUID, userid: string, apikey: string): Promise<ApiClient> {
        // Retrieve agent data using getAgentById from useAgentStore
        const agent = useAgentStore.getState().getAgentById(agentId);

        // Check if agent exists
        if (!agent) {
            throw new Error(`Agent with ID ${agentId} not found`);
        }

        // Validate input parameters
        if (!userid || typeof userid !== 'string') {
            throw new Error('Invalid userid: must be a non-empty string');
        }
        if (!apikey || typeof apikey !== 'string') {
            throw new Error('Invalid apikey: must be a non-empty string');
        }
        const organizationId = agent.organization_id;
        if (!organizationId || typeof organizationId !== 'string') {
            throw new Error('Invalid organizationId: must be a non-empty string');
        }

        // Construct JWT payload
        const payload = {
            apikey,
            userid,
            iat: Math.floor(Date.now() / 1000), // Issued-at timestamp in seconds
        };

        // Fetch signed JWT token from the server
        const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/jwt/${organizationId}/sign`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to sign JWT: ${response.statusText}`);
        }

        const { result } = await response.json(); // Assuming response is { token: "signed-jwt-token" }
        if (!result) {
            throw new Error('No token received from the server');
        }

        // Return a new ApiClient instance with the retrieved agent and token
        return new ApiClient(agent, result);
    }

    /**
     * Private method to handle HTTP requests with the signed token.
     * @param param0 Options including url, method, body, and optional headers.
     * @returns The response data (JSON or Blob based on Content-Type).
     * @throws Error if the request fails.
     */
    private async _fetch({
        url,
        method = 'GET',
        body,
        headers = {},
    }: {
        url: string;
        method?: 'GET' | 'POST';
        body?: object | FormData;
        headers?: Record<string, string>;
    }) {

        const defaultHeaders = {
            Authorization: `Bearer ${this.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        };

        let requestHeaders: Record<string, string> = {
            ...defaultHeaders,
            ...headers,
        };

        const options: RequestInit = {
            method,
            headers: requestHeaders,
        };

        if (method === 'POST') {
            if (body instanceof FormData) {
                delete requestHeaders['Content-Type']; // Let browser set multipart/form-data
                options.body = body;
            } else {
                requestHeaders['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
            }
        }

        const response = await fetch(`${this.baseUrl}${url}`, options);
        const contentType = response.headers.get('Content-Type');

        if (contentType?.includes('audio/mpeg')) {
            return response.blob();
        }

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'An error occurred during the request';
            try {
                const errorObj = JSON.parse(errorText);
                errorMessage = errorObj.message || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        return response.json();
    }

    /**
     * Sends a message to the agent with optional files.
     * @param message The text message to send.
     * @param files Optional file or array of files to send.
     * @returns The server response.
     */
    public sendMessage(message: string, files?: File | File[] | null) {
        const formData = new FormData();
        formData.append('text', message);

        if (files) {
            const filesArray = Array.isArray(files) ? files : [files];
            filesArray.forEach((file) => {
                formData.append('files', file, file.name);
            });
        }

        return this._fetch({
            url: `/${this.agentId}/message`,
            method: 'POST',
            body: formData,
        });
    }

    /**
     * Fetches the list of all agents.
     * @returns The list of agents.
     */
    public async getAgents() {
        return this._fetch({ url: '/agents' });
    }

    /**
     * Fetches details of a specific agent by its ID.
     * @param agentId The ID of the agent to fetch.
     * @returns The agent details.
     */
    public getAgent(agentId: string): Promise<{ id: string; character: any }> {
        return this._fetch({ url: `/agents/${agentId}` });
    }

    /**
     * Converts text to speech using the agent's TTS endpoint.
     * @param text The text to convert to speech.
     * @returns An audio Blob containing the speech.
     */
    public tts(text: string) {
        return this._fetch({
            url: `/${this.agentId}/tts`,
            method: 'POST',
            body: { text },
            headers: {
                'Content-Type': 'application/json',
                Accept: 'audio/mpeg',
                'Transfer-Encoding': 'chunked',
            },
        });
    }

    /**
     * Transcribes an audio blob using the agent's whisper endpoint.
     * @param audioBlob The audio data to transcribe.
     * @returns The transcription result.
     */
    public whisper(audioBlob: Blob) {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');

        return this._fetch({
            url: `/${this.agentId}/whisper`,
            method: 'POST',
            body: formData,
        });
    }
}

export default ApiClient;