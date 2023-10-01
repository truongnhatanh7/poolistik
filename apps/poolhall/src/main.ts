import { NestFactory } from '@nestjs/core';
import { PoolhallModule } from './poolhall.module';

async function bootstrap() {
  const app = await NestFactory.create(PoolhallModule);
  await app.listen(3000);
}
bootstrap();
