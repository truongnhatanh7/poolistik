import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { swaggerConfiguration } from 'infrastructure/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  if (process.env.STAGE !== 'prod') {
    swaggerConfiguration(app, 'auth');
  }
  await app.listen(3001);
}
bootstrap();
