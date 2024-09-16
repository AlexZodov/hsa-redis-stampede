import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { isDefined } from 'class-validator';

@Injectable()
export class RedisCacheService {
  private readonly DEFAULT_TTL = 300;
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get<ReturnType = any>(key: string): Promise<ReturnType> {
    return await this.cache.get<ReturnType>(key);
  }

  async getExpiration(key: string): Promise<number> {
    return await this.cache.store.ttl(key);
  }

  async getOrSet<ReturnType = any>(
    key: string,
    callback: () => ReturnType,
    config?: { ttlSec: number },
  ): Promise<ReturnType> {
    let value: ReturnType = await this.cache.get<ReturnType>(key);
    if (!value) {
      value = await callback();
      if (value !== undefined && null !== value) {
        await this.set(key, value, config);
      }
    }
    return value;
  }

  async set(
    key: string,
    value: any,
    config?: { ttlSec?: number; ttlMS?: number },
  ) {
    let ttl;
    if (isDefined(config.ttlSec)) {
      ttl = config.ttlSec * 1000;
    } else if (isDefined(config.ttlMS)) {
      ttl = config.ttlMS;
    } else {
      ttl = this.DEFAULT_TTL * 1000;
    }
    await this.cache.set(key, value, ttl);
  }

  async reset() {
    await this.cache.reset();
  }

  async del(key: string) {
    await this.cache.del(key);
  }

  public keys(pattern: string): Promise<string[]> {
    return this.cache.store.keys(pattern);
  }

  public async getDef<ReturnType = any>(
    key: string,
    defaultReturn: any,
  ): Promise<ReturnType> {
    let result = await this.cache.get<ReturnType>(key);
    if (!result) {
      result = defaultReturn;
    }

    return result;
  }

  public redis(): Cache {
    return this.cache;
  }
}
