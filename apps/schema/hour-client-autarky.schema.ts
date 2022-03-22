import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ClientHourAutarkyDocument = ClientHourAutarky & Document;

@Schema()
export class ClientHourAutarky {
    @Prop({ required: true })
    clientId: number;

    @Prop({ required: true })
    autarky: boolean;

    @Prop({ required: true })
    timestamp: Date;

    constructor(object) {
        this.clientId = object.clientId;
        this.autarky = object.autarky;
        this.timestamp = object.timestamp;
    }
}

export const ClientHourAutarkySchema = SchemaFactory.createForClass(ClientHourAutarky);
ClientHourAutarkySchema.index({ clientId: 1, timestamp: 1 }, { unique: true });