import { NestFactory } from '@nestjs/core';
import { ListenModule } from './modules/listen.module';

async function bootstrap() {
  const app = await NestFactory.create(ListenModule);

  app.enableCors({
    origin: 'https://gamma.pm',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
