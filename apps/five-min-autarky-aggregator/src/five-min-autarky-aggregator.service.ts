import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Mutex } from 'async-mutex';
import { ClientAutarkyDto } from './dto/client-autarky.dto';
import { DistrictAutarkyDto } from './dto/district-autarky.dto';

@Injectable()
export class FiveMinAutarkyAggregatorService {
  private clientAutarkyByClientId: { [clientId: number]: { timestamp: Date, autarky: boolean } } = {}
  private districtAutarkyByDistrictId: { [districtId: number]: { timestamp: Date, autarky: boolean } } = {}
  private clientMutex = new Mutex();
  private districtMutex = new Mutex();

  /**
   * Ajoute une nouvelle donnée d'autarcie
   * @param clientAutarky 
   * @param client 
   */
  public async setClientAutarky(clientAutarky: ClientAutarkyDto, client: ClientKafka) {
    const release = await this.clientMutex.acquire();
    try {
      // si on a pas de données alors on stock une nouvelle
      if (this.clientAutarkyByClientId[clientAutarky.clientId] === undefined)
        this.clientAutarkyByClientId[clientAutarky.clientId] = {
          timestamp: new Date(clientAutarky.timestamp),
          autarky: clientAutarky.autarky
        }
      else {
        let storedData = this.clientAutarkyByClientId[clientAutarky.clientId];
        // on ne peut modifier la valeur de l'autarcy que pour la rendre NOT_AUTARCY, on est en autarcie sur 5min que si on l'est tout le temps
        if (storedData.autarky)
          storedData.autarky = clientAutarky.autarky;
        this.clientAutarkyByClientId[clientAutarky.clientId] = storedData;

        // on vérifie si la data est pas plus vielle de 5min
        let timeDelta = new Date(clientAutarky.timestamp).valueOf() - new Date(storedData.timestamp).valueOf();
        // si c'est le cas on emit l'autarcie et on reset
        if (timeDelta >= 300000) {
          client.emit('five.min.autarky.client.calculated', JSON.stringify(new ClientAutarkyDto(
            clientAutarky.clientId,
            storedData.autarky,
            clientAutarky.timestamp
          )));
          this.clientAutarkyByClientId[clientAutarky.clientId] = undefined;
        }
      }
    }
    finally {
      release();
    }
  }

  public async setDistrictAutarky(districtAutarky: DistrictAutarkyDto, client: ClientKafka) {
    const release = await this.districtMutex.acquire();
    try {
      // si on a pas de données alors on stock une nouvelle
      if (this.districtAutarkyByDistrictId[districtAutarky.districtId] === undefined)
        this.districtAutarkyByDistrictId[districtAutarky.districtId] = {
          timestamp: new Date(districtAutarky.timestamp),
          autarky: districtAutarky.autarky
        }
      else {
        let storedData = this.districtAutarkyByDistrictId[districtAutarky.districtId];
        // on ne peut modifier la valeur de l'autarcy que pour la rendre NOT_AUTARCY, on est en autarcie sur 5min que si on l'est tout le temps
        if (storedData.autarky)
          storedData.autarky = districtAutarky.autarky;
        this.districtAutarkyByDistrictId[districtAutarky.districtId] = storedData;

        // on vérifie si la data est pas plus vielle de 5min
        let timeDelta = new Date(districtAutarky.timestamp).valueOf() - new Date(storedData.timestamp).valueOf();
        // si c'est le cas on emit l'autarcie et on reset
        if (timeDelta >= 300000) {
          client.emit('five.min.autarky.district.calculated', JSON.stringify(new DistrictAutarkyDto(
            districtAutarky.districtId,
            storedData.autarky,
            districtAutarky.timestamp
          )));
          this.districtAutarkyByDistrictId[districtAutarky.districtId] = undefined;
        }
      }
    }
    finally {
      release();
    }
  }
}
