import { Test, TestingModule } from '@nestjs/testing';
import { AutarkyDayStorerController } from './autarky-day-storer.controller';
import { AutarkyDayStorerService } from './autarky-day-storer.service';

describe('AutarkyDayStorerController', () => {
  let autarkyDayStorerController: AutarkyDayStorerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AutarkyDayStorerController],
      providers: [AutarkyDayStorerService],
    }).compile();

    autarkyDayStorerController = app.get<AutarkyDayStorerController>(AutarkyDayStorerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(autarkyDayStorerController.getHello()).toBe('Hello World!');
    });
  });
});
