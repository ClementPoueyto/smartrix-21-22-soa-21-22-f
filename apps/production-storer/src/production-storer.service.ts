import { DayClientProductionDto } from './dto/day-client-production.dto';
import { DayClientProduction } from './../../schema/day-client-production.schema';
import { Production, ProductionDocument } from 'apps/schema/production.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductionDto } from './dto/production.dto';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class ProductionStorerService {

  constructor(private httpService: HttpService, @InjectModel(Production.name) private productionModel: Model<ProductionDocument>,
    @InjectModel(DayClientProduction.name) private dayclientproductionModel: Model<DayClientProduction>) {

  }

  async callHttp(url) {
    console.log(url)
    const response$ = this.httpService.get(url).pipe(
      map(response => response.data)
    );

    return await response$;
  }
  async create(createProductionDto: ProductionDto): Promise<ProductionDto> {
    const createdProduction = new this.productionModel(createProductionDto);
    return new ProductionDto(createdProduction.save());
  }

  async createDayProduction() {
    let map: Map<number, DayClientProductionDto> = new Map();
    const today = new Date()
    const timestamp = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const timestamp2 = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1);
    console.log(timestamp)
    console.log(timestamp2)
    const prods = await this.productionModel.find({
      supplierType: "CLIENT", timestamp: {
        $gte: timestamp,
        $lt: timestamp2
      }
    });
    prods.forEach((prod) => {
      let currentProd = map.get(prod.productorId);
      if (currentProd != null) {
        if (prod.destination == "BATTERY") {
          currentProd.productionBattery += prod.production
        }
        else {
          currentProd.productionGrid += prod.production
        }
        map.set(prod.productorId, currentProd)
      }
      else {
        let dayProd = new DayClientProductionDto(prod);
        if (prod.destination == "BATTERY") {
          dayProd.productionBattery = prod.production
        }
        else {
          dayProd.productionGrid = prod.production
        }
        dayProd.timestamp = timestamp;
        console.log(dayProd)
        map.set(prod.productorId, dayProd)
      }
    });
    map.forEach(async (value: DayClientProductionDto, key: number) => {
      await this.dayclientproductionModel.findOneAndUpdate({ productorId: value.productorId, timestamp: timestamp }, new DayClientProduction(value), { upsert: true })
    });

  }

  async getMonthProduction(productorId: number, year: number, month: number) {
    month = month - 1
    const timestamp = new Date(year, month);
    const timestamp2 = new Date(year, month + 1);
    console.log(timestamp)
    console.log(timestamp2)

    const prods = await this.productionModel.find({
      productorId: productorId,
      timestamp: {
        $gte: timestamp,
        $lt: timestamp2
      }
    })
    return prods;
  }

  async getDayProduction(productorId: number, year: number, month: number, day:number) {
    month = month - 1
    const timestamp = new Date(year, month, day);
    const timestamp2 = new Date(year, month, day+1);
    console.log(timestamp)
    console.log(timestamp2)

    const prods = await this.productionModel.find({
      productorId: productorId,
      timestamp: {
        $gte: timestamp,
        $lt: timestamp2
      }
    })
    return prods;
  }
/*
  async getTotalMonthProduction(productorId: number, year: number, month: number) {
    const prods = await this.getMonthProduction(productorId, year, month);
    let monthproduction = { productorId: Number(productorId), productionBattery: 0, productionGrid: 0 }
    prods.forEach((res) => {
      monthproduction.productionBattery += res.productionBattery
      monthproduction.productionGrid += res.productionGrid

    })
    return monthproduction
  }
*/

}
