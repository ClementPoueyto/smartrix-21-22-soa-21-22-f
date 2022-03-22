import { Test, TestingModule } from '@nestjs/testing';
import { ProductionRequesterController } from './production-requester.controller';
import { ProductionRequesterService } from './production-requester.service';

describe('ProductionRequesterController', () => {
  let productionRequesterController: ProductionRequesterController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductionRequesterController],
      providers: [ProductionRequesterService],
    }).compile();

    productionRequesterController = app.get<ProductionRequesterController>(ProductionRequesterController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(productionRequesterController.getHello()).toBe('Hello World!');
    });
  });
});
