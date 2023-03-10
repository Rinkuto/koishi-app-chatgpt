"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.name = void 0;
const jsx_runtime_1 = require("@satorijs/element/jsx-runtime");
const koishi_1 = require("koishi");
const Memory_1 = require("./Memory");
const AskChatGPT_1 = require("./AskChatGPT");
const BingSearch_1 = require("./search/BingSearch");
const ChatGptKeyWord_1 = require("./keyword/ChatGptKeyWord");
const TencentKeyWord_1 = require("./keyword/TencentKeyWord");
const BaiduSearch_1 = require("./search/BaiduSearch");
const GoogleSearch_1 = require("./search/GoogleSearch");
exports.name = 'chatgpt';
__exportStar(require("./Config"), exports);
// 以后可以考虑加入更多的搜索引擎
const searchContent = new Map();
const keyWordsContent = new Map();
// 获取回复类型
const getReplyType = (session, config) => {
    if (session.subtype === 'private') { // 私聊
        return 0;
    }
    else {
        if (session.parsed.appel === true) { // 被@了
            return 1;
        }
        if (session.content.includes(config.botName)) { // 包含机器人名字
            return 2;
        }
        if (koishi_1.Random.bool(config.replyRate)) { // 随机回复
            return 3;
        }
        return -1;
    }
};
function apply(ctx, config) {
    const logger = ctx.logger('chatgpt');
    // write your plugin here
    Memory_1.MemoryManager.setConfig(config);
    AskChatGPT_1.AskChatGPT.setConfig(config);
    AskChatGPT_1.AskChatGPT.setHttp(ctx.http);
    initSearchContent(ctx.http, config);
    initKeyWordsContent(ctx.http, config);
    ctx.middleware(async (session, next) => {
        if (ctx.bots[session.userId]) {
            return;
        }
        const replyType = getReplyType(session, config);
        if (replyType === -1) {
            return;
        }
        const input = session.content.replace(/<[^>]*>/g, '').trim();
        if (input === '') {
            return;
        }
        if (config.isLog) {
            logger.info(`receive ${session.username} message：${input}`);
        }
        if (Memory_1.MemoryManager.getUserMemory(session.userId) === undefined) {
            Memory_1.MemoryManager.createMemory(session.userId, session.username);
            if (config.isLog) {
                logger.info('认识了新朋友：', session.username);
            }
        }
        const userMemory = Memory_1.MemoryManager.getUserMemory(session.userId);
        let messages = AskChatGPT_1.AskChatGPT.createRequestMessages(userMemory);
        if (config.isDebug) {
            logger.debug(`keyWordType：${config.keyWordType}`);
            logger.debug(`searchType：${config.searchType}`);
            logger.debug(`isUseSearch：${config.isUseSearch}`);
        }
        // 获取关键词，通过关键词搜索
        if (config.isUseSearch) {
            const keyWordUtil = keyWordsContent.get(config.keyWordType);
            const keyWords = await keyWordUtil.getKeyWords(input);
            if (config.isLog) {
                logger.info(`keyWords：${keyWords}`);
            }
            if (keyWords.trim() !== undefined && keyWords.trim() !== '' && keyWords.trim()[0] !== '无') {
                const Search = searchContent.get(config.searchType);
                const search = await Search.search(keyWords.trim().split(' '));
                if (config.isDebug) {
                    logger.debug(`search：${search}`);
                }
                if (search !== undefined && search.length > 0) {
                    messages = AskChatGPT_1.AskChatGPT.createRequestMessages(userMemory, search);
                }
            }
        }
        // 将用户输入添加到消息队列
        messages.push(AskChatGPT_1.AskChatGPT.setUserPrompt(input, userMemory.username));
        // 回复
        AskChatGPT_1.AskChatGPT.askChatGPT(messages).then(reply => {
            send(replyType, reply, session, config).then(async () => {
                if (config.isLog) {
                    logger.info(`reply ${session.username}：${reply}`);
                }
                userMemory.addMemory({ user: input, bot: reply });
            }).catch((e) => {
                logger.error('reply error：', e);
            });
        }).catch((e) => {
            logger.error(e);
            if (e.errno === -4039) {
                send(replyType, '请求失败，请稍后再试\nerror code: connect ETIMEDOUT', session, config);
            }
            else {
                send(replyType, `请求失败，请稍后再试\nerror code: ${e.response.status}`, session, config);
            }
        });
        return await next();
    });
    ctx.command('reset', '删除关于你的记忆')
        .alias('重置')
        .action(async ({ session }) => {
        Memory_1.MemoryManager.clearMemory(session.userId);
        if (config.isLog) {
            logger.info('reset memory:', session.username, '');
        }
        await send(getReplyType(session, config), '记忆已重置', session, config);
    });
    ctx.command('balance', '查询余额')
        .alias('余额')
        .action(async ({ session }) => {
        const balance = await AskChatGPT_1.AskChatGPT.getBalance();
        await send(getReplyType(session, config), `余额：$${balance.total_used.toFixed(2)} / $${balance.total_granted.toFixed(2)}\n已用 ${(balance.total_used / balance.total_granted * 100).toFixed(2)}%`, session, config);
    });
}
exports.apply = apply;
const send = async (replyType, replyText, session, config) => {
    if (replyType === 0 || config.isAt === false) {
        await session.send(replyText).then(res => {
            if (res.length === 0) {
                send(replyType, '回复失败', session, config);
            }
        });
    }
    else {
        await session.send((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("at", { id: session.userId }), (0, jsx_runtime_1.jsx)("text", { content: replyText })] })).then(res => {
            if (res.length === 0) {
                send(replyType, '回复失败', session, config);
            }
        });
    }
};
const initSearchContent = (http, config) => {
    searchContent.set('bing', new BingSearch_1.BingSearch(http, config));
    searchContent.set('baidu', new BaiduSearch_1.BaiduSearch(http, config));
    searchContent.set('google', new GoogleSearch_1.GoogleSearch(http, config));
};
const initKeyWordsContent = (http, config) => {
    keyWordsContent.set('chatgpt', new ChatGptKeyWord_1.ChatGptKeyWord(http, config));
    keyWordsContent.set('tencent', new TencentKeyWord_1.TencentKeyWord(http, config));
};
