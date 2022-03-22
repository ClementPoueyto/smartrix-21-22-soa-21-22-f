export class ConsumptionNowRequestedDto {
  readonly id: number;
  readonly idClient: number;
  readonly districtId: number;
  readonly carBattery: number;

  constructor(
    carBattery: number,
    clientId: number,
    districtId: number,
  ) {
    this.idClient = clientId;
    this.districtId=districtId;
    this.carBattery = carBattery;
  }
}
