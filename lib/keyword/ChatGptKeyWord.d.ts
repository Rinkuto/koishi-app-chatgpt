import { KeyWord } from "./KeyWord";
export declare class ChatGptKeyWord extends KeyWord {
    getKeyWords(input: string): Promise<string>;
}
