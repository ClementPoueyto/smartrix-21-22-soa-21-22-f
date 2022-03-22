import { Test, TestingModule } from '@nestjs/testing';
import { ProductionContractController } from './production-contract.controller';
import { ProductionContractService } from './production-contract.service';

describe('ProductionContractController', () => {
  let productionContractController: ProductionContractController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductionContractController],
      providers: [ProductionContractService],
    }).compile();

    productionContractController = app.get<ProductionContractController>(ProductionContractController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(productionContractController.getHello()).toBe('Hello World!');
    });
  });
});
