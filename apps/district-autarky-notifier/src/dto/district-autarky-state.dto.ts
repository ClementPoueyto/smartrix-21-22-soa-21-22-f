export class DistrictAutarkyStateDto {
    readonly districtId: number;
    readonly autarky: boolean;

    constructor(districtId: number, autarky: boolean) {
        this.districtId = districtId;
        this.autarky = autarky;
    }
}