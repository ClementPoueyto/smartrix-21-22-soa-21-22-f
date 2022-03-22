import { Injectable } from '@nestjs/common';
import { BalanceByDistrictDto } from 'apps/production-requester/src/dto/balance-by-district.dto';

@Injectable()
export class ConsumptionAuthorizerService {
  findDateOfCharge() {
    let date:Date =  new Date(Date.now())
    if(date.getHours()==21 && date.getMinutes()>30){
      date.setDate( date.getDate() + 1 )
      date.setHours(2)
    }else{
      date.setHours(23,30)
    }
    return date
  }

  balanceByDistrict:Record<number,BalanceByDistrictDto> = {};

  updateBalance(balance: BalanceByDistrictDto) {
    this.balanceByDistrict[balance.districtId]=balance
  }
  getAuthorization(carBattery:number,districtId:number){
    if(this.balanceByDistrict[districtId]===undefined){
      return false
    }
    const res =(this.balanceByDistrict[districtId].consumption/this.balanceByDistrict[districtId].maxProduction)<0.80 || (this.balanceByDistrict[districtId].consumption/this.balanceByDistrict[districtId].maxProduction)<0.90 && carBattery<50
    return res
  }
}
