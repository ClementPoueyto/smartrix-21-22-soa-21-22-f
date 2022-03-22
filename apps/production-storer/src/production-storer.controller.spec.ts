import { Test, TestingModule } from '@nestjs/testing';
import { ProductionStorerController } from './production-storer.controller';
import { ProductionStorerService } from './production-storer.service';

describe('ProductionStorerController', () => {
  let productionStorerController: ProductionStorerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductionStorerController],
      providers: [ProductionStorerService],
    }).compile();

    productionStorerController = app.get<ProductionStorerController>(ProductionStorerController);
  });

});
