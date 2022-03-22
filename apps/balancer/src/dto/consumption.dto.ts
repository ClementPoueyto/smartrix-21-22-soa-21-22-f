export class ConsumptionDto {
    readonly timestamp: Date;
    readonly clientId: number;
    readonly districtId: number
    readonly consumption: number;

    constructor(timestamp: Date, clientId: number, districtId: number, consumption: number) {
        this.timestamp = timestamp;
        this.clientId = clientId;
        this.districtId = districtId;
        this.consumption = consumption;
    }
}