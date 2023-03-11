import {Config} from "../Config";
import {Quester} from "koishi";

export class Search {
  protected readonly config: Config;
  protected readonly http: Quester;

  constructor(http: Quester, config: Config) {
    this.http = http;
    this.config = config;
  }

  public async search(keyword: string[]): Promise<string[]> {
    return [];
  }
}
