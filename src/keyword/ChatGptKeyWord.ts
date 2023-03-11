import {KeyWord} from "./KeyWord";
import {ChatCompletionRequestMessage} from "openai";
import {AskChatGPT} from "../AskChatGPT";

export class ChatGptKeyWord extends KeyWord {
  public async getKeyWords(input: string): Promise<string> {
    const chatCompletionRequestMessage: ChatCompletionRequestMessage[] = [];
    chatCompletionRequestMessage.push({
      role: 'system', content:
        `请找出最少一个关键词，最多四个关键词，请直接回复关键词，不要加任何东西
      如果没有关键词，请直接回复无，不要加任何句子。
      例如：学习书法，就选唐颜真卿《颜勤礼碑》原碑与对临「第1节」。回复 颜勤礼碑 颜勤礼碑 书法
      例如：你好 回复 无`
    });

    chatCompletionRequestMessage.push(AskChatGPT.setUserPrompt(input, ''));

    const completion = await AskChatGPT.getOpenAI().createChatCompletion(
      AskChatGPT.getCompletion(chatCompletionRequestMessage), AskChatGPT.getAxiosConfig()
    );

    const keywords = completion.data.choices[0].message.content.split(' ');
    return keywords.slice(0, this.config.keyWordLength).join(' ');
  }
}
