import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionRequesterController } from './consumption-requester.controller';
import { ConsumptionRequesterService } from './consumption-requester.service';

describe('ConsumptionRequesterController', () => {
  let consumptionRequesterController: ConsumptionRequesterController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsumptionRequesterController],
      providers: [ConsumptionRequesterService],
    }).compile();

    consumptionRequesterController = app.get<ConsumptionRequesterController>(ConsumptionRequesterController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(consumptionRequesterController.getHello()).toBe('Hello World!');
    });
  });
});
