import { NestFactory } from '@nestjs/core';
import { ListenModule } from './modules/listen.module';

async function bootstrap() {
  const app = await NestFactory.create(ListenModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
