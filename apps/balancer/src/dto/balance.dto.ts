export class BalanceDto {
    readonly consumption: number;
    readonly production: number;
    readonly balance: number;

    constructor(consumption: number, production: number, balance: number) {
        this.consumption = consumption;
        this.production = production;
        this.balance = balance;
    }
}