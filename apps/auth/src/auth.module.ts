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
import { NodeMailerModule } from 'infrastructure/mail/mail.module';
import { NodeMailerService } from 'infrastructure/mail/mail.service';

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
    CacheModule.registerAsync({
      imports: [CustomConfigModule],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        url: configService.get<string>('KV_URL'),
        tls: true,
        ttl: 3600, // 1 Hour
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
