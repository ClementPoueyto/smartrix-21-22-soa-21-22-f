import { OutletConsumptionDto } from "../../../house/src/dto/outlet-consumption.dto";

export class ConsumptionDto {
    readonly timestamp: Date;
    readonly clientId: number;
    readonly districtId: number;
    readonly consumptionByOutlet: { [outletId: number]: OutletConsumptionDto };
    readonly source: "BATTERY" | "GRID" | "SOLAR";

    constructor(timestamp: Date, clientId: number, districtId: number, consumptionByOutlet: { [outletId: number]: OutletConsumptionDto }, source: "BATTERY" | "GRID" | "SOLAR") {
        this.timestamp = timestamp;
        this.clientId = clientId;
        this.districtId = districtId;
        this.consumptionByOutlet = consumptionByOutlet;
        this.source = source;
    }
}
