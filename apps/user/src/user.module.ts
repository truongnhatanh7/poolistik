import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CustomConfigModule } from 'infrastructure/config/config.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [CustomConfigModule],
  controllers: [UserController],
  providers: [UserService, ConfigService],
})
export class UserModule {}
