export class OutletConsumptionDto {
    readonly status: "ESSENTIAL" | "NON_ESSENTIAL" | "CLOSED";
    readonly consumption: number;

    constructor(
        status: "ESSENTIAL" | "NON_ESSENTIAL" | "CLOSED",
        consumption: number
    ) {
        this.status = status;
        this.consumption = consumption;
    }
}