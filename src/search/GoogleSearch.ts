import {Search} from "./Search";
import {JSDOM} from 'jsdom';

export class GoogleSearch extends Search {

  private getProxy = () => {
    if (this.config.isProxy) {
      const url = new URL(this.config.proxyHost);
      return {
        host: url.hostname,
        port: Number(url.port),
        protocol: url.protocol,
      }
    }
  }

  async search(keyword: string[]): Promise<string[]> {
    const response = await this.http.get<Response>(
      `https://www.google.com/search?q=${keyword.join('+')}&lr=lang_zh-CN&oe=utf-8`, {
        proxy: this.getProxy()
      });
    const dom = new JSDOM(String(response)).window.document as Document;
    const main = dom.querySelector('#main');

    if (main === null) {
      return [];
    }

    const searchResult: string[] = [];
    const tobeRemoved = main.querySelectorAll('script,noscript,style,meta,button,input,img,svg,canvas,header,footer,video,audio,embed')
    tobeRemoved.forEach(item => item.remove());

    for (let item of main.children) {
      const h3 = item.querySelector('h3');
      if (h3 === null) continue;
      const p = item.querySelector('.BNeawe.s3v9rd.AP7Wnd .BNeawe.s3v9rd.AP7Wnd');
      searchResult.push(p?.textContent ?? '');
    }
    return searchResult.filter((item) => item.trim() !== '')
      .map((item) => item.trim())
      .slice(0, this.config.searchNumber);
  }
}
