import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
      whitelist: true,      
      forbidNonWhitelisted: true,
      transform: true,      
      disableErrorMessages: true
    }));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API cho hệ thống đặt lịch')
    .setDescription('Tài liệu API cho hệ thống đặt lịch khám chữa bệnh')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
