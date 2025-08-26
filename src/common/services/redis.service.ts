import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { redisConfig } from '../../config/database.config';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;
  
  async onModuleInit() {
    this.client = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
      password: redisConfig.password,
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    await this.client.connect();
    console.log('Redis connected successfully');
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return await this.client.exists(key);
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    return await this.client.lPush(key, values);
  }

  async rpop(key: string): Promise<string | null> {
    return await this.client.rPop(key);
  }

  async llen(key: string): Promise<number> {
    return await this.client.lLen(key);
  }

  getClient(): RedisClientType {
    return this.client;
  }
}