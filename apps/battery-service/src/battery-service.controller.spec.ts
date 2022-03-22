import { Test, TestingModule } from '@nestjs/testing';
import { BatteryServiceController } from './battery-service.controller';
import { BatteryServiceService } from './battery-service.service';

describe('BatteryServiceController', () => {
  let batteryServiceController: BatteryServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BatteryServiceController],
      providers: [BatteryServiceService],
    }).compile();

    batteryServiceController = app.get<BatteryServiceController>(BatteryServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(batteryServiceController.getHello()).toBe('Hello World!');
    });
  });
});
