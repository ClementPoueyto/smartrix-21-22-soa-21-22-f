import { Test, TestingModule } from '@nestjs/testing';
import { AutarkyViewerController } from './autarky-viewer.controller';
import { AutarkyViewerService } from './autarky-viewer.service';

describe('AutarkyViewerController', () => {
  let autarkyViewerController: AutarkyViewerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AutarkyViewerController],
      providers: [AutarkyViewerService],
    }).compile();

    autarkyViewerController = app.get<AutarkyViewerController>(AutarkyViewerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(autarkyViewerController.getHello()).toBe('Hello World!');
    });
  });
});
