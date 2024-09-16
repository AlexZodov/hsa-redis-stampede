import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', {
    exclude: ['metrics', 'api/____service/healthcheck', 'api/____service/test'],
  });

  const config = app.get(ConfigService);

  await app.listen(config.server.port);
}
bootstrap();
