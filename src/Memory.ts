import {Config} from "./Config";

export class MemoryManager {
  private static memory: Map<string, UserMemory> = new Map();

  private static config: Config;

  public static getUserMemory(userId: string) {
    return this.memory.get(userId);
  }

  public static addMemory(userId: string, content: { user: string, bot: string }) {
    this.memory.get(userId).addMemory(content);
  }

  public static createMemory(userId: string, username: string) {
    if (this.memory.has(userId) === false) {
      this.memory.set(userId, new UserMemory(username, this.config.maxMemoryLength));
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
  public readonly username: string;

  private readonly maxMemoryLength: number;


  constructor(username: string, maxMemoryLength: number) {
    this.username = username;
    this.maxMemoryLength = maxMemoryLength;
  }

  public addMemory(content: { user: string, bot: string }) {
    if (this.memory.length >= this.maxMemoryLength) {
      this.memory.shift();
    }
    this.memory.push(content);
  }

  public getMemory() {
    return this.memory;
  }
}
