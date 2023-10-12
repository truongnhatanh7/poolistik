import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'apps/user/src/entities/user.entity';
import * as redisStore from 'cache-manager-redis-store';
import { CustomJwtModule } from 'infrastructure/auth/jwt/jwt.module';
import { CustomConfigModule } from 'infrastructure/config/config.module';
import { PostgresModule } from 'infrastructure/database/postgres.module';
import { NodeMailerModule } from 'infrastructure/mail/mail.module';
import { NodeMailerService } from 'infrastructure/mail/mail.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_CONFIG } from './cfg/auth.config';

@Module({
  imports: [
    CustomConfigModule,
    PostgresModule,
    TypeOrmModule.forFeature([UserEntity]),
    CustomJwtModule,
    HttpModule.registerAsync({
      imports: [CustomConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get<number>(`${AUTH_CONFIG}.http.timeout`),
        maxRedirects: configService.get<number>(
          `${AUTH_CONFIG}.http.maxRedirects`,
        ),
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [CustomConfigModule],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        url: configService.get<string>(`${AUTH_CONFIG}.redis.kv_url`),
        tls: configService.get<boolean>(`${AUTH_CONFIG}.redis.tls`),
        ttl: configService.get<number>(`${AUTH_CONFIG}.redis.ttl`), // 1 Hour
      }),
      inject: [ConfigService],
    }),
    NodeMailerModule.register({
      service: process.env.GCP_MAIL_SERVICE,
      transport: {
        auth: {
          type: process.env.GCP_AUTH_TYPE,
          user: process.env.GCP_EMAIL_ADDR,
          clientId: process.env.GCP_OAUTH_CLIENTID,
          clientSecret: process.env.GCP_OAUTH_SECRET,
          refresh_token: process.env.GCP_REFRESH_TOKEN,
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, NodeMailerService],
})
export class AuthModule {}
