import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { PORT } from '@common/environment';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(`api/`);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, '0.0.0.0').then(async () => {
    Logger.log(
      `✅  Application is running on: ${await app.getUrl()}`,
      'NestJS',
    );

    if (process.env.NODE_ENV === 'production') {
      return;
    } else {
      console.info(`Server Details:
            port: ${PORT},
            url: http://localhost:${PORT}/api
            environment: ${process.env.NODE_ENV},
            `);
    }
  });
}
bootstrap();
