import { NestFactory } from '@nestjs/core';
import { swaggerConfiguration } from 'infrastructure/swagger/swagger';
import { UserModule } from './user.module';
import { ValidationPipe } from 'infrastructure/validation/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.useGlobalPipes(new ValidationPipe());
  if (process.env.STAGE !== 'prod') {
    swaggerConfiguration(app, 'user');
  }

  await app.listen(process.env.USER_SERVICE_PORT);
}
bootstrap();
