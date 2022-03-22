import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AutarkyDayStorerService } from './autarky-day-storer.service';
import { ClientAutarkyDto } from './dto/client-autarky.dto';
import { DistrictAutarkyDto } from './dto/district-autarky.dto';

@Controller()
export class AutarkyDayStorerController {
  constructor(@Inject('AUTARKY_DAY_STORER_SERVICE') private readonly client: ClientKafka, private readonly autarkyDayStorerService: AutarkyDayStorerService) { }

  @MessagePattern('hour.autarky.client.calculated')
  async clientAutarkyCalculated(@Payload() message) {
    let clientAutarky = new ClientAutarkyDto(
      message.value.clientId,
      message.value.autarky,
      message.value.timestamp
    );
    this.autarkyDayStorerService.onNewClientAutarkyData(clientAutarky, this.client);
  }

  @MessagePattern('hour.autarky.district.calculated')
  async districtAutarkyCalculated(@Payload() message) {
    let districtAutarky = new DistrictAutarkyDto(
      message.value.districtId,
      message.value.autarky,
      message.value.timestamp
    );
    this.autarkyDayStorerService.onNewDistrictAutarkyData(districtAutarky, this.client);
  }
}
