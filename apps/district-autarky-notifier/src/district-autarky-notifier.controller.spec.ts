import { Test, TestingModule } from '@nestjs/testing';
import { DistrictAutarkyNotifierController } from './district-autarky-notifier.controller';
import { DistrictAutarkyNotifierService } from './district-autarky-notifier.service';

describe('DistrictAutarkyNotifierController', () => {
  let districtAutarkyNotifierController: DistrictAutarkyNotifierController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DistrictAutarkyNotifierController],
      providers: [DistrictAutarkyNotifierService],
    }).compile();

    districtAutarkyNotifierController = app.get<DistrictAutarkyNotifierController>(DistrictAutarkyNotifierController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(districtAutarkyNotifierController.getHello()).toBe('Hello World!');
    });
  });
});
