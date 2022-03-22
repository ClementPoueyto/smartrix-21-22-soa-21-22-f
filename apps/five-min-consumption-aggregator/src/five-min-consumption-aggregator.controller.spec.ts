import { Test, TestingModule } from '@nestjs/testing';
import { FiveMinConsumptionAggregatorController } from './five-min-consumption-aggregator.controller';
import { FiveMinConsumptionAggregatorService } from './five-min-consumption-aggregator.service';

describe('FiveMinConsumptionAggregatorController', () => {
  let fiveMinConsumptionAggregatorController: FiveMinConsumptionAggregatorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FiveMinConsumptionAggregatorController],
      providers: [FiveMinConsumptionAggregatorService],
    }).compile();

    fiveMinConsumptionAggregatorController = app.get<FiveMinConsumptionAggregatorController>(FiveMinConsumptionAggregatorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fiveMinConsumptionAggregatorController.getHello()).toBe('Hello World!');
    });
  });
});
