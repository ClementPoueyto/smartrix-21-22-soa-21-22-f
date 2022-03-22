import { Test, TestingModule } from '@nestjs/testing';
import { BalancerController } from './balancer.controller';
import { BalancerService } from './balancer.service';

describe('BalancerController', () => {
  let balancerController: BalancerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BalancerController],
      providers: [BalancerService],
    }).compile();

    balancerController = app.get<BalancerController>(BalancerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(balancerController.getHello()).toBe('Hello World!');
    });
  });
});
