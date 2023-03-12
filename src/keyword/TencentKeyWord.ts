import {KeyWord} from "./KeyWord";
import {Client} from "tencentcloud-sdk-nodejs-nlp/tencentcloud/services/nlp/v20190408/nlp_client";

export class TencentKeyWord extends KeyWord {

  private readonly clientConfig = {
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

  public async getKeyWords(input: string): Promise<string> {
    const client = new Client(this.clientConfig);
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
