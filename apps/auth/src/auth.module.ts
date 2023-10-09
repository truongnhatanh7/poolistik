import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'apps/user/src/entities/user.entity';
import { CustomJwtModule } from 'infrastructure/auth/jwt/jwt.module';
import { CustomConfigModule } from 'infrastructure/config/config.module';
import { PostgresModule } from 'infrastructure/database/postgres.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CustomConfigModule,
    PostgresModule,
    TypeOrmModule.forFeature([UserEntity]),
    CustomJwtModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.KV_URL,
      tls: true,
      // host: process.env.ELASTICACHE_HOST,
      // port: process.env.ELASTICACHE_PORT,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
})
export class AuthModule {}
