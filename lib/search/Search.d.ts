import { Config } from "../Config";
import { Quester } from "koishi";
export declare class Search {
    protected readonly config: Config;
    protected readonly http: Quester;
    constructor(http: Quester, config: Config);
    search(keyword: string[]): Promise<string[]>;
}
