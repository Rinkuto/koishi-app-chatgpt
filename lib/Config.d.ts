import { Dict, Schema } from 'koishi';
export interface Config {
    apiKey: string;
    botName: string;
    proxyHost: string;
    isProxy: boolean;
    temperature: number;
    maxTokens: number;
    sampleDialog: Dict<string, string>;
    selfIntroduction: string;
    presencePenalty: number;
    frequencyPenalty: number;
    replyRate: number;
    isLog: boolean;
    maxMemoryLength: number;
    keyWordType: string;
    keyWordLength: number;
    keyWordKey: {
        secretId: string;
        secretKey: string;
    };
    isUseSearch: boolean;
    searchNumber: number;
    searchType: string;
}
export declare const Config: Schema<Config>;
