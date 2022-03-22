export class ConsumptionRequestedDto {
  readonly id: number;
  readonly idClient: number;
  readonly districtId: number;
  readonly consumption: number;
  readonly beg_hour: number;
  readonly end_hour: number;

  constructor(
    consumption: number,
    clientId: number,
    districtId: number,
    beg_hour: number,
    end_hour: number,
  ) {
    this.idClient = clientId;
    this.districtId=districtId;
    this.beg_hour = beg_hour;
    this.end_hour = end_hour;
    this.consumption = consumption;
  }
}
