import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Document } from 'mongoose';

export type HourConsumptionDocument = HourConsumption & Document;

@Schema()
export class HourConsumption {
  @Prop({ required: true })
  clientId: number;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  districtId: number;

  @Prop({ required: true, type: Object})
  consumptionByOutlet: { [outletId: number]: number };
    
  @Prop({ required: true })
  source: "BATTERY" | "GRID" | "SOLAR";

  constructor(object) {
    this.clientId = object.clientId;
    this.timestamp = object.timestamp;
    this.districtId = object.districtId;
    this.consumptionByOutlet = object.consumptionByOutlet;
    this.source = object.source;
  }
}

export const HourConsumptionSchema = SchemaFactory.createForClass(HourConsumption);
HourConsumptionSchema.index({ clientId: 1,timestamp: 1}, { unique: true });
