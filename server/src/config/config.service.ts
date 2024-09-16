import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as process from 'process';

dotenvExpand.expand(config());

@Injectable()
export class ConfigService {
  appProject = 'hsa_redis_stampede';
  server = {
    port: Number(process.env.PORT) || 3000,
  };

  redis = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  };

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }
}
