import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type DistrictDayAutarkyDocument = DistrictDayAutarky & Document;

@Schema()
export class DistrictDayAutarky {
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

export const DistrictDayAutarkySchema = SchemaFactory.createForClass(DistrictDayAutarky);
DistrictDayAutarkySchema.index({ districtId: 1, timestamp: 1 }, { unique: true });