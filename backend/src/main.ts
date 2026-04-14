import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://shop-easy-git-main-jeffersons-projects-d679b89f.vercel.app',
      'https://shop-easy-nky3cjwkk-jeffersons-projects-d679b89f.vercel.app',
      /\.vercel\.app$/
    ],
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('ShopEasy API')
    .setDescription('API para el sistema de gestión ShopEasy')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3001);
  console.log('🚀 Backend corriendo en http://localhost:3001/api');
  console.log('📚 Documentación Swagger disponible en http://localhost:3001/api/docs');
}

void bootstrap();
