import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ClientAutarkyState, ClientAutarkyStateDocument } from 'apps/schema/client-autarky-state.schema';
import { Model } from 'mongoose';
import { ClientAutarkyStateDto } from './dto/client-autarky-state.dto';
import { ClientAutarkyDto } from './dto/client-autarky.dto';

@Injectable()
export class ClientAutarkyNotifierService {

  constructor(@InjectModel(ClientAutarkyState.name) private autarkyModel: Model<ClientAutarkyStateDocument>) { }

  public async onNewClientAutarkyData(clientAutarky: ClientAutarkyDto, client: ClientKafka) {
    // on récupère le dernier état connu s'il existe
    let storedState = await this.autarkyModel.findOne({ clientId: clientAutarky.clientId });
    // sinon on stock l'état
    if (storedState === undefined || storedState === null)
      (new this.autarkyModel(new ClientAutarkyStateDto(clientAutarky.clientId, clientAutarky.autarky))).save();
    // si l'état a changé, on stock le nouveau et on emit
    else {
      if (clientAutarky.autarky != storedState.autarky) {
        client.emit('autarky.client.changed', JSON.stringify(clientAutarky));
        storedState.autarky = clientAutarky.autarky;
        storedState.update();
      }
    }
  }

  public async getClientStateData(clientId: number) {
    return await this.autarkyModel.findOne({ clientId: clientId });
  }
}
