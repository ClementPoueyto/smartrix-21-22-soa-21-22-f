import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { HouseService } from './house.service';
import { ConsumptionDto } from './dto/consumption.dto';
import { ProductionDto } from './dto/production.dto';

@Controller()
export class HouseController {
  constructor(@Inject('HOUSE_SERVICE') private readonly client: ClientKafka,
    private readonly houseService: HouseService,) {
    this.exec()
  }


  async exec() {
    while (true) {
      this.houseService.energyConsumed(this.client);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  @Post('consume')
  postConsume(@Body() consumption: ConsumptionDto) {
    console.log(JSON.stringify(consumption))
    this.houseService.clientEnergyConsumed(this.client, consumption);
  }
  @Post('produce')
  postProduction(@Body() production: ProductionDto) {
    this.houseService.clientEnergyProduced(this.client, production);
  }
  @MessagePattern('energy.consumption.reduce')
  reduceConsumption(@Payload() message){
    this.houseService.reduceConsumption(message.value.districtId,message.value.request)
  }
  @MessagePattern('energy.consumption.reopen')
  reopenConsumption(@Payload() message){
    this.houseService.reopenClosedConsumption(message.value.districtId,message.value.request)
  }
}
