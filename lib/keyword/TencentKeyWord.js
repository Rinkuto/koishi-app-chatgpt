"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TencentKeyWord = void 0;
const KeyWord_1 = require("./KeyWord");
const nlp_client_1 = require("tencentcloud-sdk-nodejs-nlp/tencentcloud/services/nlp/v20190408/nlp_client");
class TencentKeyWord extends KeyWord_1.KeyWord {
    constructor() {
        super(...arguments);
        this.clientConfig = {
            credential: {
                secretId: this.config.secretId,
                secretKey: this.config.secretKey,
            },
            region: "ap-guangzhou",
            profile: {
                httpProfile: {
                    endpoint: "nlp.ap-shanghai.tencentcloudapi.com",
                },
            },
        };
    }
    async getKeyWords(input) {
        const client = new nlp_client_1.Client(this.clientConfig);
        const params = {
            "Text": input,
            "Num": this.config.keyWordLength,
        };
        const result = await client.KeywordsExtraction(params);
        if (result.Keywords.length === 0) {
            return '无';
        }
        return result.Keywords
            .sort((a, b) => b.Score - a.Score)
            .map((item) => item.Word)
            .join(' ');
    }
}
exports.TencentKeyWord = TencentKeyWord;
