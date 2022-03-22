import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { HourConsumption, HourConsumptionDocument } from 'apps/schema/hour-consumption.schema';
import { Model } from 'mongoose';
import { emit } from 'process';
import { FiveMinConsumptionDto } from './dto/five-min-consumption.dto';
import { HourConsumptionDto } from './dto/hour-consumption.dto';

@Injectable()
export class ConsumptionStorerService {

  lastTimestamp:Date; 

  constructor(@InjectModel(HourConsumption.name) private consumptionModel: Model<HourConsumptionDocument>) { }

  async addhourConsumption(fiveConsumptionDto:FiveMinConsumptionDto,client: ClientKafka): Promise<HourConsumption> {
    var timestamp = new Date(fiveConsumptionDto.timestamp.getUTCFullYear(),fiveConsumptionDto.timestamp.getUTCMonth(),fiveConsumptionDto.timestamp.getUTCDay(),fiveConsumptionDto.timestamp.getUTCHours());
    var hourConsumptionDto = HourConsumptionDto.createHoursFromFive(fiveConsumptionDto,timestamp);
    var hourConsumption = await this.consumptionModel.findOne({clientId: hourConsumptionDto.clientId, timestamp: hourConsumptionDto.timestamp});
    if(hourConsumption == null || hourConsumption == undefined){
      const createdhourConsumption = new this.consumptionModel(hourConsumptionDto);
      return createdhourConsumption.save();
    }
    else{
      var consumptionByOutlets = hourConsumptionDto.consumptionByOutlet;
      for (var key in (Object.keys( hourConsumption.consumptionByOutlet),Object.keys(hourConsumptionDto.consumptionByOutlet))) {
        consumptionByOutlets[key] = hourConsumption.consumptionByOutlet[key] + hourConsumptionDto.consumptionByOutlet[key];
      }
      hourConsumption.consumptionByOutlet = consumptionByOutlets;
      await hourConsumption.save()
    }
    this.emitHour(timestamp,client);
  }

  async emitHour(timestamp: Date, client: ClientKafka){
    if(this.lastTimestamp == null){
      this.lastTimestamp = new Date(timestamp);
    }
    if(this.lastTimestamp.getTime()<timestamp.getTime()){
      var hourConsumption = await this.consumptionModel.find({timestamp:  this.lastTimestamp}).exec();
      hourConsumption.forEach(consumption =>      
         client.emit("hour.energy.consumed",JSON.stringify(consumption)))
      this.lastTimestamp = timestamp;
      hourConsumption = undefined
    }
  }

  async getAllhourConsumptionByClientId(Id: number){
    const consumption = await this.consumptionModel.find({clientId: Id}).exec();
    return consumption!=null;
  }

  async getAllhourConsumption() {
    const consumption = await this.consumptionModel.find().exec()
    return consumption;
  }

  async getBetweenDates(first: Date, second: Date): Promise<HourConsumption[]> {
    return this.consumptionModel.find({ timestamp: { $gte: first, $lt: second } }
    ).exec()
  }
  async getBetweenDatesByClientId(first: Date, second: Date,clientId:number): Promise<HourConsumption[]> {
    return this.consumptionModel.find({clientId: clientId,
      timestamp: { $gte: first, $lt: second } }
    ).exec()
  }
  async getBetweenDatesByDistrictId(first: Date, second: Date,districtId:number): Promise<HourConsumption[]> {
    return this.consumptionModel.find({
      timestamp: { $gte: first, $lt: second },
      districtId : districtId
    }
    ).exec()
  }
  
}
