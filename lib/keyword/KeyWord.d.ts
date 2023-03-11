import { Quester } from "koishi";
import { Config } from "../Config";
export declare class KeyWord {
    protected readonly maxKeywordLength: number;
    protected readonly http: Quester;
    protected readonly config: Config;
    constructor(http: Quester, config: Config);
    getKeyWords(input: string): Promise<string>;
}
