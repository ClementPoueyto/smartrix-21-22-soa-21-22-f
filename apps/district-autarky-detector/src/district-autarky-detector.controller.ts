import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { DistrictAutarkyDetectorService } from './district-autarky-detector.service';
import * as moment from 'moment';
import 'moment-timezone';
import { DistrictAutarkyDto } from './dto/district-autarky.dto';
import { ClientAutarkyDto } from './dto/client-autarky.dto';

@Controller()
export class DistrictAutarkyDetectorController {
  private readonly LAP_TIME = 5000;
  private mode: "REAL_TIME" | "MOCK" = "MOCK";
  private timestamp: Date = undefined;

  constructor(@Inject('DISTRICT_AUTARKY_DETECTOR_SERVICE') private readonly client: ClientKafka, private readonly districtAutarkyDetectorService: DistrictAutarkyDetectorService) {
    this.infiniteExec();
  }

  async exec() {
    let autarkyStatusByDistrictId = await this.districtAutarkyDetectorService.getAutarkyStatusByDistrictId();
    for (let i = 0; i < Object.keys(autarkyStatusByDistrictId).length; i++) {
      let key = Number(Object.keys(autarkyStatusByDistrictId)[i]);
      this.client.emit('autarky.district.calculated', JSON.stringify(
        new DistrictAutarkyDto(key, autarkyStatusByDistrictId[key],
          this.mode === "REAL_TIME" ?
            new Date(moment(new Date()).tz('Europe/Paris').format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z') :
            this.timestamp
        )
      ));
    }
  }

  @MessagePattern('autarky.client.calculated')
  async energyConsumed(@Payload() message) {
    let clientAutarky = new ClientAutarkyDto(
      message.value.clientId,
      message.value.districtId,
      message.value.autarky,
      message.value.timestamp
    );
    clientAutarky.autarky ? this.districtAutarkyDetectorService.clientAutarky(clientAutarky.districtId)
      : this.districtAutarkyDetectorService.clientNotAutrky(clientAutarky.districtId);
  }

  private async infiniteExec() {
    while (this.mode === "REAL_TIME") {
      this.exec();
      await new Promise(r => setTimeout(r, this.LAP_TIME));
    }
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
