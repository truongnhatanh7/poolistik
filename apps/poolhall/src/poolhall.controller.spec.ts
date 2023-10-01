import { Test, TestingModule } from '@nestjs/testing';
import { PoolhallController } from './poolhall.controller';
import { PoolhallService } from './poolhall.service';

describe('PoolhallController', () => {
  let poolhallController: PoolhallController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PoolhallController],
      providers: [PoolhallService],
    }).compile();

    poolhallController = app.get<PoolhallController>(PoolhallController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(poolhallController.getHello()).toBe('Hello World!');
    });
  });
});
