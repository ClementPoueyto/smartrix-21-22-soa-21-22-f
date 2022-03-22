import { Test, TestingModule } from '@nestjs/testing';
import { AutarkyHourStorerController } from './autarky-hour-storer.controller';
import { AutarkyHourStorerService } from './autarky-hour-storer.service';

describe('AutarkyHourStorerController', () => {
  let autarkyHourStorerController: AutarkyHourStorerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AutarkyHourStorerController],
      providers: [AutarkyHourStorerService],
    }).compile();

    autarkyHourStorerController = app.get<AutarkyHourStorerController>(AutarkyHourStorerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(autarkyHourStorerController.getHello()).toBe('Hello World!');
    });
  });
});
