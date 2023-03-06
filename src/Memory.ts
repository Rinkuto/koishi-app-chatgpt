import {Config} from "./Config";

export class MemoryManager {
  private static memory: Map<string, UserMemory> = new Map();

  private static config: Config;

  public static getMemory(userId: string) {
    return this.memory.get(userId);
  }

  public static addMemory(userId: string, content: { user: string, bot: string }) {
    this.memory.get(userId).addMemory(content);
  }

  public static createMemory(userId: string, username: string) {
    if (this.memory.has(userId) === false) {
      this.memory.set(userId, new UserMemory(username, this.config.maxMemoryLength, this.config.fuzzyMemoryLength));
      for (let key in this.config.sampleDialog) {
        this.memory.get(userId).addMemory({user: key, bot: this.config.sampleDialog[key]});
      }
    }
  }

  public static setConfig(config: Config) {
    this.config = config;
  }

  public static clearMemory(userId: string) {
    this.memory.delete(userId);
  }
}


export class UserMemory {
  private memory: { user: string, bot: string }[] = [];
  private fuzzyMemory: string[] = [];
  public readonly username: string;

  private readonly maxMemoryLength: number;
  private readonly fuzzyMemoryLength: number;


  constructor(username: string, maxMemoryLength: number, fuzzyMemoryLength: number) {
    this.username = username;
    this.maxMemoryLength = maxMemoryLength;
    this.fuzzyMemoryLength = fuzzyMemoryLength;
  }

  public addMemory(content: { user: string, bot: string }) {
    if (this.memory.length >= this.maxMemoryLength) {
      this.memory.shift();
    }
    this.memory.push(content);
  }

  public addFuzzyMemory(content: string) {
    if (this.fuzzyMemory.length >= this.fuzzyMemoryLength) {
      this.fuzzyMemory.shift();
    }
    this.fuzzyMemory.push(content);
  }

  public getMessage() {
    let fuzzyMemory: string;
    if (this.fuzzyMemory.length > 0) {
      fuzzyMemory = this.fuzzyMemory.join('\n');
    } else {
      fuzzyMemory = '刚认识不久，还没说过话';
    }
    fuzzyMemory = `我记得和${this.username}说过的关键词是：\n${fuzzyMemory}`;

    let memory: string;
    if (this.memory.length > 0) {
      memory = this.memory.map(item=>{
        return `${this.username}：${item.user} 我：${item.bot}`;
      }).join('\n');
    } else {
      memory = '刚认识不久，还没聊过天';
    }
    memory = `我和${this.username}最近的聊天是：\n${memory}`;

    return {
      fuzzyMemory: fuzzyMemory,
      memory: memory,
      lastMessage: this.memory[this.memory.length - 1]
    };
  }

  public getMemory() {
    return this.memory;
  }

  public getFuzzyMemory() {
    return this.fuzzyMemory;
  }
}
