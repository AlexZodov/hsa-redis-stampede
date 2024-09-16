import { Injectable } from '@nestjs/common';
import { StampedeCacheFactory } from '../../services/stampede-cache/stampede-cache.factory';

@Injectable()
export class GetStampedeCacheHandler {
  constructor(private readonly factory: StampedeCacheFactory) {}

  async handle(stampedeStrategy: string): Promise<string | null> {
    const strategy = await this.factory.create(stampedeStrategy);

    return await strategy.getOrSet('test');
  }
}
