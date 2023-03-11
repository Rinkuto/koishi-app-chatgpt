"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMemory = exports.MemoryManager = void 0;
class MemoryManager {
    static getUserMemory(userId) {
        return this.memory.get(userId);
    }
    static addMemory(userId, content) {
        this.memory.get(userId).addMemory(content);
    }
    static createMemory(userId, username) {
        if (this.memory.has(userId) === false) {
            this.memory.set(userId, new UserMemory(username, this.config.maxMemoryLength));
            for (let key in this.config.sampleDialog) {
                this.memory.get(userId).addMemory({ user: key, bot: this.config.sampleDialog[key] });
            }
        }
    }
    static setConfig(config) {
        this.config = config;
    }
    static clearMemory(userId) {
        this.memory.delete(userId);
    }
}
exports.MemoryManager = MemoryManager;
MemoryManager.memory = new Map();
class UserMemory {
    constructor(username, maxMemoryLength) {
        this.memory = [];
        this.username = username;
        this.maxMemoryLength = maxMemoryLength;
    }
    addMemory(content) {
        if (this.memory.length >= this.maxMemoryLength) {
            this.memory.shift();
        }
        this.memory.push(content);
    }
    getMemory() {
        return this.memory;
    }
}
exports.UserMemory = UserMemory;
