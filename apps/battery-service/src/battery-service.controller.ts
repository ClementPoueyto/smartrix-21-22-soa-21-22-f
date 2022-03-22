import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BatteryService } from './battery-service.service';
import { ConsumptionReceivedDto } from './dto/consumption-received.dto';
import { ConsumptionDto } from './dto/consumption.dto';
import { ProductionDto } from './dto/production.dto';

@Controller()
export class BatteryServiceController {
  constructor(private readonly batteryService: BatteryService) { }

  @MessagePattern('energy.consumed')
  async energyConsumed(@Payload() message) {
    const consumption = new ConsumptionReceivedDto(message.value);
    if (consumption.source === "BATTERY") {
      let totalConso = 0;
      for (let i = 0; i < Object.keys(consumption.consumptionByOutlet).length; i++)
        totalConso += consumption.consumptionByOutlet[i].consumption;
      this.batteryService.updateConsBatteryStatus(new ConsumptionDto(consumption.timestamp, consumption.clientId, consumption.districtId, totalConso));
    }
  }

  @MessagePattern('energy.produced')
  async energyProduced(@Payload() message) {
    var production = new ProductionDto(message.value);
    if (production.supplierType == "CLIENT" && production.destination == "BATTERY") {
      this.batteryService.updateProdBatteryStatus(production)
    }
  }

}
