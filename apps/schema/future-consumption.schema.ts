import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type FutureConsumptionDocument = FutureConsumption & Document;

@Schema()
export class FutureConsumption {
  @Prop({ required: true })
  idClient: number;

  @Prop({ required: true })
  districtId: number;

  @Prop({ required: true })
  consumption: number;

  @Prop({ required: true })
  beg_hour: number;

  @Prop({ required: true })
  end_hour: number;
}

export const FutureConsumptionSchema =
  SchemaFactory.createForClass(FutureConsumption);
