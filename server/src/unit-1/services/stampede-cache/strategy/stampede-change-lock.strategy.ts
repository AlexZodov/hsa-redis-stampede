import { StampedeCacheInterface } from '../stampede-cache.interface';
import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../../../../common/redis';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class StampedeChangeLockStrategy implements StampedeCacheInterface {
  private readonly ttl = 10;
  private readonly changeLockTtlMS = 150;
  private readonly changeLockDelayMS = 50;

  private hits: number = 0;
  private misses: number = 0;
  constructor(private readonly redisCacheService: RedisCacheService) {}
  async getOrSet(key: string): Promise<any> {
    return await this.getWithChangeLock(key);
  }

  private async setFreshValue(key: string): Promise<string> {
    const value = 'test_value';
    await this.redisCacheService.set(this.getKey(key), value, {
      ttlSec: this.ttl,
    });

    return value;
  }

  private getKey(key: string): string {
    return ['change-lock', key].join(':');
  }

  private getChangeLockKey(key: string): string {
    return ['change-lock', 'change-lock-key', key].join(':');
  }

  private async getWithChangeLock(key: string, counter = 3) {
    let result;
    try {
      if (counter <= 0) {
        await this.setFreshValue(key);
      }

      const value = await this.redisCacheService.get(this.getKey(key));
      if (value) {
        result = value;
        if (counter === 3) {
          ++this.hits;
        }
      } else {
        const isInChangeLock = await this.redisCacheService.get(
          this.getChangeLockKey(key),
        );
        if (isInChangeLock) {
          await delay(this.changeLockDelayMS);
          result = await this.getWithChangeLock(key, --counter);
        } else {
          ++this.misses;
        }

        await this.redisCacheService.set(this.getChangeLockKey(key), key, {
          ttlSec: this.changeLockTtlMS,
        });
        result = await this.setFreshValue(key);
        await this.redisCacheService.del(this.getChangeLockKey(key));
      }
    } catch (error) {
      console.error('Error from Redis:', error);
      result = null;
    }

    return result;
  }

  getMetrics(): Promise<{ hits: number; misses: number }> {
    return Promise.resolve({ hits: this.hits, misses: this.misses });
  }
}
