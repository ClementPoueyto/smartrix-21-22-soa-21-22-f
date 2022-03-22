export class ProductionDto {
    readonly timestamp: Date;
    readonly productorId: number;
    readonly districtId: number;
    readonly supplierType = "CLIENT";
    readonly production: number;
    readonly destination: "BATTERY" | "GRID";

    constructor(timestamp: Date, productorId: number, districtId: number, production: number, destination: "BATTERY" | "GRID") {
        this.timestamp = timestamp;
        this.productorId = productorId;
        this.districtId = districtId;
        this.production = production;
        this.destination = destination;
    }
}