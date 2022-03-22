import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DayClientProductionDocument = DayClientProduction & Document;

@Schema()
export class DayClientProduction {
  @Prop({ required: true })
  productorId: number;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  supplierType: string;

  @Prop({ required: true })
  districtId: number;

  @Prop({ required: true })
  productionGrid: number;

  @Prop({ required: true })
  productionBattery: number;


  constructor(object) {
    this.productorId = object.productorId;
    this.timestamp = object.timestamp;
    this.districtId = object.districtId;
    this.supplierType = object.supplierType;
    this.productionGrid = object.productionGrid;
    this.productionBattery = object.productionBattery;

  }
}

export const DayClientProductionSchema = SchemaFactory.createForClass(DayClientProduction);
DayClientProductionSchema.index({ productorId: 1, timestamp: 1 }, { unique: true });
