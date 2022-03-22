import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type DayBatteryStatusDocument = DayBatteryStatus & Document;

@Schema()
export class DayBatteryStatus {
  @Prop({ required: true })
  clientId: number;

  @Prop({ required: true })
  consumption : number;

  @Prop({ required: true })
  production : number;

  @Prop({ required: true })
  timestamp: Date;
}

export const DayBatteryStatusSchema =
  SchemaFactory.createForClass(DayBatteryStatus);
