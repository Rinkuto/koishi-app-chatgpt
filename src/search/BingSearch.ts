import {Search} from "./Search";
import {JSDOM} from 'jsdom';

export class BingSearch extends Search {
  async search(keyword: string[]): Promise<string[]> {
    const response = await this.http.get<Response>(`https://cn.bing.com/search?q=${keyword.join('+')}`);
    const dom = new JSDOM(String(response)).window.document as Document;
    const main = dom.querySelector('#b_results');
    if (main === null) {
      return [];
    }
    const searchResult: string[] = [];
    const tobeRemoved = main.querySelectorAll('script,noscript,style,meta,button,input,img,svg,canvas,header,footer,video,audio,embed')
    tobeRemoved.forEach(item => item.remove());
    for (let item of main.children) {
      const p = item.querySelector('p');
      searchResult.push(p?.textContent ?? '');
    }
    return searchResult.filter((item) => item.trim() !== '')
      .map((item) => item.trim()
        .substring(2))
      .slice(0, this.config.searchNumber);
  }
}
