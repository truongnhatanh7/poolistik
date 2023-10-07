import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { swaggerConfiguration } from 'infrastructure/swagger/swagger';
import { ValidationPipe } from 'infrastructure/validation/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe());
  if (process.env.STAGE !== 'prod') {
    swaggerConfiguration(app, 'auth');
  }
  await app.listen(3001);
}
bootstrap();
