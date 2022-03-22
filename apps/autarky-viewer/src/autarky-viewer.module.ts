import { Module } from '@nestjs/common';
import { AutarkyViewerController } from './autarky-viewer.controller';
import { AutarkyViewerService } from './autarky-viewer.service';

@Module({
  imports: [],
  controllers: [AutarkyViewerController],
  providers: [AutarkyViewerService],
})
export class AutarkyViewerModule { }
