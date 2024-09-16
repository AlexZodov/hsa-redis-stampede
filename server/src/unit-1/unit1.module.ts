import { Module } from '@nestjs/common';
import { Unit1ServicesModule } from './services';
import { GetStampedeCacheHandler } from './operation';
import { Unit1Controller } from './ui';
import { GetStampedeMetricsHandler } from './operation/handler/get-stampede-metrics.handler';

const handlers = [GetStampedeCacheHandler, GetStampedeMetricsHandler];
@Module({
  imports: [Unit1ServicesModule],
  controllers: [Unit1Controller],
  providers: [...handlers],
})
export class Unit1Module {}
