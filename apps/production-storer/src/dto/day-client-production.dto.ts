export class DayClientProductionDto {
  productorId: number;

  timestamp: Date;

  supplierType: string;

  districtId: number;

  productionGrid: number;

  productionBattery: number;


  constructor(object) {
    this.productorId = object.productorId;
    this.timestamp = object.timestamp;
    this.districtId = object.districtId;
    this.supplierType = object.supplierType;
    this.productionGrid = 0
    this.productionBattery = 0
  }
}