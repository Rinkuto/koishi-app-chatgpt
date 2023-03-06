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
exports.name = 'chatgpt';
__exportStar(require("./Config"), exports);
const isDebug = true;
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
    if (config.isProxy) {
        if (config.isEnv) {
            process.env.HTTP_PROXY = config.proxyHost;
            process.env.HTTPS_PROXY = config.proxyHost;
        }
    }
    else {
        process.env.HTTP_PROXY = '';
        process.env.HTTPS_PROXY = '';
    }
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
        if (Memory_1.MemoryManager.getMemory(session.userId) === undefined) {
            Memory_1.MemoryManager.createMemory(session.userId, session.username);
            if (config.isLog) {
                logger.info('认识了新朋友：', session.username);
            }
        }
        const memory = Memory_1.MemoryManager.getMemory(session.userId);
        const reply = await AskChatGPT_1.AskChatGPT.askChatGPT(memory, input);
        send(replyType, reply, session).then(async () => {
            if (config.isLog) {
                logger.info(`reply ${session.username}：${reply}`);
            }
            const keyWords = await AskChatGPT_1.AskChatGPT.getLastSentenceKeyWords(memory);
            memory.addMemory({ user: input, bot: reply });
            memory.addFuzzyMemory(keyWords);
        }).catch((e) => {
            logger.error('reply error：', e);
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
        await send(getReplyType(session, config), '记忆已重置', session);
    });
}
exports.apply = apply;
const send = async (replyType, replyText, session) => {
    if (replyType === 0) {
        await session.send(replyText);
    }
    else {
        await session.send((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("at", { id: session.userId }), (0, jsx_runtime_1.jsx)("text", { content: replyText })] }));
    }
};
