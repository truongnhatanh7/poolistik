import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'apps/user/src/entities/user.entity';
import { CustomConfigModule } from 'infrastructure/config/config.module';
import { PostgresModule } from 'infrastructure/database/postgres.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomJwtModule } from 'infrastructure/auth/jwt/jwt.module';

@Module({
  imports: [
    CustomConfigModule,
    PostgresModule,
    TypeOrmModule.forFeature([UserEntity]),
    CustomJwtModule,
    // JwtModule.register({
    //   global: true,
    //   secret: 'temp',
    //   signOptions: { expiresIn: '60s' },
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
})
export class AuthModule {}
