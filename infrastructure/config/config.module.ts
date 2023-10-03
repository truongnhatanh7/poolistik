import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import userConfig from 'apps/user/src/cfg/user.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['db.env', '.env'],
      load: [userConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class CustomConfigModule {}
