export class ProductionDto {
    readonly timestamp: Date;
    readonly productorId: number;
    readonly districtId: number;
    readonly supplierType = "COMPANY";
    readonly production: number;
    readonly destination = "GRID";
    readonly maxProduction: number;

    constructor(timestamp: Date, productorId: number, districtId: number, production: number,maxProduction:number) {
        this.timestamp = timestamp;
        this.productorId = productorId;
        this.districtId = districtId;
        this.production = production;
        this.maxProduction= maxProduction;
    }
}