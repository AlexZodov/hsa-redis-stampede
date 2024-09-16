import {
  StampedeChangeLockStrategy,
  StampedeProbabilisticStrategy,
} from './strategy';
import { StampedeCacheInterface } from './stampede-cache.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StampedeCacheFactory {
  constructor(
    private readonly stampedeProbabilisticStrategy: StampedeProbabilisticStrategy,
    private readonly stampedeChangeLockStrategy: StampedeChangeLockStrategy,
  ) {}

  async create(type: string): Promise<StampedeCacheInterface> {
    switch (type) {
      case 'probabilistic':
        return this.stampedeProbabilisticStrategy;
      case 'change-lock':
        return this.stampedeChangeLockStrategy;
    }
  }
}
