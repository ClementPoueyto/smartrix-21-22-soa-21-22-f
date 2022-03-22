import { Test, TestingModule } from '@nestjs/testing';
import { FiveMinAutarkyAggregatorController } from './five-min-autarky-aggregator.controller';
import { FiveMinAutarkyAggregatorService } from './five-min-autarky-aggregator.service';

describe('FiveMinAutarkyAggregatorController', () => {
  let fiveMinAutarkyAggregatorController: FiveMinAutarkyAggregatorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FiveMinAutarkyAggregatorController],
      providers: [FiveMinAutarkyAggregatorService],
    }).compile();

    fiveMinAutarkyAggregatorController = app.get<FiveMinAutarkyAggregatorController>(FiveMinAutarkyAggregatorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fiveMinAutarkyAggregatorController.getHello()).toBe('Hello World!');
    });
  });
});
