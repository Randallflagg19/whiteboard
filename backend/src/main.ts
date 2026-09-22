import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST ?? '127.0.0.1';

  app.enableCors({ origin: 'http://localhost:3000' });
  await app.listen(port, host);
}
await bootstrap();
