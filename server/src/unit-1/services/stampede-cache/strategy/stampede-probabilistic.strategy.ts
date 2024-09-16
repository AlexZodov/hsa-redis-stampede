import { StampedeCacheInterface } from '../stampede-cache.interface';
import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../../../../common/redis';

@Injectable()
export class StampedeProbabilisticStrategy implements StampedeCacheInterface {
  private readonly ttl = 10;
  private readonly startProbability = 0.6;
  private readonly probabilityIncreaseStep = 0.5;
  private readonly probabilitySteps = [30, 25, 20, 15, 10, 5];

  private hits: number = 0;
  private misses: number = 0;
  constructor(private readonly redisCacheService: RedisCacheService) {}
  async getOrSet(key: string): Promise<any> {
    let result;
    const expiration = await this.redisCacheService.getExpiration(
      this.getKey(key),
    );

    if (expiration === 0) {
      result = await this.setFreshValue(key);
      ++this.misses;
    } else {
      const shouldRefresh = this.shouldRefresh(expiration);
      if (shouldRefresh) {
        result = await this.setFreshValue(key);
      } else {
        result = await this.redisCacheService.get(this.getKey(key));
        ++this.hits;
      }
    }

    return result;
  }

  private shouldRefresh(expiration: number): boolean {
    let result = false;
    let probability = this.startProbability;
    const diff = Math.floor(this.ttl - expiration);

    for (let i = 0; i < this.probabilitySteps.length; i++) {
      if (diff < this.probabilitySteps[i]) {
        probability =
          this.startProbability + (i + 1) * this.probabilityIncreaseStep;
        break;
      }
    }

    result = Math.random() > probability;

    return result;
  }

  private async setFreshValue(key: string): Promise<string> {
    const value = 'test_value';
    await this.redisCacheService.set(this.getKey(key), value, {
      ttlSec: this.ttl,
    });

    return value;
  }

  private getKey(key: string): string {
    return ['probabilistic', key].join(':');
  }

  getMetrics(): Promise<{ hits: number; misses: number }> {
    return Promise.resolve({ hits: this.hits, misses: this.misses });
  }
}
