import { ProductionContractDto } from './../production-contract/dto/production-contract.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductionContractDocument = ProductionContract & Document;

@Schema()
export class ProductionContract {
  @Prop({ required: true })
  idClient: number;

  @Prop({required: true})
  districtId:number;

  @Prop({ required: true })
  beg_date: Date;
  
  @Prop({ required: true })
  end_date:Date;

  @Prop({ required:true })
  price_KW:number;

  constructor(object: ProductionContractDto){
    this.idClient = object.idClient
    this.districtId = object.districtId
    this.beg_date = object.beg_date
    this.end_date = object.end_date
    this.price_KW = object.price_KW

  }

}

export const ProductionContractSchema = SchemaFactory.createForClass(ProductionContract);