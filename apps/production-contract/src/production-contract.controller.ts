import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { ProductionContractDto } from '../dto/production-contract.dto';
import { ProductionContractService } from './production-contract.service';

@Controller()
export class ProductionContractController {
  constructor(private readonly productionContractService: ProductionContractService) {}

  @Post('productioncontract')
  async createContract(@Body() productionContractDto: ProductionContractDto) {
    await this.productionContractService.createContract(productionContractDto);
  }

  @Get('productioncontract')
  findContractData() {
    return this.productionContractService.getAllContracts();
  }


  @Get("productioncontract/client")
  getContractByIdClient(@Query('idClient') idClient: number) {
  return this.productionContractService.getContractByClientId(idClient);
  }
}
