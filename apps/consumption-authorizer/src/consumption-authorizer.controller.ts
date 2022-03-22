import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumptionAuthorizerService } from './consumption-authorizer.service';
import { BalanceByDistrictDto } from 'apps/production-requester/src/dto/balance-by-district.dto'

@Controller()
export class ConsumptionAuthorizerController {
  getHello(): any {
    return "hello"
  }
  constructor(private readonly consumptionAuthorizerService: ConsumptionAuthorizerService) {}

  @MessagePattern('car.charge.authorization')
  ConsumptionDemandAuthorization(@Payload() message){
    if(this.consumptionAuthorizerService.getAuthorization(message.value.carBattery,message.value.districtId))
      return true;
    else
      return this.consumptionAuthorizerService.findDateOfCharge()
  }

  @MessagePattern('balance.calculated.bydistrict')
  UpdateDistrictBalance(@Payload() message){
    const balance = new BalanceByDistrictDto(message.value)
    this.consumptionAuthorizerService.updateBalance(balance)
  }
}
