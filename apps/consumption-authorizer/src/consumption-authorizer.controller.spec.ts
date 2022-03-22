import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionAuthorizerController } from './consumption-authorizer.controller';
import { ConsumptionAuthorizerService } from './consumption-authorizer.service';

describe('ConsumptionAuthorizerController', () => {
  let consumptionAuthorizerController: ConsumptionAuthorizerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsumptionAuthorizerController],
      providers: [ConsumptionAuthorizerService],
    }).compile();

    consumptionAuthorizerController = app.get<ConsumptionAuthorizerController>(ConsumptionAuthorizerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(consumptionAuthorizerController.getHello()).toBe('Hello World!');
    });
  });
});
