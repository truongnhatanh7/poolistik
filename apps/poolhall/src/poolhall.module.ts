import { Module } from '@nestjs/common';
import { PoolhallController } from './poolhall.controller';
import { PoolhallService } from './poolhall.service';

@Module({
  imports: [],
  controllers: [PoolhallController],
  providers: [PoolhallService],
})
export class PoolhallModule {}
