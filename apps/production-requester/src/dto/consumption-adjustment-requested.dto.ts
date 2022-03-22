export class ConsumptionAdjustmentRequest {
    readonly districtId: number;
    readonly request: number;

    constructor(districtId: number, diminution: number) {
        this.districtId = districtId;
        this.request = diminution;
    }
}