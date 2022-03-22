import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { BalanceByDistrictDto } from './dto/balance-by-district.dto';
import { ProductionRequesterService } from './production-requester.service';

@Controller()
export class ProductionRequesterController {
  constructor(@Inject('PRODUCTION_REQUESTER_SERVICE') private readonly client: ClientKafka, private readonly productionRequesterService: ProductionRequesterService) { }

  @MessagePattern('balance.calculated.bydistrict')
  async balanceCalculatedByDistrict(@Payload() message) {
    this.productionRequesterService.processBalance(new BalanceByDistrictDto(message.value), this.client);
  }
}
