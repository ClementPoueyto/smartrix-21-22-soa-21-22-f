import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientAutarkyStateDocument = ClientAutarkyState & Document;

@Schema()
export class ClientAutarkyState {
    @Prop({ required: true })
    clientId: number;

    @Prop({ required: true })
    autarky: boolean;

    constructor(object) {
        this.clientId = object.clientId;
        this.autarky = object.autarky;
    }
}

export const ClientAutarkyStateSchema = SchemaFactory.createForClass(ClientAutarkyState);
ClientAutarkyStateSchema.index({ clientId: 1 }, { unique: true });