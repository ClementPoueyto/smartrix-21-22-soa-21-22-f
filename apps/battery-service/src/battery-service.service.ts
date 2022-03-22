import { BatteryStatusDto } from './dto/battery-status.dto';
import { BatteryStatus, BatteryStatusDocument } from './../../schema/battery-status.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsumptionDto } from './dto/consumption.dto';
import { ProductionDto } from './dto/production.dto';

@Injectable()
export class BatteryService {

  constructor(@InjectModel(BatteryStatus.name) private batteryStatusModel: Model<BatteryStatusDocument>) { }

  async updateConsBatteryStatus(cons: ConsumptionDto) {
    let battery = await this.batteryStatusModel.findOne({ clientId: cons.clientId })
    if (battery != null) {
      battery.currentCharge -= cons.consumption
      if (battery.currentCharge < 0) {
        battery.currentCharge = 0;
      }
      await this.batteryStatusModel.findOneAndUpdate({ clientId: cons.clientId }, battery)
    }
    else {
      await this.createBattery(cons.clientId, 0)
    }
  }

  async updateProdBatteryStatus(prod: ProductionDto) {
    let battery = await this.batteryStatusModel.findOne({ clientId: prod.productorId })
    if (battery != null) {
      battery.currentCharge += prod.production
      if (battery.currentCharge > battery.capacity) {
        battery.currentCharge = battery.capacity;
      }
      await this.batteryStatusModel.findOneAndUpdate({ clientId: prod.productorId }, battery)
    }
    else {
      await this.createBattery(prod.productorId, prod.production)
    }
  }

  async createBattery(clientId: number, currentCharge: number) {
    const batteryDto = new BatteryStatusDto({ clientId: clientId, currentCharge: currentCharge > 1000 ? 1000 : currentCharge, capacity: 1000 });
    const createBattery = new this.batteryStatusModel(batteryDto)
    return createBattery.save();
  }

}
