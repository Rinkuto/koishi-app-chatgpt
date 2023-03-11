import { Config } from "./Config";
import { ChatCompletionRequestMessage, CreateChatCompletionRequest, OpenAIApi } from 'openai';
import { UserMemory } from "./Memory";
import { Quester } from "koishi";
export declare class AskChatGPT {
    private static config;
    private static openai;
    private static http;
    static getOpenAI(): OpenAIApi;
    static askChatGPT(requestMessage: ChatCompletionRequestMessage[]): Promise<string>;
    static getKeyWords(input: string): Promise<void>;
    static getCompletion(messages: ChatCompletionRequestMessage[]): CreateChatCompletionRequest;
    static getAxiosConfig(): {
        proxy: {
            host: string;
            port: number;
            protocol: string;
        };
        headers: {
            Authorization: string;
        };
    };
    static getBalance(): Promise<Balance>;
    static createRequestMessages(memory: UserMemory, search?: string[]): ChatCompletionRequestMessage[];
    private static setSystemPrompt;
    private static setBotPrompt;
    static setUserPrompt(content: string, username: string): ChatCompletionRequestMessage;
    static setConfig(config: Config): void;
    static setHttp(http: Quester): void;
}
export interface Balance {
    total_used: number;
    total_granted: number;
    total_available: number;
}
