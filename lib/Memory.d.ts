import { Config } from "./Config";
export declare class MemoryManager {
    private static memory;
    private static config;
    static getMemory(userId: string): UserMemory;
    static addMemory(userId: string, content: {
        user: string;
        bot: string;
    }): void;
    static createMemory(userId: string, username: string): void;
    static setConfig(config: Config): void;
    static clearMemory(userId: string): void;
}
export declare class UserMemory {
    private memory;
    private fuzzyMemory;
    readonly username: string;
    private readonly maxMemoryLength;
    private readonly fuzzyMemoryLength;
    constructor(username: string, maxMemoryLength: number, fuzzyMemoryLength: number);
    addMemory(content: {
        user: string;
        bot: string;
    }): void;
    addFuzzyMemory(content: string): void;
    getMessage(): {
        fuzzyMemory: string;
        memory: string;
        lastMessage: {
            user: string;
            bot: string;
        };
    };
    getMemory(): {
        user: string;
        bot: string;
    }[];
    getFuzzyMemory(): string[];
}
