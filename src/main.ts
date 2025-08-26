import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableCors();
  
  await app.listen(3000);
  console.log('Insurance API running on port 3000');
}
bootstrap();