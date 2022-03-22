import { OutletConsumptionDto } from "./outlet-consumption.dto";

export class ConsumptionDto {
  readonly timestamp: Date;
  readonly clientId: number;
  readonly districtId: number;
  readonly consumptionByOutlet: { [outletId: number]: OutletConsumptionDto };
  readonly source: "BATTERY" | "GRID" | "SOLAR";

  constructor(object) {
    this.clientId = object.clientId;
    this.timestamp = object.timestamp;
    this.districtId = object.districtId;
    this.consumptionByOutlet = object.consumptionByOutlet;
    this.source = object.source;
  }
}