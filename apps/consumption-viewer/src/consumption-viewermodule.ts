import { Module } from '@nestjs/common';
import { ConsumptionViewerController } from './consumption-viewer.controller';
import { ConsumptionViewerService } from './consumption-viewer.service';

@Module({
  imports: [],
  controllers: [ConsumptionViewerController],
  providers: [ConsumptionViewerService],
})
export class ConsumptionViewerModule { }
