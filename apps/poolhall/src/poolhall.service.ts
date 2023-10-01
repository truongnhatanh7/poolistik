import { Injectable } from '@nestjs/common';

@Injectable()
export class PoolhallService {
  getHello(): string {
    return 'Hello World!';
  }
}
