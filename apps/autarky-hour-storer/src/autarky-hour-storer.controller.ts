import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AutarkyHourStorerService } from './autarky-hour-storer.service';
import { ClientAutarkyDto } from './dto/client-autarky.dto';
import { DistrictAutarkyDto } from './dto/district-autarky.dto';

@Controller()
export class AutarkyHourStorerController {
  constructor(@Inject('AUTARKY_HOUR_STORER_SERVICE') private readonly client: ClientKafka, private readonly autarkyHourStorerService: AutarkyHourStorerService) { }

  @MessagePattern('five.min.autarky.client.calculated')
  async clientAutarkyCalculated(@Payload() message) {
    let clientAutarky = new ClientAutarkyDto(
      message.value.clientId,
      message.value.autarky,
      message.value.timestamp
    );
    this.autarkyHourStorerService.onNewClientAutarkyData(clientAutarky, this.client);
  }

  @MessagePattern('five.min.autarky.district.calculated')
  async districtAutarkyCalculated(@Payload() message) {
    let districtAutarky = new DistrictAutarkyDto(
      message.value.districtId,
      message.value.autarky,
      message.value.timestamp
    );
    this.autarkyHourStorerService.onNewDistrictAutarkyData(districtAutarky, this.client);
  }
}
