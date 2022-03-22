import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DayConsumption, DayConsumptionDocument } from 'apps/schema/day-consumption.schema';
import { Model } from 'mongoose';
import { DayConsumptionDto } from './dto/day-consumption.dto';

@Injectable()
export class ConsumptionDayStorerService {

  constructor(@InjectModel(DayConsumption.name) private consumptionModel: Model<DayConsumptionDocument>) { }

  async addDayConsumption(dayConsumptionDto: DayConsumptionDto) {
    var timestamp = new Date(dayConsumptionDto.timestamp.getUTCFullYear(),dayConsumptionDto.timestamp.getUTCMonth(),dayConsumptionDto.timestamp.getUTCDay(),0,0,0,0);
    dayConsumptionDto.timestamp = timestamp;
    var dayConsumption = await this.consumptionModel.findOne({clientId: dayConsumptionDto.clientId, timestamp: dayConsumptionDto.timestamp});
    if(dayConsumption == null || dayConsumption == undefined){
      const createdDayConsumption = new this.consumptionModel(dayConsumptionDto);
      return createdDayConsumption.save();
    }
    else{
      var consumptionByOutlets = dayConsumptionDto.consumptionByOutlet;
      for (var key in (Object.keys( dayConsumptionDto.consumptionByOutlet),Object.keys(dayConsumptionDto.consumptionByOutlet))) {
        consumptionByOutlets[key] = dayConsumptionDto.consumptionByOutlet[key] + dayConsumptionDto.consumptionByOutlet[key];
      }
      dayConsumption.consumptionByOutlet = consumptionByOutlets;
      await dayConsumption.save()
    }
  }  

  
  async getBetweenDates(first: Date, second: Date): Promise<DayConsumption[]> {
    return this.consumptionModel.find({ timestamp: { $gte: first, $lt: second } }
    ).exec()
  }
  async getBetweenDatesByClientId(first: Date, second: Date,clientId:number): Promise<DayConsumption[]> {
    return this.consumptionModel.find({clientId: clientId,
      timestamp: { $gte: first, $lt: second } }
    ).exec()
  }
  async getBetweenDatesByDistrictId(first: Date, second: Date,districtId:number): Promise<DayConsumption[]> {
    return this.consumptionModel.find({
      timestamp: { $gte: first, $lt: second },
      districtId : districtId
    }
    ).exec()
  }

}
