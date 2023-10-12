import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomConfigModule } from 'infrastructure/config/config.module';
import { PostgresModule } from 'infrastructure/database/postgres.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repo';

@Module({
  imports: [
    CustomConfigModule,
    PostgresModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService, ConfigService, UserRepository],
})
export class UserModule {}
