import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductionDocument = Production & Document;

@Schema()
export class Production {

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  productorId: number;

  @Prop({ required: true })
  districtId: number;

  @Prop({ required: true })
  supplierType: string;

  @Prop({ required: true })
  production: number;

  @Prop({ required: true })
  destination: string


  constructor(object) {
    this.productorId = object.productorId;
    this.timestamp = object.timestamp;
    this.districtId = object.districtId;
    this.supplierType = object.supplierType;
    this.production = object.production;
    this.destination = object.destination
  }
}

export const ProductionSchema = SchemaFactory.createForClass(Production);
