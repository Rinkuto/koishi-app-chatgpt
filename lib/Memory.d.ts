import { Config } from "./Config";
export declare class MemoryManager {
    private static memory;
    private static config;
    static getUserMemory(userId: string): UserMemory;
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
    readonly username: string;
    private readonly maxMemoryLength;
    constructor(username: string, maxMemoryLength: number);
    addMemory(content: {
        user: string;
        bot: string;
    }): void;
    getMemory(): {
        user: string;
        bot: string;
    }[];
}
