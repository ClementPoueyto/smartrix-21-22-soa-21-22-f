import { Controller, Get, Inject } from '@nestjs/common';
import { ConsumptionRequestedListenerService } from './consumption-requested-listener.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumptionRequestedDto } from './dto/consumption-requested.dto';
import { ProductionRequestDto } from './dto/production-request.dto';
import * as moment from "moment";

@Controller()
export class ConsumptionRequestedListenerController {
  constructor(@Inject('CR_LISTENER_SERVICE') private readonly client: ClientKafka, private readonly consumptionRequestedListenerService: ConsumptionRequestedListenerService) { this.exec() }


  @MessagePattern('energy.requested')
  async createFconsumption(@Payload() message) {
    // await this.consumptionRequestedListenerService.createFconsumption(message);
    console.log(JSON.stringify(message.value))
    var date = moment(new Date()).tz('Europe/Paris')
    const hour = date.hour()
    if (message.value.beg_hour - 1 <= hour && hour <
      message.value.beg_hour) {
      var consumption = new ConsumptionRequestedDto(message.value.consumption, message.value.clientId, message.value.districtId, message.value.beg_hour, message.value.end_hour)
      console.log(consumption)
      this.client.emit('energy.more.requested', JSON.stringify(new ProductionRequestDto(consumption.districtId, consumption.consumption)));
    }
  }





  private async exec() {
    while (true) {
      this.consumptionRequestedListenerService.getAllSoonRequestedConsumption(this.client);
      await new Promise(r => setTimeout(r, 3599999));

    }
  }
}
