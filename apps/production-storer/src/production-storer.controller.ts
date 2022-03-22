import { Controller, Get, Post, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { ProductionDto } from './dto/production.dto';
import { ProductionStorerService } from './production-storer.service';

@Controller('production-storer')
export class ProductionStorerController {
  constructor(private readonly productionStorerService: ProductionStorerService) { }


  @MessagePattern('energy.produced')
  async energyProduced(@Payload() message) {
    const production = new ProductionDto(message.value);
    this.productionStorerService.create(production)
  }

  @Cron('45 * * * * *')
  @Post('update')
  async updateDayProductionData() {
    console.log('update')
    this.productionStorerService.createDayProduction();

  }

  @Get('day')
  async getDayProduction(@Query('year') year: number, @Query('month') month: number, @Query('day') day:number, @Query('productorId') productorId: number) {
    return this.productionStorerService.getDayProduction(productorId, year, month, day)
  }

  @Get('month')
  async getMonthProduction(@Query('year') year: number, @Query('month') month: number, @Query('productorId') productorId: number) {
    return this.productionStorerService.getMonthProduction(productorId, year, month)
  }
  /*
  @Get('month/total')
  async getTotalMonthProduction(@Query('year') year: number, @Query('month') month: number, @Query('productorId') productorId: number) {
    return this.productionStorerService.getTotalMonthProduction(productorId, year, month)
  }*/
}
