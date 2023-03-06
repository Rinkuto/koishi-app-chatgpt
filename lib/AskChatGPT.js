"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskChatGPT = void 0;
const openai_1 = require("openai");
const model = 'gpt-3.5-turbo';
class AskChatGPT {
    static getOpenAI() {
        if (this.openai === undefined) {
            const configuration = new openai_1.Configuration({
                apiKey: this.config.apiKey,
            });
            this.openai = new openai_1.OpenAIApi(configuration);
        }
        return this.openai;
    }
    static async askChatGPT(userMemory, input) {
        const message = userMemory.getMessage();
        const chatCompletionRequestMessage = [{
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
        const completion = await this.getOpenAI().createChatCompletion(this.getCompletion(chatCompletionRequestMessage), this.getAxiosConfig());
        return completion.data.choices[0].message.content;
    }
    static async getLastSentenceKeyWords(userMemory) {
        const message = userMemory.getMessage();
        const chatCompletionRequestMessage = [{
                role: 'user',
                content: `我的名字是${this.config.botName}，我的主人是${userMemory.username}，这是我的自我介绍：${this.config.selfIntroduction}`
            }, {
                role: 'user',
                content: `${userMemory.username}：${message.lastMessage.user} 我：${message.lastMessage.bot}
                用一句话总结我与${userMemory.username}的对话，并且找出上一句话的三个关键词，格式：太阳、星星、月亮，不要换行`
            }];
        const completion = await this.getOpenAI().createChatCompletion(this.getCompletion(chatCompletionRequestMessage), this.getAxiosConfig());
        return completion.data.choices[0].message.content;
    }
    static getCompletion(message) {
        return {
            model: model,
            messages: message,
            temperature: this.config.temperature,
            max_tokens: this.config.maxTokens,
            presence_penalty: this.config.presencePenalty,
            frequency_penalty: this.config.frequencyPenalty,
        };
    }
    static getAxiosConfig() {
        const url = new URL(this.config.proxyHost);
        if (this.config.isProxy && !this.config.isEnv) {
            return {
                proxy: {
                    host: url.hostname,
                    port: Number(url.port),
                    protocol: url.protocol.substring(0, url.protocol.length - 1),
                }
            };
        }
    }
    static setConfig(config) {
        this.config = config;
    }
}
exports.AskChatGPT = AskChatGPT;
