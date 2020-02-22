import * as Promise from 'bluebird';
import * as Redis from 'redis';

import settings from "../../config/settings";

declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    getAsync(...args: any[]): Promise<any>;
    setAsync(...args: any[]): Promise<any>;
    keyAsync(...args: any[]): Promise<any>;
    delAsync(...args: any[]): Promise<any>;
    // add other methods here
  }
}

const redisClient = Redis.createClient(settings.redisUrl);

const asyncRedisClient = Promise.promisifyAll(redisClient) as Redis.RedisClient;

export default asyncRedisClient;
