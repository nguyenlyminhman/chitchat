import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { ShareModule } from './modules/share/share.module';
import { ServerConfigService } from './modules/share/server-config.service';
import { join } from 'path';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerConfig } from './config/swagger';
import * as morgan from 'morgan';


async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true }
  );
  const serverConfig = app.select(ShareModule).get(ServerConfigService);
  const { port } = serverConfig.serverPort;

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(helmet());
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('combined'));
  app.enableVersioning();
  // Microservice config here

  // Setup swagger
  if (serverConfig.swaggerEnabled) {
    SwaggerConfig(app);
  }
  // Set global prefix for endpoint


  await app.listen(port);

  return app;
}

bootstrap();
