import { Search } from "./Search";
export declare class GoogleSearch extends Search {
    search(keyword: string[]): Promise<string[]>;
}
