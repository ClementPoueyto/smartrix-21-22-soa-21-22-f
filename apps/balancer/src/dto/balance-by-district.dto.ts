import { BalanceDto } from "./balance.dto";

export class balanceByDistrictDto extends BalanceDto {
    readonly districtId: number;
    readonly maxProduction:number;
    readonly districtOutletClosed:number;
    constructor(consumption: number, production: number, balance: number, districtId: number, maxProduction:number, districtOutletClosed:number) {
        super(consumption, production, balance);
        this.districtId = districtId;
        this.maxProduction = maxProduction;
        this.districtOutletClosed = districtOutletClosed;
    }
}