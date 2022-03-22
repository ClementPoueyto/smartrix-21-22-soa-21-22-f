import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type BatteryStatusDocument = BatteryStatus & Document;

@Schema()
export class BatteryStatus {
  @Prop({ required: true })
  clientId: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  currentCharge: number;
}

export const BatteryStatusSchema =
  SchemaFactory.createForClass(BatteryStatus);
