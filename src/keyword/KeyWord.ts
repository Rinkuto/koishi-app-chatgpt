import {Quester} from "koishi";
import {Config} from "../Config";

export class KeyWord {
  protected readonly maxKeywordLength: number = 5;
  protected readonly http: Quester;
  protected readonly config: Config;

  constructor(http: Quester, config: Config) {
    this.http = http;
    this.config = config;
  }

  public async getKeyWords(input: string): Promise<string> {
    return '';
  }
}
