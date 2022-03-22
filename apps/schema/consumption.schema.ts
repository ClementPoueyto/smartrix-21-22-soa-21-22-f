import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OutletConsumption, OutletConsumptionSchema } from './outlet-consumption.schema';

export type ConsumptionDocument = Consumption & Document;

@Schema()
export class Consumption {
  @Prop({ required: true })
  clientId: number;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  districtId: number;

  @Prop({ required: true,  type: Object })
  readonly consumptionByOutlet: { [outletId: number]: OutletConsumption };
    
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

export const ConsumptionSchema = SchemaFactory.createForClass(Consumption);
ConsumptionSchema.index({ clientId: 1, timestamp: 1 }, { unique: true });
