import {Config} from "./Config";
import {Configuration, OpenAIApi, ChatCompletionRequestMessage, CreateChatCompletionRequest} from 'openai';
import {UserMemory} from "./Memory";
import {AxiosRequestConfig} from "axios";

const model = 'gpt-3.5-turbo';

export class AskChatGPT {

  private static config: Config;


  private static openai: OpenAIApi;

  private static getOpenAI() {
    if (this.openai === undefined) {
      const configuration = new Configuration({
        apiKey: this.config.apiKey,
      });
      this.openai = new OpenAIApi(configuration);
    }
    return this.openai;
  }

  public static async askChatGPT(userMemory: UserMemory, input: string) {
    const message = userMemory.getMessage();
    const chatCompletionRequestMessage: ChatCompletionRequestMessage[] = [{
      role: 'user',
      content: `我的名字是${this.config.botName}，我的主人是${userMemory.username}，这是我的自我介绍：${this.config.selfIntroduction}`
    }, {
      role: 'user',
      content: `${message.memory}`
    }, {
      role: 'user',
      content: `${message.fuzzyMemory}`
    }, {
      role: 'user',
      content: `${userMemory.username}：${input} 我：\n`
    }];

    const completion = await this.getOpenAI().createChatCompletion(
      this.getCompletion(chatCompletionRequestMessage), this.getAxiosConfig()
    );

    return completion.data.choices[0].message.content;
  }

  public static async getLastSentenceKeyWords(userMemory: UserMemory) {
    const message = userMemory.getMessage();
    const chatCompletionRequestMessage: ChatCompletionRequestMessage[] = [{
      role: 'user',
      content: `我的名字是${this.config.botName}，我的主人是${userMemory.username}，这是我的自我介绍：${this.config.selfIntroduction}`
    }, {
      role: 'user',
      content: `${userMemory.username}：${message.lastMessage.user} 我：${message.lastMessage.bot}
                用一句话总结我与${userMemory.username}的对话，并且找出上一句话的三个关键词，格式：太阳、星星、月亮，不要换行`
    }];

    const completion = await this.getOpenAI().createChatCompletion(
      this.getCompletion(chatCompletionRequestMessage), this.getAxiosConfig()
    );

    return completion.data.choices[0].message.content;
  }

  private static getCompletion(message: ChatCompletionRequestMessage[]): CreateChatCompletionRequest {
    return {
      model: model,
      messages: message,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      presence_penalty: this.config.presencePenalty,
      frequency_penalty: this.config.frequencyPenalty,
    }
  }

  private static getAxiosConfig() {
    const url = new URL(this.config.proxyHost);
    if (this.config.isProxy && !this.config.isEnv) {
      return {
        proxy: {
          host: url.hostname,
          port: Number(url.port),
          protocol: url.protocol.substring(0, url.protocol.length - 1),
        }
      }
    }
  }

  public static setConfig(config: Config) {
    this.config = config;
  }
}
