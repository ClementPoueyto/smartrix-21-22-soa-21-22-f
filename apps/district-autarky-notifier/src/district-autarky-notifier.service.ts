import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { DistrictAutarkyState, DistrictAutarkyStateDocument } from 'apps/schema/district-autarky-state.schema';
import { Model } from 'mongoose';
import { DistrictAutarkyStateDto } from './dto/district-autarky-state.dto';
import { DistrictAutarkyDto } from './dto/district-autarky.dto';

@Injectable()
export class DistrictAutarkyNotifierService {

  constructor(@InjectModel(DistrictAutarkyState.name) private autarkyModel: Model<DistrictAutarkyStateDocument>) { }

  public async onNewDistrictAutarkyData(districtAutarky: DistrictAutarkyDto, client: ClientKafka) {
    // on récupère le dernier état connu s'il existe
    let storedState = await this.autarkyModel.findOne({ districtId: districtAutarky.districtId });
    // sinon on stock l'état
    if (storedState === undefined || storedState === null)
      (new this.autarkyModel(new DistrictAutarkyStateDto(districtAutarky.districtId, districtAutarky.autarky))).save();
    // si l'état a changé, on stock le nouveau et on emit
    else {
      if (districtAutarky.autarky != storedState.autarky) {
        client.emit('autarky.district.changed', JSON.stringify(districtAutarky));
        storedState.autarky = districtAutarky.autarky;
        storedState.update();
      }
    }
  }

  public async getDistrictStateData(districtId: number) {
    return await this.autarkyModel.findOne({ districtId: districtId });
  }
}
