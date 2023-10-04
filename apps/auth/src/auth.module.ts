import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomConfigModule } from 'infrastructure/config/config.module';
import { PostgresModule } from 'infrastructure/database/postgres.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'apps/user/src/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CustomConfigModule,
    PostgresModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
})
export class AuthModule {}
