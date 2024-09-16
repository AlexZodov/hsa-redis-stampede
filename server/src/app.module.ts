import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { Unit1Module } from './unit-1/unit1.module';
import { RedisCacheModule } from './common/redis';

@Module({
  imports: [ConfigModule, Unit1Module, RedisCacheModule],
})
export class AppModule {}
