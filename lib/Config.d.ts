import { Dict, Schema } from 'koishi';
export interface Config {
    apiKey: string;
    botName: string;
    proxyHost: string;
    isProxy: boolean;
    temperature: number;
    maxTokens: number;
    isEnv: boolean;
    sampleDialog: Dict<string, string>;
    selfIntroduction: string;
    presencePenalty: number;
    frequencyPenalty: number;
    replyRate: number;
    isLog: boolean;
    maxMemoryLength: number;
    fuzzyMemoryLength: number;
}
export declare const Config: Schema<Config>;
