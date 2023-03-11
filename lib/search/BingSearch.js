"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingSearch = void 0;
const Search_1 = require("./Search");
const jsdom_1 = require("jsdom");
class BingSearch extends Search_1.Search {
    async search(keyword) {
        const response = await this.http.get(`https://cn.bing.com/search?q=${keyword.join('+')}`);
        const dom = new jsdom_1.JSDOM(String(response)).window.document;
        const main = dom.querySelector('#b_results');
        if (main === null) {
            return [];
        }
        const searchResult = [];
        const tobeRemoved = main.querySelectorAll('script,noscript,style,meta,button,input,img,svg,canvas,header,footer,video,audio,embed');
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
exports.BingSearch = BingSearch;
