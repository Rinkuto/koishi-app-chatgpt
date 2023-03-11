import { Search } from "./Search";
export declare class BaiduSearch extends Search {
    private requestConfig;
    search(keyword: string[]): Promise<string[]>;
}
