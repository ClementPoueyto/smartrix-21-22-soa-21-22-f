import { Injectable } from '@nestjs/common';
import { ConsumptionRequestedDto } from './dto/consumption-requested.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ProductionRequestDto } from './dto/production-request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { FutureConsumption, FutureConsumptionDocument } from 'apps/schema/future-consumption.schema';
import { ConsumptionDto } from "../../consumption-requester/src/dto/consumption.dto";
import * as moment from 'moment';

import { time } from "cron";
import "moment-timezone/index";
import { OutletConsumptionDto } from "../../house/src/dto/outlet-consumption.dto";

@Injectable()
export class ConsumptionRequestedListenerService {
  constructor(
    @InjectModel(FutureConsumption.name)
    private FutureConsumptionModel: Model<FutureConsumptionDocument>, private http: HttpService) { }

  async createFconsumption(
    consumptionRequestedDto: ConsumptionRequestedDto,
  ): Promise<FutureConsumption> {
    const createdFutureConsumption = new this.FutureConsumptionModel(consumptionRequestedDto);
    return createdFutureConsumption.save();
  }





  async getAllSoonRequestedConsumption(client: ClientKafka): Promise<ConsumptionRequestedDto[]> {
    const future_consumptions = this.http.get("http://consumption-requester:3006/futureconsumption").pipe(map(response => response.data))
    const f_consumptionResult = await firstValueFrom(future_consumptions)

    var date = moment(new Date()).tz('Europe/Paris')
    const hour = date.hour()
    var res: ConsumptionRequestedDto[] = []
    for (let i = 0; i < f_consumptionResult.length; i++) {
      if (f_consumptionResult[i]["beg_hour"] - 1 <= hour && hour < f_consumptionResult[i]["beg_hour"]) {
        var consumption = new ConsumptionRequestedDto(f_consumptionResult[i]["consumption"], f_consumptionResult[i]["clientId"], f_consumptionResult[i]["districtId"], f_consumptionResult[i]["beg_hour"], f_consumptionResult[i]["end_hour"])

        res.push(consumption);
       // console.log(consumption)

      }
    }
    res.forEach(cr => {
      client.emit('energy.more.requested', JSON.stringify(new ProductionRequestDto(cr.districtId, cr.consumption)));
      console.log(cr.districtId + "," + cr.consumption)
    })

    return res;
  }




}
