import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionViewerController } from './consumption-viewer.controller';
import { ConsumptionViewerService } from './consumption-viewer.service';

describe('ConsumptionViewerController', () => {
  let consumptionViewerController: ConsumptionViewerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsumptionViewerController],
      providers: [ConsumptionViewerService],
    }).compile();

    consumptionViewerController = app.get<ConsumptionViewerController>(ConsumptionViewerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(consumptionViewerController.getHello()).toBe('Hello World!');
    });
  });
});
