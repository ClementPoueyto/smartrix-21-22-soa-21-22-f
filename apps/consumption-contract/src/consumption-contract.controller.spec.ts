import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionContractController } from './consumption-contract.controller';
import { ConsumptionContractService } from './consumption-contract.service';

describe('ConsumptionContractController', () => {
  let consumptionContractController: ConsumptionContractController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsumptionContractController],
      providers: [ConsumptionContractService],
    }).compile();

    consumptionContractController = app.get<ConsumptionContractController>(ConsumptionContractController);
  });
});
