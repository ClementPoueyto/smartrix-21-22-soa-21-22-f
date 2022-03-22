import { ConsumptionContractDto } from './../consumption-contract/dto/consumption-contract.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Document } from 'mongoose';

export type ConsumptionContractDocument = ConsumptionContract & Document;

@Schema()
export class ConsumptionContract {
  @Prop({ required: true })
  idClient: number;

  @Prop({required: true})
  districtId:number;

  @Prop({ required: true })
  beg_date: Date;

  @Prop({ required:true })
  end_date:Date;

  @Prop({ required:true })
  price_KW:number;

  constructor(object : ConsumptionContractDto){
    this.idClient = object.idClient
    this.districtId = object.districtId
    this.beg_date = object.beg_date
    this.end_date = object.end_date
    this.price_KW = object.price_KW
  }

}

export const ConsumptionContractSchema = SchemaFactory.createForClass(ConsumptionContract);