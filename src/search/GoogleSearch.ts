import {Search} from "./Search";

export class GoogleSearch extends Search {
  async search(keyword: string[]): Promise<string[]> {
    return super.search(keyword);
  }
}
