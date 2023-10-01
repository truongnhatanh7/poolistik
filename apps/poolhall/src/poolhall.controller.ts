import { Controller, Get } from '@nestjs/common';
import { PoolhallService } from './poolhall.service';

@Controller()
export class PoolhallController {
  constructor(private readonly poolhallService: PoolhallService) {}

  @Get()
  getHello(): string {
    return this.poolhallService.getHello();
  }
}
