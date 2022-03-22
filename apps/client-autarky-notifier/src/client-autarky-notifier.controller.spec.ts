import { Test, TestingModule } from '@nestjs/testing';
import { ClientAutarkyNotifierController } from './client-autarky-notifier.controller';
import { ClientAutarkyNotifierService } from './client-autarky-notifier.service';

describe('ClientAutarkyNotifierController', () => {
  let clientAutarkyNotifierController: ClientAutarkyNotifierController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ClientAutarkyNotifierController],
      providers: [ClientAutarkyNotifierService],
    }).compile();

    clientAutarkyNotifierController = app.get<ClientAutarkyNotifierController>(ClientAutarkyNotifierController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(clientAutarkyNotifierController.getHello()).toBe('Hello World!');
    });
  });
});
