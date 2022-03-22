import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { POPULATION_BY_DISTRICT } from 'apps/utils/data';
import { BalanceByDistrictDto } from './dto/balance-by-district.dto';
import { ProductionRequestDto } from './dto/production-request.dto';
import { ConsumptionAdjustmentRequest } from './dto/consumption-adjustment-requested.dto'

@Injectable()
export class ProductionRequesterService {

  public processBalance(balance: BalanceByDistrictDto, client: ClientKafka) {
    let value = balance.consumption * 0.05;
    // si l'écart est de +15% alors on réduit
    if(balance.balance < 85 && balance.balance > 0 && balance.districtOutletClosed==0){
      client.emit('energy.less.requested', JSON.stringify(new ProductionRequestDto(balance.districtId, value)));
    }
    else if (balance.balance < 85 && balance.balance > 0 && balance.districtOutletClosed>0)
      client.emit('energy.consumption.reopen', JSON.stringify(new ConsumptionAdjustmentRequest(balance.districtId, Math.min(value,balance.districtOutletClosed))));
    // si elle est < 10% on augmente pour rester entre 85% et 90%
    else if (balance.balance > 90 || (balance.balance==0 && balance.consumption>0)){ 
      client.emit('energy.more.requested', JSON.stringify(new ProductionRequestDto(balance.districtId, value)));//on demande d'augmenter
    }
    //console.log(balance.districtId+"|"+balance.maxProduction+" "+balance.production)
    if(balance.maxProduction < balance.production){
      //console.log(balance.maxProduction < balance.production)
      client.emit('energy.consumption.reduce', JSON.stringify(new ConsumptionAdjustmentRequest(balance.districtId, (balance.maxProduction*0.10) )));  }
      console.log("consumption non essential shutdown for district"+balance.districtId)
    }
}
