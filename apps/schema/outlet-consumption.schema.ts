import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OutletConsumptionDocument = OutletConsumption & Document;

@Schema()
export class OutletConsumption {
  @Prop({ required: true })
  status: "ESSENTIAL" | "NON_ESSENTIAL" | "CLOSED";

  @Prop({ required: true })
  consumption: number;

  constructor(object) {
    this.status = object.status;
    this.consumption = object.consumption;
  }
}

export const OutletConsumptionSchema = SchemaFactory.createForClass(OutletConsumption);
