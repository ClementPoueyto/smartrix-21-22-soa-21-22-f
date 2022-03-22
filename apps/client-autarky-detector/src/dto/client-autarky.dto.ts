export class ClientAutarkyDto {
    readonly clientId: number;
    readonly districtId: number;
    readonly autarky: boolean;
    readonly timestamp: Date;

    constructor(clientId: number, districtId: number, autarky: boolean, timestamp: Date) {
        this.clientId = clientId;
        this.districtId = districtId;
        this.autarky = autarky;
        this.timestamp = timestamp;
    }
}