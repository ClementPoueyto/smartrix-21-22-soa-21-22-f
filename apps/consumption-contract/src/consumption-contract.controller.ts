import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConsumptionContractDto } from '../dto/consumption-contract.dto';
import { ConsumptionContractService } from './consumption-contract.service';

@Controller()
export class ConsumptionContractController {
  constructor(private readonly consumptionContractService: ConsumptionContractService) {}
  @Get()
  async check(){
    return true;
  }
  @Post('consumptioncontract')
  async createContract(@Body() consumptionContractDto: ConsumptionContractDto) {
    await this.consumptionContractService.createContract(consumptionContractDto);
  }

  @Get('consumptioncontract')
  findContractData() {
    return this.consumptionContractService.getAllContracts();
  }


  @Get("consumptioncontract/client")
  getContractByIdClient(@Query('idClient') idClient: number) {
  return this.consumptionContractService.getContractByClientId(idClient);
  }
}
