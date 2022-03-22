/* eslint-disable prettier/prettier */
import { Controller, Get, Inject, OnModuleInit, Param, Query } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumptionStorerService } from './consumption-storer.service';
import { FiveMinConsumptionDto } from './dto/five-min-consumption.dto';

@Controller()
export class ConsumptionStorerController implements OnModuleInit {
  constructor(@Inject('HOUR_STORER_SERVICE') private readonly client: ClientKafka, private readonly consumptionStorerService: ConsumptionStorerService) { }
  onModuleInit() {
    this.client.connect();
  }
  @MessagePattern('five.min.energy.consumed')
  async addhourConsumption(@Payload() message) {
    const consumption = new FiveMinConsumptionDto(message.value);
    //console.log(JSON.stringify(consumption))
    await this.consumptionStorerService.addhourConsumption(consumption, this.client);
  }

  @Get('allHourConsumption/:id')
  findByClientId(@Param() param) {
    return this.consumptionStorerService.getAllhourConsumptionByClientId(param.id);
  }

  @Get('allHourConsumption')
  findConsumptionData() {
    return this.consumptionStorerService.getAllhourConsumption();
  }

  @Get('hourConsumption')
  getConsumptionOfDay(
    @Query('firstDate') first: Date,
    @Query('secondDate') second: Date,
    @Query('clientId') clientId: number
  ) {
    if (clientId) {
      return this.consumptionStorerService.getBetweenDatesByClientId(first, second, clientId);
    } else {
      return this.consumptionStorerService.getBetweenDates(first, second);
    }
  }

  @Get("hourConsumption/district")
  getConsumptionOfDistrict(
    @Query('firstDate') first: Date,
    @Query('secondDate') second: Date,
    @Query('districtid') districtId: number) {
    return this.consumptionStorerService.getBetweenDatesByDistrictId(first, second, districtId);
  }

}
