"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyWord = void 0;
class KeyWord {
    constructor(http, config) {
        this.maxKeywordLength = 5;
        this.http = http;
        this.config = config;
    }
    async getKeyWords(input) {
        return '';
    }
}
exports.KeyWord = KeyWord;
