import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionDayStorerController } from './consumption-day-storer.controller';
import { ConsumptionDayStorerService } from './consumption-day-storer.service';

describe('ConsumptionDayStorerController', () => {
  let consumptionDayStorerController: ConsumptionDayStorerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsumptionDayStorerController],
      providers: [ConsumptionDayStorerService],
    }).compile();

    consumptionDayStorerController = app.get<ConsumptionDayStorerController>(ConsumptionDayStorerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(consumptionDayStorerController.getHello()).toBe('Hello World!');
    });
  });
});
