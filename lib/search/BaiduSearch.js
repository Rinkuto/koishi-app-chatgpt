"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiduSearch = void 0;
const Search_1 = require("./Search");
const jsdom_1 = require("jsdom");
class BaiduSearch extends Search_1.Search {
    constructor() {
        super(...arguments);
        this.requestConfig = (keyword) => {
            return {
                params: {
                    wd: keyword.join(' ')
                },
                headers: {
                    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
                    'Referer': "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=2&ch=&tn=baiduhome_pg&bar=&wd=123&oq=123&rsv_pq=896f886f000184f4&rsv_t=fdd2CqgBgjaepxfhicpCfrqeWVSXu9DOQY5WyyWqQYmsKOC%2Fl286S248elzxl%2BJhOKe2&rqlang=cn",
                    'Accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    'Accept-Language': "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                    'Sec-Fetch-Mode': "navigate",
                    'Connection': "Keep-Alive"
                }
            };
        };
    }
    async search(keyword) {
        const response = await this.http.get('http://www.baidu.com/s', this.requestConfig(keyword));
        const dom = new jsdom_1.JSDOM(String(response)).window.document;
        const main = dom.querySelector('#content_left');
        if (main === null) {
            return [];
        }
        const searchResult = [];
        const tobeRemoved = main.querySelectorAll('script,noscript,style,meta,button,input,img,svg,canvas,header,footer,video,audio,embed');
        tobeRemoved.forEach(item => item.remove());
        for (let item of main.children) {
            const p = item.querySelector('.content-right_8Zs40');
            searchResult.push(p?.textContent ?? '');
        }
        return searchResult.filter((item) => item.trim() !== '')
            .map(item => item.trim())
            .slice(0, this.config.searchNumber);
    }
}
exports.BaiduSearch = BaiduSearch;
