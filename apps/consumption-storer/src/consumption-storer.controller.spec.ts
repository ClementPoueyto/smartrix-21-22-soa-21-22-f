import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionStorerController } from './consumption-storer.controller';
import { ConsumptionStorerService } from './consumption-storer.service';

describe('ConsumptionStorerController', () => {
  let consumptionStorerController: ConsumptionStorerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsumptionStorerController],
      providers: [ConsumptionStorerService],
    }).compile();

    consumptionStorerController = app.get<ConsumptionStorerController>(ConsumptionStorerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(consumptionStorerController.getHello()).toBe('Hello World!');
    });
  });
});
