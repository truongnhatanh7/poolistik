import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        // console.log(__dirname);
        return {
          type: 'postgres',
          url: configService.get<string>('POSTGRES_URL'),
          synchronize: true,
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          autoLoadEntities: true,
        };
      },

      inject: [ConfigService],
    }),
  ],
  exports: [PostgresModule],
})
export class PostgresModule {}
