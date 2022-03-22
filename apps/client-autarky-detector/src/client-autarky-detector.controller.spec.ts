import { Test, TestingModule } from '@nestjs/testing';
import { ClientAutarkyDetectorController } from './client-autarky-detector.controller';
import { ClientAutarkyDetectorService } from './client-autarky-detector.service';

describe('ClientAutarkyDetectorController', () => {
  let clientAutarkyDetectorController: ClientAutarkyDetectorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ClientAutarkyDetectorController],
      providers: [ClientAutarkyDetectorService],
    }).compile();

    clientAutarkyDetectorController = app.get<ClientAutarkyDetectorController>(ClientAutarkyDetectorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(clientAutarkyDetectorController.getHello()).toBe('Hello World!');
    });
  });
});
