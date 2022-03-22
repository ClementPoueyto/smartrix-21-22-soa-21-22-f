import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ClientDayAutarkyDocument = ClientDayAutarky & Document;

@Schema()
export class ClientDayAutarky {
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

export const ClientDayAutarkySchema = SchemaFactory.createForClass(ClientDayAutarky);
ClientDayAutarkySchema.index({ clientId: 1, timestamp: 1 }, { unique: true });