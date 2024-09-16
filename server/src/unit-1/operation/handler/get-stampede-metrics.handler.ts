import { Injectable } from '@nestjs/common';
import { StampedeCacheFactory } from '../../services/stampede-cache/stampede-cache.factory';

@Injectable()
export class GetStampedeMetricsHandler {
  constructor(private readonly factory: StampedeCacheFactory) {}

  async handle(
    stampedeStrategy: string,
  ): Promise<{ hits: number; misses: number }> {
    const strategy = await this.factory.create(stampedeStrategy);

    return await strategy.getMetrics();
  }
}
