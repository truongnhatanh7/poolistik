import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'apps/auth/src/cfg/auth.config';
import userConfig from 'apps/user/src/cfg/user.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [userConfig, authConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class CustomConfigModule {}
