import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { StampedeCacheFactory } from './stampede-cache/stampede-cache.factory';
import {
  StampedeChangeLockStrategy,
  StampedeProbabilisticStrategy,
} from './stampede-cache/strategy';

const stampedeCacheStrategies = [
  StampedeProbabilisticStrategy,
  StampedeChangeLockStrategy,
];
@Module({
  imports: [InfrastructureModule],
  providers: [StampedeCacheFactory, ...stampedeCacheStrategies],
  exports: [StampedeCacheFactory, ...stampedeCacheStrategies],
})
export class Unit1ServicesModule {}
