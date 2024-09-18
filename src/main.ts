import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
  
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/catb.io/privkey.pem'),  // Path to your private key
    cert: fs.readFileSync('/etc/letsencrypt/live/catb.io/fullchain.pem'),  // Path to the full certificate chain
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  // Enable CORS
  app.enableCors({
    origin: '*', // Allow all origins (you can restrict to specific domains here)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Enable sending credentials like cookies
  });

  const config = new DocumentBuilder()
  .setTitle('NestJS API')
  .setDescription('The API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4001);
}
bootstrap();
