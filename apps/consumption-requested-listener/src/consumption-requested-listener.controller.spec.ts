import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionRequestedListenerController } from './consumption-requested-listener.controller';
import { ConsumptionRequestedListenerService } from './consumption-requested-listener.service';

describe('ConsumptionRequestedListenerController', () => {
  let consumptionRequestedListenerController: ConsumptionRequestedListenerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsumptionRequestedListenerController],
      providers: [ConsumptionRequestedListenerService],
    }).compile();

    consumptionRequestedListenerController = app.get<ConsumptionRequestedListenerController>(ConsumptionRequestedListenerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(consumptionRequestedListenerController.getHello()).toBe('Hello World!');
    });
  });
});
