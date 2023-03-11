"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSearch = void 0;
const Search_1 = require("./Search");
class GoogleSearch extends Search_1.Search {
    async search(keyword) {
        return super.search(keyword);
    }
}
exports.GoogleSearch = GoogleSearch;
