import { FiveMinConsumptionDto } from "./five-min-consumption.dto";

export class HourConsumptionDto {
  timestamp: Date;
  readonly clientId: number;
  readonly districtId: number;
  consumptionByOutlet: { [outletId: number]: number };
  readonly source: "BATTERY" | "GRID" | "SOLAR";

  constructor(five: FiveMinConsumptionDto, timestamp: Date, consumptionByOutlet: { [outletId: number]: number }) {
    this.clientId = five.clientId;
    this.timestamp = new Date(timestamp);
    this.districtId = five.districtId;
    this.consumptionByOutlet = consumptionByOutlet;
    this.source = five.source;
  }

  static createHoursFromFive(five: FiveMinConsumptionDto, timestamp: Date){
    var consumptionByOutlet:{ [outletId: number]: number } = {};
    for(var key in Object.keys(five.consumptionByOutlet)){
      consumptionByOutlet[key] = five.consumptionByOutlet[key].consumption;
    }
    return new HourConsumptionDto(five,timestamp,consumptionByOutlet);
  }
}