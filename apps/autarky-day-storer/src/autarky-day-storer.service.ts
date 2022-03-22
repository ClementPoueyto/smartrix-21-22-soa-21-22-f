import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ClientDayAutarky, ClientDayAutarkyDocument } from 'apps/schema/day-client-autarky.schema';
import { Model } from 'mongoose';
import { ClientAutarkyDto } from './dto/client-autarky.dto';
import * as moment from 'moment';
import 'moment-timezone';
import { Mutex } from 'async-mutex';
import { DistrictDayAutarky, DistrictDayAutarkyDocument } from 'apps/schema/day-district-autarky.schema';
import { DistrictAutarkyDto } from './dto/district-autarky.dto';

@Injectable()
export class AutarkyDayStorerService {
  private clientMutex = new Mutex();
  private districtMutex = new Mutex();

  constructor(@InjectModel(ClientDayAutarky.name) private clientAutarkyModel: Model<ClientDayAutarkyDocument>,
    @InjectModel(DistrictDayAutarky.name) private districtAutarkyModel: Model<DistrictDayAutarkyDocument>
  ) { }

  public async onNewClientAutarkyData(clientAutarky: ClientAutarkyDto, client: ClientKafka) {
    const release = await this.clientMutex.acquire();
    try {
      // on récupère le timestamp du jour
      let date = moment(new Date(clientAutarky.timestamp));
      date = date.milliseconds(0);
      date = date.seconds(0);
      date = date.minutes(0);
      date = date.hours(0);

      // on regarde s'il existe déjà des données pour ce jour
      let storedAutarky = await this.clientAutarkyModel.findOne({ clientId: clientAutarky.clientId, timestamp: date.toDate() });

      // s'il n'y a pas de donnés
      if (storedAutarky == undefined || storedAutarky == null) {
        // alors on stock
        (new this.clientAutarkyModel(new ClientAutarkyDto(clientAutarky.clientId, clientAutarky.autarky, date.toDate()))).save();
        // puis on vérifie s'il n'y pas des données pour le jour précèdent

        let prevAutarky = await this.clientAutarkyModel.findOne({ clientId: clientAutarky.clientId, timestamp: { $lt: date.toDate() } });
        // si on a des données pour le jour précèdent alors c'est qu'on est passé à un autre jour
        if (prevAutarky !== undefined && prevAutarky !== null) {
          // alors on emit
          client.emit('day.autarky.client.calculated', JSON.stringify(new ClientAutarkyDto(prevAutarky.clientId, prevAutarky.autarky, prevAutarky.timestamp)));
        }
      }

      // sinon on regarde si les données doivent être mise à jour
      else {
        if (storedAutarky.autarky) {
          storedAutarky.autarky = clientAutarky.autarky;
          storedAutarky.update();
        }
      }
    } finally {
      release();
    }
  }

  public async onNewDistrictAutarkyData(districtAutarky: DistrictAutarkyDto, client: ClientKafka) {
    const release = await this.districtMutex.acquire();
    try {
      // on récupère le timestamp du jour
      let date = moment(new Date(districtAutarky.timestamp));
      date = date.milliseconds(0);
      date = date.seconds(0);
      date = date.minutes(0);
      date = date.hours(0);

      // on regarde s'il existe déjà des données pour ce jour
      let storedAutarky = await this.districtAutarkyModel.findOne({ districtId: districtAutarky.districtId, timestamp: date.toDate() });

      // s'il n'y a pas de donnés
      if (storedAutarky == undefined || storedAutarky == null) {
        // alors on stock
        (new this.districtAutarkyModel(new DistrictAutarkyDto(districtAutarky.districtId, districtAutarky.autarky, date.toDate()))).save();
        // puis on vérifie s'il n'y pas des données pour le jour précèdent

        let prevAutarky = await this.districtAutarkyModel.findOne({ districtId: districtAutarky.districtId, timestamp: { $lt: date.toDate() } });
        // si on a des données pour le jour précèdent alors c'est qu'on est passé à un autre jour
        if (prevAutarky !== undefined && prevAutarky !== null) {
          // alors on emit
          client.emit('day.autarky.district.calculated', JSON.stringify(new DistrictAutarkyDto(prevAutarky.districtId, prevAutarky.autarky, prevAutarky.timestamp)));
        }
      }

      // sinon on regarde si les données doivent être mise à jour
      else {
        if (storedAutarky.autarky) {
          storedAutarky.autarky = districtAutarky.autarky;
          storedAutarky.update();
        }
      }
    } finally {
      release();
    }
  }
}
