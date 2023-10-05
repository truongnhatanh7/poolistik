import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CustomConfigModule } from 'infrastructure/config/config.module';
@Module({
  imports: [
    CustomConfigModule,
    JwtModule.registerAsync({
      useFactory(configService: ConfigService) {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
        };
      },

      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class CustomJwtModule {}
