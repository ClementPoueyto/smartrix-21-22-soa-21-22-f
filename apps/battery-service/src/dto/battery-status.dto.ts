export class BatteryStatusDto {
  readonly clientId: number;
  readonly capacity: number;
  readonly currentCharge: number;


  constructor(object) {
    this.clientId = object.clientId;
    this.capacity = object.capacity;
    this.currentCharge = object.currentCharge;

  }
}