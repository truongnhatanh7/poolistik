import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomConfigModule } from 'infrastructure/config/config.module';
import { PostgresModule } from 'infrastructure/database/postgres.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CustomConfigModule, PostgresModule],
  controllers: [UserController],
  providers: [UserService, ConfigService],
})
export class UserModule {}
