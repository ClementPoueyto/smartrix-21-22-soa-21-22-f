export class ProductionDto {
    readonly timestamp: Date;
    readonly productorId: number;
    readonly districtId: number;
    readonly supplierType: "COMPANY" | "CLIENT";
    readonly production: number;
    readonly destination: "GRID" | "BATTERY";

    constructor(object) {
        this.timestamp = object.timestamp;
        this.districtId = object.districtId;
        this.production = object.production;
        this.productorId = object.productorId;
        this.supplierType = object.supplierType;
        this.destination = object.destination
    }
}