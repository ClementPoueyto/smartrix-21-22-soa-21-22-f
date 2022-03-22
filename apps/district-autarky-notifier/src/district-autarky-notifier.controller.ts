import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { DistrictAutarkyDto } from 'apps/five-min-autarky-aggregator/src/dto/district-autarky.dto';
import { DistrictAutarkyNotifierService } from './district-autarky-notifier.service';

@Controller()
export class DistrictAutarkyNotifierController {
  constructor(@Inject('DISTRICT_AUTARKY_NOTIFIER_SERVICE') private readonly client: ClientKafka, private readonly districtAutarkyNotifierService: DistrictAutarkyNotifierService) { }

  @MessagePattern('five.min.autarky.district.calculated')
  async districtAutarkyCalculated(@Payload() message) {
    let districtAutarky = new DistrictAutarkyDto(
      message.value.districtId,
      message.value.autarky,
      message.value.timestamp
    );
    this.districtAutarkyNotifierService.onNewDistrictAutarkyData(districtAutarky, this.client);
  }

  @Get('autarky/district/:id')
  async isDistrictInAutarky(@Param() param) {
    return this.districtAutarkyNotifierService.getDistrictStateData(param.id as number);
  }
}
