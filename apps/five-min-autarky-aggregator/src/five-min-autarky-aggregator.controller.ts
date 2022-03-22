import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ClientAutarkyDto } from './dto/client-autarky.dto';
import { DistrictAutarkyDto } from './dto/district-autarky.dto';
import { FiveMinAutarkyAggregatorService } from './five-min-autarky-aggregator.service';

@Controller()
export class FiveMinAutarkyAggregatorController {
  constructor(@Inject('FIVE_MIN_AUTARKY_AGGREGATOR_SERVICE') private readonly client: ClientKafka, private readonly fiveMinAutarkyAggregatorService: FiveMinAutarkyAggregatorService) { }

  @MessagePattern('autarky.client.calculated')
  async clientAutarkyCalculated(@Payload() message) {
    let clientAutarky = new ClientAutarkyDto(
      message.value.clientId,
      message.value.autarky,
      message.value.timestamp
    );
    this.fiveMinAutarkyAggregatorService.setClientAutarky(clientAutarky, this.client);
  }

  @MessagePattern('autarky.district.calculated')
  async districtAutarkyCalculated(@Payload() message) {
    let districtAutarky = new DistrictAutarkyDto(
      message.value.districtId,
      message.value.autarky,
      message.value.timestamp
    );
    this.fiveMinAutarkyAggregatorService.setDistrictAutarky(districtAutarky, this.client);
  }
}
