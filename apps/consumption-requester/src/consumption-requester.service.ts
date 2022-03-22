import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FutureConsumption,
  FutureConsumptionDocument,
} from '../../schema/future-consumption.schema';
import { Model } from 'mongoose';
import { ConsumptionRequestedDto } from './dto/consumption-requested.dto';
import { firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConsumptionNowRequestedDto } from './dto/consumption-now-requested.dto'
import { ClientKafka } from "@nestjs/microservices";
import * as moment from "moment";
import { ConsumptionDto } from "./dto/consumption.dto";
import "moment-timezone/index";
import { OutletConsumptionDto } from "./dto/outlet-consumption.dto";


@Injectable()
export class ConsumptionRequesterService {


  constructor(@InjectModel(FutureConsumption.name) private FutureConsumptionModel: Model<FutureConsumptionDocument>, private http: HttpService) { }
  //futureConsumptionDto: ConsumptionRequestedDto

  async createFconsumption(futureConsumptionDto: ConsumptionRequestedDto): Promise<FutureConsumption> {
    /*   const url= "http://localhost:3006/futureconsumption";
       const response$=this.httpService.get(url).pipe(
         map(response => response.data)
       );
       const futureconsumption=await firstValueFrom(response$)
       console.log(JSON.stringify(futureconsumption))*/
    //  const createdFutureConsumption = new this.FutureConsumptionModel(futureconsumption);
    const createdFutureConsumption = new this.FutureConsumptionModel(futureConsumptionDto);
    return createdFutureConsumption.save();
  }

  async getAllFutureConsumption() {

    const consumption = await this.FutureConsumptionModel.find().exec()
    return consumption.map(consumption => ({
      id: consumption.id,
      clientId: consumption.idClient,
      consumption: consumption.consumption,
      beg_hour: consumption.beg_hour,
      end_hour: consumption.end_hour,
      districtId: consumption.districtId
    }));
  }
  async chargeAuthorization(carCharger:number, clientId:number,districtId:number,client:ClientKafka){
    const carBattery = new ConsumptionNowRequestedDto(carCharger,clientId,districtId);
    var res = client.send('car.charge.authorization',JSON.stringify(carBattery));
    return res;
  }


  async ConsumeEnergyRequested(client: ClientKafka): Promise<ConsumptionRequestedDto[]> {
    const future_consumptions = this.http.get("http://consumption-requester:3006/futureconsumption").pipe(map(response => response.data))
    const f_consumptionResult = await firstValueFrom(future_consumptions)


    var date = moment(new Date()).tz('Europe/Paris')
    const hour = date.hour()
    var res: ConsumptionRequestedDto[] = []
    for (let i = 0; i < f_consumptionResult.length; i++) {
      // console.log(f_consumptionResult[i])
      if (f_consumptionResult[i]["beg_hour"] <= hour && hour < f_consumptionResult[i]["end_hour"] ) {
        var consumption = new ConsumptionRequestedDto(f_consumptionResult[i]["consumption"], f_consumptionResult[i]["clientId"], f_consumptionResult[i]["districtId"], f_consumptionResult[i]["beg_hour"], f_consumptionResult[i]["end_hour"])

        res.push(consumption);
        //   console.log(consumption)

      }
    }
    res.forEach(cr => {
      this. consumeEnergyBySecond(cr,client);
    })

    return res;
  }

  async consumeEnergyBySecond(consumptionRequestedDto : ConsumptionRequestedDto,client: ClientKafka)
  {
    var number_hour=consumptionRequestedDto.end_hour-consumptionRequestedDto.beg_hour;
    var consumption_by_hour= (consumptionRequestedDto.consumption)/(number_hour*60*60);

    const clientId= consumptionRequestedDto.idClient;
    const districtId= consumptionRequestedDto.districtId;
    let date = moment(new Date()).tz('Europe/Paris');
    const timestamp= new Date(date.format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z')
    var consumption = new ConsumptionDto(timestamp,clientId,districtId,
      {
        0: new OutletConsumptionDto("ESSENTIAL", consumption_by_hour),
        1: new OutletConsumptionDto("NON_ESSENTIAL", 0),
        2: new OutletConsumptionDto("CLOSED", 0)
      },"GRID");
    console.log(JSON.stringify(consumption))
    client.emit('energy.consumed', JSON.stringify(consumption));

  }

}
