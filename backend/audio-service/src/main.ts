import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors();
  await app.listen(configService.get('port'));
}
bootstrap();
