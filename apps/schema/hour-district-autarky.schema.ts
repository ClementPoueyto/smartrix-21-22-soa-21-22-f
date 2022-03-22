import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type DistrictHourAutarkyDocument = DistrictHourAutarky & Document;

@Schema()
export class DistrictHourAutarky {
    @Prop({ required: true })
    districtId: number;

    @Prop({ required: true })
    autarky: boolean;

    @Prop({ required: true })
    timestamp: Date;

    constructor(object) {
        this.districtId = object.districtId;
        this.autarky = object.autarky;
        this.timestamp = object.timestamp;
    }
}

export const DistrictHourAutarkySchema = SchemaFactory.createForClass(DistrictHourAutarky);
DistrictHourAutarkySchema.index({ districtId: 1, timestamp: 1 }, { unique: true });