import { Test, TestingModule } from '@nestjs/testing';
import { ClientInvoiceController } from './client-invoice.controller';
import { ClientInvoiceService } from './client-invoice.service';

describe('ClientInvoiceController', () => {
  let clientInvoiceController: ClientInvoiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ClientInvoiceController],
      providers: [ClientInvoiceService],
    }).compile();

    clientInvoiceController = app.get<ClientInvoiceController>(ClientInvoiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(clientInvoiceController.getHello()).toBe('Hello World!');
    });
  });
});
