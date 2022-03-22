export class ClientAutarkyStateDto {
    readonly clientId: number;
    readonly autarky: boolean;

    constructor(clientId: number, autarky: boolean) {
        this.clientId = clientId;
        this.autarky = autarky;
    }
}