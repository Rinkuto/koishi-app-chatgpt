import {Context, Quester, Random, Schema, Session} from 'koishi'
import {Config} from './Config'
import {MemoryManager} from "./Memory";
import {AskChatGPT} from "./AskChatGPT";
import {Search} from "./search/Search";
import {BingSearch} from "./search/BingSearch";
import {KeyWord} from "./keyword/KeyWord";
import {ChatGptKeyWord} from "./keyword/ChatGptKeyWord";
import {TencentKeyWord} from "./keyword/TencentKeyWord";
import {BaiduSearch} from "./search/BaiduSearch";
import {GoogleSearch} from "./search/GoogleSearch";
import {config} from "yakumo";

export const name = 'chatgpt'
export * from './Config'

// 以后可以考虑加入更多的搜索引擎
const searchContent = new Map<string, Search>();
const keyWordsContent = new Map<string, KeyWord>();

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
  AskChatGPT.setHttp(ctx.http);
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

    if (MemoryManager.getUserMemory(session.userId) === undefined) {
      MemoryManager.createMemory(session.userId, session.username);
      if (config.isLog) {
        logger.info('认识了新朋友：', session.username);
      }
    }

    const userMemory = MemoryManager.getUserMemory(session.userId);
    let messages = AskChatGPT.createRequestMessages(userMemory);

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
          messages = AskChatGPT.createRequestMessages(userMemory, search);
        }
      }
    }

    // 将用户输入添加到消息队列
    messages.push(AskChatGPT.setUserPrompt(input, userMemory.username));

    // 回复
    AskChatGPT.askChatGPT(messages).then(reply => {
      send(replyType, reply, session, config).then(async () => {
        if (config.isLog) {
          logger.info(`reply ${session.username}：${reply}`);
        }
        userMemory.addMemory({user: input, bot: reply});
      }).catch((e) => {
        logger.error('reply error：', e);
      });
    }).catch((e: any) => {
      logger.error(e);
      if (e.errno === -4039) {
        send(replyType, '请求失败，请稍后再试\nerror code: connect ETIMEDOUT', session, config);
      } else {
        send(replyType, `请求失败，请稍后再试\nerror code: ${e.response.status}`, session, config);
      }
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
      await send(getReplyType(session, config), '记忆已重置', session, config);
    });

  ctx.command('balance', '查询余额')
    .alias('余额')
    .action(async ({session}) => {
      const balance = await AskChatGPT.getBalance();
      await send(getReplyType(session, config),
        `余额：$${balance.total_used.toFixed(2)} / $${balance.total_granted.toFixed(2)}\n已用 ${(balance.total_used / balance.total_granted * 100).toFixed(2)}%`,
        session, config);
    });
}

const send = async (replyType: number, replyText: string, session: Session, config: Config) => {
  if (replyType === 0 || config.isAt === false) {
    await session.send(replyText).then(res => {
      if (res.length === 0) {
        send(replyType, '回复失败', session, config)
      }
    });
  } else {
    await session.send(
      <>
        <at id={session.userId}/>
        <text content={replyText}/>
      </>
    ).then(res => {
      if (res.length === 0) {
        send(replyType, '回复失败', session, config)
      }
    })
  }
}

const initSearchContent = (http: Quester, config: Config) => {
  searchContent.set('bing', new BingSearch(http, config));
  searchContent.set('baidu', new BaiduSearch(http, config));
  searchContent.set('google', new GoogleSearch(http, config));
}

const initKeyWordsContent = (http: Quester, config: Config) => {
  keyWordsContent.set('chatgpt', new ChatGptKeyWord(http, config));
  keyWordsContent.set('tencent', new TencentKeyWord(http, config));
}





