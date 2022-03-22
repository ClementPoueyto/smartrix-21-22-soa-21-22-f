import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ClientAutarkyDetectorService } from './client-autarky-detector.service';
import { ClientAutarkyDto } from './dto/client-autarky.dto';
import { ConsumptionReceivedDto } from './dto/consumption-received.dto';
import * as moment from 'moment';
import 'moment-timezone';

@Controller()
export class ClientAutarkyDetectorController {
  private readonly LAP_TIME = 5000;
  private mode: "REAL_TIME" | "MOCK" = "MOCK";
  private timestamp: Date = undefined;

  constructor(@Inject('CLIENT_AUTARKY_DETECTOR_SERVICE') private readonly client: ClientKafka, private readonly clientAutarkyDetectorService: ClientAutarkyDetectorService) {
    this.infiniteExec();
  }

  async exec() {
    let autarkyStatusByClientId = await this.clientAutarkyDetectorService.getAutarkyStatusByClientId();
    for (let i = 0; i < Object.keys(autarkyStatusByClientId).length; i++) {
      let key = Number(Object.keys(autarkyStatusByClientId)[i]);
      this.client.emit('autarky.client.calculated', JSON.stringify(
        new ClientAutarkyDto(key, autarkyStatusByClientId[key].districtId, autarkyStatusByClientId[key].autarky,
          this.mode === "REAL_TIME" ?
            new Date(moment(new Date()).tz('Europe/Paris').format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z') :
            this.timestamp
        )
      ));
    }
  }

  private async infiniteExec() {
    while (this.mode === "REAL_TIME") {
      this.exec();
      await new Promise(r => setTimeout(r, this.LAP_TIME));
    }
  }

  @MessagePattern('energy.consumed')
  async energyConsumed(@Payload() message) {
    let consumption = new ConsumptionReceivedDto(message.value);
    consumption.source === "GRID" ? this.clientAutarkyDetectorService.hasConsumedFromGrid(consumption.clientId, consumption.districtId)
      : this.clientAutarkyDetectorService.hasConsumedFromOther(consumption.clientId, consumption.districtId);
  }

  @MessagePattern('mock.time.changed')
  async mockTimeChanged(@Payload() message) {
    let date = new Date(message.value.timestamp);

    if (this.timestamp === undefined) {
      this.exec();
      this.timestamp = date;
    }

    let delta = date.valueOf() - this.timestamp.valueOf();

    if (delta >= this.LAP_TIME) {
      this.exec();
      this.timestamp = date;
    }
  }

  @Post('/mode')
  async changeMode(@Body() body: { mode: "REAL_TIME" | "MOCK" }) {
    this.mode = body.mode;
    if (this.mode === "REAL_TIME")
      this.infiniteExec();
  }
}
