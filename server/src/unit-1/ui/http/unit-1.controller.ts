import { Controller, Get, Param } from '@nestjs/common';
import { GetStampedeCacheHandler } from '../../operation';
import { GetStampedeMetricsHandler } from '../../operation/handler/get-stampede-metrics.handler';

@Controller('/unit-1')
export class Unit1Controller {
  constructor(
    private readonly getStampedeCacheHandler: GetStampedeCacheHandler,
    private readonly getStampedeMetricsHandler: GetStampedeMetricsHandler,
  ) {}

  @Get('/:stampedeStrategy')
  async getStampedeCache(
    @Param('stampedeStrategy') stampedeStrategy: string,
  ): Promise<{ result: string }> {
    const result = await this.getStampedeCacheHandler.handle(stampedeStrategy);

    return { result };
  }

  @Get('/:stampedeStrategy/metrics')
  async getMetricsResult(
    @Param('stampedeStrategy') stampedeStrategy: string,
  ): Promise<{ result: { hits: number; misses: number } }> {
    const result =
      await this.getStampedeMetricsHandler.handle(stampedeStrategy);

    return { result };
  }
}
