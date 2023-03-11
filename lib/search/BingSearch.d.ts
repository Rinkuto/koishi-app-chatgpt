import { Search } from "./Search";
export declare class BingSearch extends Search {
    search(keyword: string[]): Promise<string[]>;
}
