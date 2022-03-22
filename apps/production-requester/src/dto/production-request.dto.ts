export class ProductionRequestDto {
    readonly districtId: number;
    readonly request: number;

    constructor(districtId: number, request: number) {
        this.districtId = districtId;
        this.request = request;
    }
}