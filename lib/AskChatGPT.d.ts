import { Config } from "./Config";
import { UserMemory } from "./Memory";
export declare class AskChatGPT {
    private static config;
    private static openai;
    private static getOpenAI;
    static askChatGPT(userMemory: UserMemory, input: string): Promise<string>;
    static getLastSentenceKeyWords(userMemory: UserMemory): Promise<string>;
    private static getCompletion;
    private static getAxiosConfig;
    static setConfig(config: Config): void;
}
