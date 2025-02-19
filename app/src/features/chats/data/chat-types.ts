import { conversations } from './convo.json'

export type ChatUser = (typeof conversations)[number]
export type Convo = ChatUser['messages'][number]

export interface IAttachment {
    url: string;
    contentType?: string;
    title: string;
}