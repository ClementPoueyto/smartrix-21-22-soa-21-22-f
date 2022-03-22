export class DistrictAutarkyDto {
    readonly districtId: number;
    readonly autarky: boolean;
    readonly timestamp: Date;

    constructor(districtId: number, autarky: boolean, timestamp: Date) {
        this.districtId = districtId;
        this.autarky = autarky;
        this.timestamp = timestamp;
    }
}