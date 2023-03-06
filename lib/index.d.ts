import { Context } from 'koishi';
import { Config } from './Config';
export declare const name = "chatgpt";
export * from './Config';
export declare function apply(ctx: Context, config: Config): void;
