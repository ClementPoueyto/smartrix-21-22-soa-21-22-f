import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get("statistics/actual")
  getActualStat(@Query('clientId') clientId: number) {

    return this.analyticsService.getActualStats(clientId);
  }

  @Get("statistics/day")
  @ApiQuery({ name: 'clientId', required: false })
  getStatsOfDay(@Query('day') day: number, @Query('month') month: number, @Query('year') year: number, @Query('clientId') clientId: number) {
    const date = new Date(year, month-1, day)
    const dateEnd = new Date(date.getFullYear(),date.getMonth(),date.getDate()+1); //-1 mois , = jour 
    return clientId ? this.analyticsService.getStatsOfDayConsumer(date, dateEnd, clientId) : this.analyticsService.getStatsOfDay(date, dateEnd);
  }

  @Get("statistics/month")
  @ApiQuery({ name: 'clientId', required: false })
  getStatsOfMonth(@Query('month') month: number, @Query('year') year: number, @Query('clientId') clientId: number) {
    const date = new Date(year, month, 1);
    const dateEnd = new Date(year, ++month, 1); 
    return clientId ? this.analyticsService.getStatsOfMonthConsumer(date, dateEnd, clientId) : this.analyticsService.getStatsOfMonth(date, dateEnd);
  }

  @Get("statistics/year")
  @ApiQuery({ name: 'clientId', required: false })
  getStatsOfYear(@Query('year') year: number, @Query('clientId') clientId: number) {
    const date = new Date(year, 0, 1);
    const dateEnd = new Date(++year, 0, 1);
    return clientId ? this.analyticsService.getStatsOfYearConsumer(date, dateEnd, clientId) : this.analyticsService.getStatsOfYear(date, dateEnd);
  }

  @Get("statistics/day/district")
  @ApiQuery({ name: 'districtId', required: false })
  getStatsOfDayDistrict(@Query('day') day: number, @Query('month') month: number, @Query('year') year: number, @Query('districtId') districtId: number) {
    const date = new Date(year, month-1, day)
    const dateEnd = new Date(date.getFullYear(),date.getMonth(),date.getDate()+1); //-1 mois , = jour 
    return districtId ? this.analyticsService.getStatsOfDayByDistrict(date, dateEnd, districtId) : this.analyticsService.getStatsOfDayDistricts(date, dateEnd);
  }

  @Get("statistics/month/district")
  @ApiQuery({ name: 'districtId', required: false })
  getStatsOfMonthDistrict(@Query('month') month: number, @Query('year') year: number,  @Query('districtId') districtId: number) {
    const date = new Date(year, month, 1);
    const dateEnd = new Date(year, ++month, 1);
    return districtId ? this.analyticsService.getStatsOfMonthByDistrict(date, dateEnd, districtId) : this.analyticsService.getStatsOfMonthDistricts(date, dateEnd);
  }

  @Get("production/statistics/day")
  @ApiQuery({ name: 'clientId', required: false })
  getStatsProductionOfDay(@Query('day') day: number, @Query('month') month: number, @Query('year') year: number, @Query('clientId') clientId: number) {
    const date = new Date(year, month-1, day)
    const dateEnd = new Date(date.getFullYear(),date.getMonth(),date.getDate()+1); //-1 mois , = jour 
    return clientId ? this.analyticsService.getStatsProductionOfDayConsumer(date, dateEnd, clientId) : this.analyticsService.getStatsProductionOfDay(date, dateEnd);
  }

  @Get("production/statistics/month")
  @ApiQuery({ name: 'clientId', required: false })
  getStatsProductionOfMonth(@Query('month') month: number, @Query('year') year: number, @Query('clientId') clientId: number) {
    const date = new Date(year, month, 1);
    const dateEnd = new Date(year, ++month, 1); 
    return clientId ? this.analyticsService.getStatsProductionOfMonthConsumer(date, dateEnd, clientId) : this.analyticsService.getStatsProductionOfMonth(date, dateEnd);
  }
/*
  @Get("statistics/year")
  @ApiQuery({ name: 'clientId', required: false })
  getStatsProductionOfYear(@Query('year') year: number, @Query('clientId') clientId: number) {
    const date = new Date(year, 0, 1);
    const dateEnd = new Date(++year, 0, 1);
    return clientId ? this.analyticsService.getStatsProductionOfYearConsumer(date, dateEnd, clientId) : this.analyticsService.getStatsProductionOfYear(date, dateEnd);
  }
  */
}
