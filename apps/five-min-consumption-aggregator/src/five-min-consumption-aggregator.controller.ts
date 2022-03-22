import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumptionDto } from './dto/consumption.dto';
import { FiveMinConsumptionAggregatorService } from './five-min-consumption-aggregator.service';

@Controller()
export class FiveMinConsumptionAggregatorController {
  constructor(@Inject('FIVE_MIN_AGGREGATOR_SERVICE') private readonly client: ClientKafka,private readonly fiveMinConsumptionAggregatorService: FiveMinConsumptionAggregatorService) {}


  @MessagePattern('energy.consumed')
  async energyConsumed(@Payload() message) {
    this.client.connect();
    var consumption = new ConsumptionDto(message.value);
    //console.log(consumption)
    await this.fiveMinConsumptionAggregatorService.aggregate(consumption,this.client);
  }
}
