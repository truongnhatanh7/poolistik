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
    NodeMailerModule.registerAsync({
      imports: [CustomConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get<string>(`${AUTH_CONFIG}.mail.service`));
        return {
          service: configService.get<string>(`${AUTH_CONFIG}.mail.service`),
          transport: {
            auth: {
              type: configService.get<string>(`${AUTH_CONFIG}.mail.auth.type`),
              user: configService.get<string>(`${AUTH_CONFIG}.mail.auth.user`),
              clientId: configService.get<string>(
                `${AUTH_CONFIG}.mail.auth.clientId`,
              ),
              clientSecret: configService.get<string>(
                `${AUTH_CONFIG}.mail.auth.clientSecret`,
              ),
              refreshToken: configService.get<string>(
                `${AUTH_CONFIG}.mail.auth.refreshToken`,
              ),
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, NodeMailerService],
})
export class AuthModule {}
