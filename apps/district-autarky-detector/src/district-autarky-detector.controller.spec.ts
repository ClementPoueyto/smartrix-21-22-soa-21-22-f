import { Test, TestingModule } from '@nestjs/testing';
import { DistrictAutarkyDetectorController } from './district-autarky-detector.controller';
import { DistrictAutarkyDetectorService } from './district-autarky-detector.service';

describe('DistrictAutarkyDetectorController', () => {
  let districtAutarkyDetectorController: DistrictAutarkyDetectorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DistrictAutarkyDetectorController],
      providers: [DistrictAutarkyDetectorService],
    }).compile();

    districtAutarkyDetectorController = app.get<DistrictAutarkyDetectorController>(DistrictAutarkyDetectorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(districtAutarkyDetectorController.getHello()).toBe('Hello World!');
    });
  });
});
