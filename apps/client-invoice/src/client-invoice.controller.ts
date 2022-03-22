import { Controller, Get, Post, Query } from '@nestjs/common';
import { ClientInvoiceService } from './client-invoice.service';

@Controller()
export class ClientInvoiceController {
  constructor(private readonly clientInvoiceService: ClientInvoiceService) {}

  @Get()
  getHello(): string {
    return this.clientInvoiceService.getHello();
  }

  @Get("invoice/client")
  getStatsOfDistrict(@Query('year') year: number,@Query('month') month:number, @Query('idClient') idClient:number) {
    
    return month!=null?this.clientInvoiceService.getInvoicesByMonth(year, month, idClient):this.clientInvoiceService.getInvoicesByYear(year, idClient);
  }

  @Post("invoice/month")
  updateClientInvoices(@Query('month') month:number, @Query('year') year:number) {
    return this.clientInvoiceService.updateClientInvoice(month, year);
  }

  @Post("invoice/year")
  updateAllClientInvoices(@Query('year') year:number) {
    return this.clientInvoiceService.updateAllClientInvoiceByYear(year);
  }

  @Get('invoice/predict')
  predictInvoiceClient(@Query('idClient') idClient:number, @Query('month') month:number, @Query('year') year:number, @Query('day') day:number){
    return this.clientInvoiceService.predictInvoice(idClient, month, year, day);
  }
}
