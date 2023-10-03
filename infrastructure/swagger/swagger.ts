import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerConfiguration(app: INestApplication<any>, name: string) {
  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription('')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}