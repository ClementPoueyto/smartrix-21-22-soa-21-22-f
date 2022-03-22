import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConsumptionDto } from './dto/consumption.dto';
import { OutletConsumptionDto } from './dto/outlet-consumption.dto';

@Injectable()
export class FiveMinConsumptionAggregatorService {
  min_steps = 5;
  map = new Map<number,ConsumptionDto>();
  firstTimestamp:Date = null;

  async aggregate(createConsumptionDto: ConsumptionDto,client: ClientKafka){
    if(this.firstTimestamp === null){
      this.firstTimestamp = new Date(createConsumptionDto.timestamp);
      var addMin = this.firstTimestamp.getMinutes()%this.min_steps;
      addMin = addMin===0?this.min_steps:addMin;
      this.firstTimestamp.setMinutes(this.firstTimestamp.getMinutes()+addMin,0,0);
      addMin = undefined
    }
    this.addToMap(createConsumptionDto);
    if(this.firstTimestamp.getTime() < createConsumptionDto.timestamp.getTime()){
     this.sendAndClearMap(client);
    }
  }

  addToMap(consumptionDto:ConsumptionDto){
    if(this.map.has(consumptionDto.clientId)){
      var test:{ [outletId: number]: OutletConsumptionDto } = {};
      var consumption: ConsumptionDto = this.map.get(consumptionDto.clientId);
      for(var k in (Object.keys(consumption.consumptionByOutlet),Object.keys(consumptionDto.consumptionByOutlet))){
        test[k] = new OutletConsumptionDto(consumptionDto.consumptionByOutlet[k].status,consumptionDto.consumptionByOutlet[k].consumption+consumption.consumptionByOutlet[k].consumption);
      }

      consumption.consumptionByOutlet = test;
      this.map.set(consumptionDto.clientId,consumption);
      test = undefined
      consumption = undefined
    }
    else{
      consumptionDto.timestamp = this.firstTimestamp;
      this.map.set(consumptionDto.clientId, consumptionDto);
    }
  }

  async sendAndClearMap(client:ClientKafka){
    var array =  Array.from(this.map.values())
    array.forEach(value =>{
      client.emit('five.min.energy.consumed',JSON.stringify(value))
    })
    this.map.clear();
    this.firstTimestamp = null;
    array = undefined
  }
}
