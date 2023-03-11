import { KeyWord } from "./KeyWord";
export declare class TencentKeyWord extends KeyWord {
    private readonly clientConfig;
    getKeyWords(input: string): Promise<string>;
}
