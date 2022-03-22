import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ClientAutarkyNotifierService } from './client-autarky-notifier.service';
import { ClientAutarkyDto } from './dto/client-autarky.dto';

@Controller()
export class ClientAutarkyNotifierController {
  constructor(@Inject('CLIENT_AUTARKY_NOTIFIER_SERVICE') private readonly client: ClientKafka, private readonly clientAutarkyNotifierService: ClientAutarkyNotifierService) { }

  @MessagePattern('five.min.autarky.client.calculated')
  async clientAutarkyCalculated(@Payload() message) {
    let clientAutarky = new ClientAutarkyDto(
      message.value.clientId,
      message.value.autarky,
      message.value.timestamp
    );
    this.clientAutarkyNotifierService.onNewClientAutarkyData(clientAutarky, this.client);
  }

  @Get('autarky/client/:id')
  async isClientInAutarky(@Param() param) {
    return this.clientAutarkyNotifierService.getClientStateData(param.id as number);
  }
}
