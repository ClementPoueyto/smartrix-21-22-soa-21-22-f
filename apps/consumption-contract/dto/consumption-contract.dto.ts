export class ConsumptionContractDto {
    readonly id : number;
    readonly idClient :  number;
    readonly districtId: number;
    readonly beg_date : Date;
    readonly end_date : Date;
    readonly price_KW : number;
  }