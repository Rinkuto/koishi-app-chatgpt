"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMemory = exports.MemoryManager = void 0;
class MemoryManager {
    static getMemory(userId) {
        return this.memory.get(userId);
    }
    static addMemory(userId, content) {
        this.memory.get(userId).addMemory(content);
    }
    static createMemory(userId, username) {
        if (this.memory.has(userId) === false) {
            this.memory.set(userId, new UserMemory(username, this.config.maxMemoryLength, this.config.fuzzyMemoryLength));
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
    constructor(username, maxMemoryLength, fuzzyMemoryLength) {
        this.memory = [];
        this.fuzzyMemory = [];
        this.username = username;
        this.maxMemoryLength = maxMemoryLength;
        this.fuzzyMemoryLength = fuzzyMemoryLength;
    }
    addMemory(content) {
        if (this.memory.length >= this.maxMemoryLength) {
            this.memory.shift();
        }
        this.memory.push(content);
    }
    addFuzzyMemory(content) {
        if (this.fuzzyMemory.length >= this.fuzzyMemoryLength) {
            this.fuzzyMemory.shift();
        }
        this.fuzzyMemory.push(content);
    }
    getMessage() {
        let fuzzyMemory;
        if (this.fuzzyMemory.length > 0) {
            fuzzyMemory = this.fuzzyMemory.join('\n');
        }
        else {
            fuzzyMemory = '刚认识不久，还没说过话';
        }
        fuzzyMemory = `我记得和${this.username}说过的关键词是：\n${fuzzyMemory}`;
        let memory;
        if (this.memory.length > 0) {
            memory = this.memory.map(item => {
                return `${this.username}：${item.user} 我：${item.bot}`;
            }).join('\n');
        }
        else {
            memory = '刚认识不久，还没聊过天';
        }
        memory = `我和${this.username}最近的聊天是：\n${memory}`;
        return {
            fuzzyMemory: fuzzyMemory,
            memory: memory,
            lastMessage: this.memory[this.memory.length - 1]
        };
    }
    getMemory() {
        return this.memory;
    }
    getFuzzyMemory() {
        return this.fuzzyMemory;
    }
}
exports.UserMemory = UserMemory;
