import type { UUID, Character } from "@/types/elizaosv1";
//import { fetchUserAgent } from "./agent";
import { useAgentActiveStore, Agent } from '@/stores/agentActive';
//import { useAuthStore } from '@/stores/authStore';

//const authUser = useAuthStore.getState();
const agentActiveStore = useAgentActiveStore.getState();
const activeAgent = agentActiveStore.getAgent() as Agent;
/*const userId = authUser.getUser().id;
const agentId = agentActiveStore.getAgent().id;

if (!userId || !agentId) {
    throw new Error("User or agent ID not found");
}
const activeAgent = await fetchUserAgent(userId, agentId);
if (!activeAgent) {
    throw new Error("Agent not found");
}*/

//TODO get the api url from agent config store
const BASE_URL = activeAgent?.metadata.agentSubdomain; //`https://agent-klpvho.synapze.xyz`;

const fetcher = async ({
    url,
    method,
    body,
    headers,
}: {
    url: string;
    method?: "GET" | "POST";
    body?: object | FormData;
    headers?: HeadersInit;
}) => {
    const options: RequestInit = {
        method: method ?? "GET",
        headers: headers
            ? headers
            : {
                  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJ0ZXN0X0VnMWZWalZDcTJEYWdrZ0ZrUEtlV2t3UjMzcU5lVGhUckJqaG1EWUs2RXdSdmZ1cCIsInVzZXJpZCI6ImRpZDpwcml2eTpjbTZ4ZnV5NDcwMGY1MTE2aGlveXVkYTJkIiwiaWF0IjoxNTE2MjM5MDIyfQ.QjkYYQYoJo7Uq8WSLO68t3I_XQ3ulvVEDmR6jrAurM8`,
                  Accept: "application/json",
                  "Content-Type": "application/json",
              },
    };

    if (method === "POST") {
        if (body instanceof FormData) {
            if (options.headers && typeof options.headers === 'object') {
                // Create new headers object without Content-Type
                options.headers = Object.fromEntries(
                    Object.entries(options.headers as Record<string, string>)
                        .filter(([key]) => key !== 'Content-Type')
                );
            }
            options.body = body;
        } else {
            options.body = JSON.stringify(body);
        }
    }

    return fetch(`${BASE_URL}${url}`, options).then(async (resp) => {
        const contentType = resp.headers.get('Content-Type');
        if (contentType === "audio/mpeg") {
            return await resp.blob();
        }

        if (!resp.ok) {
            const errorText = await resp.text();
            console.error("Error: ", errorText);

            let errorMessage = "An error occurred.";
            try {
                const errorObj = JSON.parse(errorText);
                errorMessage = errorObj.message || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        return resp.json();
    });
};

export const apiClient = {
    sendMessage: (
        agentId: string,
        message: string,
        files?: File | File[] | null
    ) => {
        const formData = new FormData();
        formData.append("text", message);

        if (files) {
            const filesArray = Array.isArray(files) ? files : [files];
            filesArray.forEach((file) => {
                formData.append(`files`, file, file.name);
            });
        }
        return fetcher({
            url: `/${agentId}/message`,
            method: "POST",
            body: formData,
        });
    },
    getAgents: () => fetcher({ url: "/agents" }),
    getAgent: (agentId: string): Promise<{ id: UUID; character: Character }> =>
        fetcher({ url: `/agents/${agentId}` }),
    tts: (agentId: string, text: string) =>
        fetcher({
            url: `/${agentId}/tts`,
            method: "POST",
            body: {
                text,
            },
            headers: {
                "Content-Type": "application/json",
                Accept: "audio/mpeg",
                "Transfer-Encoding": "chunked",
            },
        }),
    whisper: async (agentId: string, audioBlob: Blob) => {
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");
        return fetcher({
            url: `/${agentId}/whisper`,
            method: "POST",
            body: formData,
        });
    },
};
