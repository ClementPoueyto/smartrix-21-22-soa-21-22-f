import { Controller, Get, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumptionDayStorerService } from './consumption-day-storer.service';
import { DayConsumptionDto } from './dto/day-consumption.dto';

@Controller()
export class ConsumptionDayStorerController {
  constructor(private readonly consumptionDayStorerService: ConsumptionDayStorerService) {}

  @MessagePattern('hour.energy.consumed')
  async addhourConsumption(@Payload() message) {
    const consumption = new DayConsumptionDto(message.value);
    await this.consumptionDayStorerService.addDayConsumption(consumption);
  }


  @Get('dayConsumption/dates')
  getBetweenDates(
    @Query('firstDate') first: Date,
    @Query('secondDate') second: Date,
    @Query('clientId') clientId: number
  ) {
    if (clientId) {
      return this.consumptionDayStorerService.getBetweenDatesByClientId(first, second, clientId);
    } else {
      return this.consumptionDayStorerService.getBetweenDates(first, second);
    }
  }

  @Get('dayConsumption/dates/district')
  getBetweenDatesByDistricr(
    @Query('firstDate') first: Date,
    @Query('secondDate') second: Date,
    @Query('districtId') districtId: number
  ) {
      return this.consumptionDayStorerService.getBetweenDatesByDistrictId(first, second, districtId);
  }
}
