import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { BalancerService } from './balancer.service';
import { BalanceDto } from './dto/balance.dto';
import { ConsumptionReceivedDto } from './dto/consumption-received.dto';
import { ConsumptionDto } from './dto/consumption.dto';
import { ProductionDto } from './dto/production.dto';

@Controller()
export class BalancerController {
  private readonly LAP_TIME = 5000;
  private mode: "REAL_TIME" | "MOCK" = "MOCK";
  private timestamp: Date = undefined;

  constructor(@Inject('BALANCER_SERVICE') private readonly client: ClientKafka, private readonly balancerService: BalancerService) {
    this.infiniteExec();
  }

  private async exec() {
    let balances = await this.balancerService.getBalances();
    let totalConsumption: number = 0;
    let totalProduction: number = 0;

    balances.forEach(balance => {
      this.client.emit('balance.calculated.bydistrict', JSON.stringify(balance));
      console.log("district=%d | consumption=%d | production=%d | balance=%d% | productionMax=%d  | outletClosed=%d", balance.districtId, balance.consumption, balance.production, balance.balance, balance.maxProduction, balance.districtOutletClosed);

      totalConsumption += balance.consumption;
      totalProduction += balance.production;
    });

    let globalBalance = new BalanceDto(totalConsumption, totalProduction,
      totalConsumption == 0 || totalProduction == 0 ? 0 :
        (totalConsumption * 100) / totalProduction);

    this.client.emit('balance.calculated.global', JSON.stringify(globalBalance));
    console.log("district=GLOBAL | consumption=%d | production=%d | balance=%d%", globalBalance.consumption, globalBalance.production, globalBalance.balance);
  }

  private async infiniteExec() {
    while (this.mode === "REAL_TIME") {
      this.exec();
      await new Promise(r => setTimeout(r, this.LAP_TIME));
    }
  }

  @MessagePattern('energy.consumed')
  async energyConsumed(@Payload() message) {
    let consumption = new ConsumptionReceivedDto(message.value);
    if (consumption.source === "GRID") {
      let totalConso = 0;
      let closedConso = 0;

      for (let i = 0; i < Object.keys(consumption.consumptionByOutlet).length; i++) {
        if (consumption.consumptionByOutlet[i].status === "CLOSED")
          closedConso += consumption.consumptionByOutlet[i].consumption;
        else
          totalConso += consumption.consumptionByOutlet[i].consumption;
      }
      this.balancerService.addConsumption(new ConsumptionDto(consumption.timestamp, consumption.clientId, consumption.districtId, totalConso));
      this.balancerService.addClosedOutlet(new ConsumptionDto(consumption.timestamp, consumption.clientId, consumption.districtId, closedConso));
    }
  }

  @MessagePattern('energy.produced')
  async energyProduced(@Payload() message) {
    let production = new ProductionDto(message.value);
    this.balancerService.addProduction(production);
  }

  @MessagePattern('mock.time.changed')
  async mockTimeChanged(@Payload() message) {
    let date = new Date(message.value.timestamp);

    if (this.timestamp === undefined) {
      this.exec();
      this.timestamp = date;
    }

    let delta = date.valueOf() - this.timestamp.valueOf();

    if (delta >= this.LAP_TIME) {
      this.exec();
      this.timestamp = date;
    }
  }

  @Post('/mode')
  async changeMode(@Body() body: { mode: "REAL_TIME" | "MOCK" }) {
    this.mode = body.mode;
    if (this.mode === "REAL_TIME")
      this.infiniteExec();
  }
}
