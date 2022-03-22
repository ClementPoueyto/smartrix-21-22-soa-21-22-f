export class ProductioRequestDto {
    readonly districtId: number;
    readonly request: number;

    constructor(object) {
        this.districtId = object.districtId;
        this.request = object.request;
    }
}