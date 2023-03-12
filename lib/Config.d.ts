import { Dict, Schema } from 'koishi';
export interface Config {
    apiKey: string;
    botName: string;
    proxyHost: string;
    isProxy: boolean;
    temperature: number;
    maxReplyTokens: number;
    maxRequestLength: number;
    sampleDialog: Dict<string, string>;
    selfIntroduction: string;
    presencePenalty: number;
    frequencyPenalty: number;
    replyRate: number;
    maxMemoryLength: number;
    isAt: boolean;
    isLog: boolean;
    isDebug: boolean;
    keyWordType: string;
    keyWordLength: number;
    secretId?: string;
    secretKey?: string;
    isUseSearch: boolean;
    searchNumber?: number;
    searchType?: string;
}
export declare const Config: Schema<Config>;
