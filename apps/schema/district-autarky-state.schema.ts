import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DistrictAutarkyStateDocument = DistrictAutarkyState & Document;

@Schema()
export class DistrictAutarkyState {
    @Prop({ required: true })
    districtId: number;

    @Prop({ required: true })
    autarky: boolean;

    constructor(object) {
        this.districtId = object.districtId;
        this.autarky = object.autarky;
    }
}

export const DistrictAutarkyStateSchema = SchemaFactory.createForClass(DistrictAutarkyState);
DistrictAutarkyStateSchema.index({ districtId: 1 }, { unique: true });