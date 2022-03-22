import { OutletConsumptionDto } from "./outlet-consumption.dto";

export class ConsumptionDto {
  timestamp: Date;
  readonly clientId: number;
  readonly districtId: number;
  consumptionByOutlet: { [outletId: number]: OutletConsumptionDto };
  readonly source: "BATTERY" | "GRID" | "SOLAR";

  constructor(object) {
    this.clientId = object.clientId;
    this.timestamp = new Date(object.timestamp);
    this.districtId = object.districtId;
    this.consumptionByOutlet = object.consumptionByOutlet;
    this.source = object.source;
  }
}