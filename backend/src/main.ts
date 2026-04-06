import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todos los endpoints
  app.setGlobalPrefix('api');

  // Validación automática de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // CORS para que Next.js pueda consumir la API
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(3001);
  console.log('🚀 Backend corriendo en http://localhost:3001/api');
}
bootstrap();