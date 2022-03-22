export class BalanceByDistrictDto {
    readonly consumption: number;
    readonly production: number;
    readonly balance: number;
    readonly districtId: number;
    readonly maxProduction:number;
    readonly districtOutletClosed:number;
    constructor(object: any) {
        this.consumption = object.consumption;
        this.production = object.production;
        this.balance = object.balance;
        this.districtId = object.districtId;
        this.maxProduction = object.maxProduction;
        this.districtOutletClosed = object.districtOutletClosed
    }
}