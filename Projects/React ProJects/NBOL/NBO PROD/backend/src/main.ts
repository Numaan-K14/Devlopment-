import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { CustomeExceptionsFilter } from './common/filters';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as crypto from 'crypto';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: '*',
  });

if (!globalThis.crypto) {
  (globalThis as any).crypto = crypto;
}

  app.useGlobalFilters(new CustomeExceptionsFilter());
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // request logger
  app.use(morgan('dev'));

  const config = new DocumentBuilder()
    .setTitle('NBOL Class API')
    .setDescription('The NBOL Class API description')
    .setVersion('1.0')
    .addTag('NBOL Class')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(configService.get('PORT') ?? 5000);
}
bootstrap();
