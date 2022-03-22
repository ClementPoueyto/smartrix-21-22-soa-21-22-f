import { Test, TestingModule } from '@nestjs/testing';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

describe('SupplierController', () => {
  let supplierController: SupplierController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [SupplierService],
    }).compile();

    supplierController = app.get<SupplierController>(SupplierController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(supplierController.getHello()).toBe('Hello World!');
    });
  });
});
