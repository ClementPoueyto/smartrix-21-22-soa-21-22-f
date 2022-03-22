export class ClientAutarkyDto {
    readonly clientId: number;
    readonly autarky: boolean;
    readonly timestamp: Date;

    constructor(clientId: number, autarky: boolean, timestamp: Date) {
        this.clientId = clientId;
        this.autarky = autarky;
        this.timestamp = timestamp;
    }
}