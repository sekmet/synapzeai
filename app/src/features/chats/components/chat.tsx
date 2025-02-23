import ElizaOsIcon from "@/assets/elizaos-icon.png";
import { Button } from "@/components/ui/button";
import {
    ChatBubble,
    ChatBubbleMessage,
    ChatBubbleTimestamp,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Paperclip, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Content, UUID } from "@/types/elizaosv1";
import { useMutation, useQueryClient } from "@tanstack/react-query";
//import { apiClient } from "@/lib/api/client-api";
import ApiClient from "@/lib/api/secure-client-api";
import { useAuthStore } from '@/stores/authStore';
import { cn, moment } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import CopyButton from "./copy-button";
import ChatTtsButton from "@/components/ui/chat/chat-tts-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import AIWriter from "react-aiwriter";
import type { IAttachment } from "../data/chat-types";
import { AudioRecorder } from "./audio-recorder";
import { Badge } from "@/components/ui/badge";
import { useAutoScroll } from "@/components/ui/chat/hooks/useAutoScroll";
import { useAgentActiveStore } from "@/stores/agentActive";

type ExtraContentFields = {
    user: string;
    createdAt: number;
    isLoading?: boolean;
};

type ContentWithUser = Content & ExtraContentFields;

export function AgentChat({ agentId }: { agentId: UUID }) {
    const { toast } = useToast();
    const authUser = useAuthStore.getState();
    const [apiClient, setApiClient] = useState<ApiClient | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const { getAgent, setAgent } = useAgentActiveStore((state: any) => state)
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const userId = authUser.getUser()?.id as UUID;
    const apiKey = authUser.getApiKey() as string;

    if (!userId || !apiKey) {
        throw new Error("User or API key not found");
    }

    const queryClient = useQueryClient();

    const getMessageVariant = (role: string) =>
        role !== "user" ? "received" : "sent";

    const { scrollRef, isAtBottom, scrollToBottom, disableAutoScroll } = useAutoScroll({
        smooth: true,
    })

    const messages = queryClient.getQueryData<ContentWithUser[]>(["messages", agentId]) || [];

    useEffect(() => {
        const createApiClient = async () => {
            try {
                const client = await ApiClient.create(agentId, userId, apiKey);
                setApiClient(client);
            } catch (error) {
                console.error("Failed to create ApiClient:", error);
            }
        };
        if (agentId === undefined) {
            setAgent(getAgent())
        } else {
            createApiClient();
        }

    }, [agentId, userId, apiKey]); // Dependencies: re-run if these change


    useEffect(() => {
        scrollToBottom();
    }, [queryClient.getQueryData(["messages", agentId])]);

    useEffect(() => {
        scrollToBottom();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (e.nativeEvent.isComposing) return;
            handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
        }
    };

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input) return;

        const attachments: IAttachment[] | undefined = selectedFiles
            ? selectedFiles.map(file => ({
                url: URL.createObjectURL(file),
                contentType: file.type,
                title: file.name
            }))
            : undefined;

        const newMessages = [
            {
                text: input,
                user: "user",
                createdAt: Date.now(),
                attachments,
            },
            {
                text: input,
                user: "system",
                isLoading: true,
                createdAt: Date.now(),
            },
        ];

        queryClient.setQueryData(
            ["messages", agentId],
            (old: ContentWithUser[] = []) => [...old, ...newMessages]
        );

        sendMessageMutation.mutate({
            message: input,
            selectedFiles: selectedFiles.length > 0 ? selectedFiles : null,
        });

        setSelectedFiles([]);
        setInput("");
        formRef.current?.reset();
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const sendMessageMutation = useMutation({
        mutationKey: ["send_message", agentId],
        mutationFn: ({
            message,
            selectedFiles,
        }: {
            message: string;
            selectedFiles?: File[] | null;
        }) => apiClient?.sendMessage(message, selectedFiles) as Promise<ContentWithUser[]>,
        onSuccess: (newMessages: ContentWithUser[]) => {
            queryClient.setQueryData(
                ["messages", agentId],
                (old: ContentWithUser[] = []) => [
                    ...old.filter((msg) => !msg.isLoading),
                    ...newMessages.map((msg) => ({
                        ...msg,
                        createdAt: Date.now(),
                    })),
                ]
            );
        },
        onError: (e) => {
            toast({
                variant: "destructive",
                title: "Unable to send message",
                description: e.message,
            });
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    return (
        <div className="flex flex-col w-full h-[calc(100dvh)] p-2">
            <div className="flex-1 overflow-y-auto">
                <ChatMessageList
                    scrollRef={scrollRef}
                    isAtBottom={isAtBottom}
                    scrollToBottom={scrollToBottom}
                    disableAutoScroll={disableAutoScroll}
                >
                    {messages.map((message) => (
                        <div
                                key={`${message.createdAt}-${message.user}-${message.text}`}
                                style={{
                                    //...style,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                    padding: "1rem",
                                }}
                            >
                                <ChatBubble
                                    variant={getMessageVariant(message?.user)}
                                    className="flex flex-row items-center gap-2"
                                >
                                    {message?.user !== "user" ? (
                                        <Avatar className="size-8 p-1 border rounded-full select-none">
                                            <AvatarImage src={ElizaOsIcon} />
                                        </Avatar>
                                    ) : null}
                                    <div className="flex flex-col">
                                        <ChatBubbleMessage
                                            isLoading={message?.isLoading}
                                        >
                                            {message?.user !== "user" ? (
                                                <AIWriter>
                                                    {message?.text}
                                                </AIWriter>
                                            ) : (
                                                message?.text
                                            )}
                                            {/* Attachments */}
                                            <div>
                                                {message?.attachments?.map(
                                                    (attachment: IAttachment) => (
                                                        <div
                                                            className="flex flex-col gap-1 mt-2"
                                                            key={`${attachment.url}-${attachment.title}`}
                                                        >
                                                            <img
                                                                alt="attachment"
                                                                src={attachment.url}
                                                                width="100%"
                                                                height="100%"
                                                                className="w-64 rounded-md"
                                                            />
                                                            <div className="flex items-center justify-between gap-4">
                                                                <span />
                                                                <span />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </ChatBubbleMessage>
                                        <div className="flex items-center gap-4 justify-between w-full mt-1">
                                            {message?.text &&
                                            !message?.isLoading ? (
                                                <div className="flex items-center gap-1">
                                                    <CopyButton
                                                        text={message?.text}
                                                    />
                                                    <ChatTtsButton
                                                        agentId={agentId}
                                                        text={message?.text}
                                                    />
                                                </div>
                                            ) : null}
                                            <div
                                                className={cn([
                                                    message?.isLoading
                                                        ? "mt-2"
                                                        : "",
                                                    "flex items-center justify-between gap-4 select-none",
                                                ])}
                                            >
                                                {message?.source ? (
                                                    <Badge variant="outline">
                                                        {message.source}
                                                    </Badge>
                                                ) : null}
                                                {message?.action ? (
                                                    <Badge variant="outline">
                                                        {message.action}
                                                    </Badge>
                                                ) : null}
                                                {message?.createdAt ? (
                                                    <ChatBubbleTimestamp
                                                        timestamp={moment(
                                                            message?.createdAt
                                                        ).format("LT")}
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </ChatBubble>
                            </div>
                        ))
                    }
                </ChatMessageList>
            </div>
            <div className="px-1 pb-2">
                <form
                    ref={formRef}
                    onSubmit={handleSendMessage}
                    className="relative rounded-md border bg-card"
                >
                    {selectedFiles.length > 0 ? (
                        <div className="p-3 flex flex-wrap gap-2">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="relative rounded-md border p-2">
                                    <Button
                                        onClick={() => setSelectedFiles(selectedFiles.filter((f) => f !== file))}
                                        className="absolute -right-2 -top-2 size-[22px] ring-2 ring-background"
                                        variant="outline"
                                        size="icon"
                                    >
                                        <X />
                                    </Button>
                                    <img
                                        alt="Selected file"
                                        src={URL.createObjectURL(file)}
                                        height="100%"
                                        width="100%"
                                        className="aspect-square object-contain w-16"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : null}
                    <ChatInput
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                        value={input}
                        onChange={({ target }) => setInput(target.value)}
                        placeholder="Type your message here..."
                        className="min-h-12 resize-none rounded-md bg-card border-0 p-3 shadow-none focus-visible:ring-0"
                        disabled={sendMessageMutation?.isPending}
                    />
                    <div className="flex items-center p-3 pt-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={sendMessageMutation?.isPending}
                                        onClick={() => {
                                            if (fileInputRef.current) {
                                                fileInputRef.current.click();
                                            }
                                        }}
                                    >
                                        <Paperclip className="size-4" />
                                        <span className="sr-only">
                                            Attach file
                                        </span>
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*,video/*,audio/*"
                                        multiple
                                        className="hidden"
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>Attach file</p>
                            </TooltipContent>
                        </Tooltip>
                        <AudioRecorder
                            disabled={sendMessageMutation?.isPending}
                            agentId={agentId}
                            onChange={(newInput: string) => setInput(newInput)}
                        />
                        <Button
                            disabled={!input || sendMessageMutation?.isPending}
                            type="submit"
                            size="sm"
                            className="ml-auto gap-1.5 h-[30px] bg-orange-500 px-6 text-white hover:bg-orange-600"
                        >
                            {sendMessageMutation?.isPending
                                ? "..."
                                : "Send Message"}
                            <Send className="size-3.5" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
