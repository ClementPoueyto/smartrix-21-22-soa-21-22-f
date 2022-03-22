import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Document } from 'mongoose';

export type ClientInvoiceDocument = ClientInvoice & Document;

@Schema()
export class ClientInvoice {
    @Prop({ required: true })
    idClient: number;

    @Prop({ required: true })
    consumption: number;

    @Prop({ required: true })
    price: number;

    @Prop({required  : true})
    earn : number

    @Prop({ required: true })
    month: number;

    @Prop({ required: true })
    year: number;

    constructor(idClient, consumption, price, month, year, earn) {
        this.idClient=idClient
        this.consumption = consumption
        this.price = price
        this.month=month
        this.year = year
        this.earn = earn
    }
}

export const ClientInvoiceSchema = SchemaFactory.createForClass(ClientInvoice);