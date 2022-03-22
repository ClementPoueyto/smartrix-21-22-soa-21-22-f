import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumptionViewerService } from './consumption-viewer.service';
import { FiveMinConsumptionDto } from './dto/five-min-consumption.dto';

@Controller()
export class ConsumptionViewerController {
  constructor(private readonly consumptionViewerService: ConsumptionViewerService) { }

  @MessagePattern('five.min.energy.consumed')
  async energyConsumed(@Payload() message) {
    var consumption = new FiveMinConsumptionDto(message.value);
    await this.consumptionViewerService.addConsumption(consumption);
  }

  @Get('consumption')
  findConsumptionData() {
    return this.consumptionViewerService.getAllConsumption();
  }

  @Get('consumption/:id')
  getAllConsumptionByClientId(@Param()param){ 
    return this.consumptionViewerService.getAllConsumptionByClientId(param.id as number);
  }

 
}
