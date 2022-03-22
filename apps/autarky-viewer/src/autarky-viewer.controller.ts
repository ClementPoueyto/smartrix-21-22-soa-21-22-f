import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AutarkyViewerService } from './autarky-viewer.service';
import { ClientAutarkyDto } from './dto/client-autarky.dto';
import { DistrictAutarkyDto } from './dto/district-autarky.dto';

@Controller()
export class AutarkyViewerController {
  constructor(private readonly autarkyViewerService: AutarkyViewerService) { }

  @MessagePattern('hour.autarky.client.calculated')
  async clientAutarkyCalculated(@Payload() message) {
    let clientAutarky = new ClientAutarkyDto(
      message.value.clientId,
      message.value.autarky,
      message.value.timestamp
    );
    this.autarkyViewerService.addClientHourAutarky(clientAutarky);
  }

  @MessagePattern('hour.autarky.district.calculated')
  async districtAutarkyCalculated(@Payload() message) {
    let districtAutarky = new DistrictAutarkyDto(
      message.value.districtId,
      message.value.autarky,
      message.value.timestamp
    );
    this.autarkyViewerService.addDistrictHourAutarky(districtAutarky);
  }

  @Get('autarky/client/:id')
  async getClientAutarky(@Param() param) {
    return this.autarkyViewerService.getLast24HoursClientAutarky(param.id as number);
  }

  @Get('autarky/district/:id')
  async getDistrictAutarky(@Param() param) {
    return this.autarkyViewerService.getLast24HoursDistrictAutarky(param.id as number);
  }
}
