import { Injectable } from '@nestjs/common';

import { FiveMinConsumptionDto } from './dto/five-min-consumption.dto';

@Injectable()
export class ConsumptionViewerService {
  consumptions = new Map<number,Array<FiveMinConsumptionDto>>();
  actualHour = null;

  async addConsumption(consumptionDto: FiveMinConsumptionDto){
    if(this.consumptions.has(consumptionDto.clientId)){
      var client_consumptions: FiveMinConsumptionDto[] = this.consumptions.get(consumptionDto.clientId);
      if(consumptionDto.timestamp.getTime()-client_consumptions[0].timestamp.getTime()<3600000 ){
        client_consumptions.push(consumptionDto);
        this.consumptions.set(consumptionDto.clientId,client_consumptions);
      } else {
        client_consumptions.shift();
        client_consumptions.push(consumptionDto);
        this.consumptions.set(consumptionDto.clientId,client_consumptions);
      }
    }
    else{
      var array = new Array();
      array.push(consumptionDto)
      this.consumptions.set(consumptionDto.clientId,[consumptionDto]);
    }
  }

  async getAllConsumption(){
    return Array.from(this.consumptions.values());
  }

  async getAllConsumptionByClientId(id: number){    
    return Array.from(this.consumptions.values()).filter(c => c[0].clientId == id);
    ;
  }

}
