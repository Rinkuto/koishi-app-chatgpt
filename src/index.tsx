import {Context, Random, Schema, Session} from 'koishi'
import {Config} from './Config'
import {MemoryManager} from "./Memory";
import {AskChatGPT} from "./AskChatGPT";

export const name = 'chatgpt'
export * from './Config'

const isDebug = true;

// 获取回复类型
const getReplyType = (session: Session, config: Config) => {
  if (session.subtype === 'private') {      // 私聊
    return 0;
  } else {
    if (session.parsed.appel === true) { // 被@了
      return 1;
    }
    if (session.content.includes(config.botName)) { // 包含机器人名字
      return 2;
    }

    if (Random.bool(config.replyRate)) { // 随机回复
      return 3
    }
    return -1;
  }
}

export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('chatgpt');
  // write your plugin here
  MemoryManager.setConfig(config);
  AskChatGPT.setConfig(config);

  if (config.isProxy) {
    if (config.isEnv) {
      process.env.HTTP_PROXY = config.proxyHost;
      process.env.HTTPS_PROXY = config.proxyHost;
    }
  } else {
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

    if (MemoryManager.getMemory(session.userId) === undefined) {
      MemoryManager.createMemory(session.userId, session.username);
      if (config.isLog) {
        logger.info('认识了新朋友：', session.username);
      }
    }
    const memory = MemoryManager.getMemory(session.userId);
    const reply = await AskChatGPT.askChatGPT(memory, input);


    send(replyType, reply, session).then(async () => {
      if (config.isLog) {
        logger.info(`reply ${session.username}：${reply}`);
      }
      const keyWords = await AskChatGPT.getLastSentenceKeyWords(memory);
      memory.addMemory({user: input, bot: reply});
      memory.addFuzzyMemory(keyWords);
    }).catch((e) => {
      logger.error('reply error：', e);
    });

    return await next();
  });

  ctx.command('reset', '删除关于你的记忆')
    .alias('重置')
    .action(async ({session}) => {
      MemoryManager.clearMemory(session.userId);
      if (config.isLog) {
        logger.info('reset memory:', session.username, '');
      }
      await send(getReplyType(session, config), '记忆已重置', session);
    });
}

const send = async (replyType: number, replyText: string, session: Session) => {
  if (replyType === 0) {
    await session.send(replyText);
  } else {
    await session.send(
      <>
        <at id={session.userId}/>
        <text content={replyText}/>
      </>
    )
  }
}
