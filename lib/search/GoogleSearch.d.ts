import { Search } from "./Search";
export declare class GoogleSearch extends Search {
    private getProxy;
    search(keyword: string[]): Promise<string[]>;
}
