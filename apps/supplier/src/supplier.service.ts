import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Mutex } from 'async-mutex';
import { ProductioRequestDto } from './dto/production-request.dto';
import { ProductionDto } from './dto/production.dto';
import * as moment from 'moment';
import 'moment-timezone';

@Injectable()
export class SupplierService {
  // 14 * districtPopulation
  private energyByDistrictByDay = {
    0: [90000,150000],
    1: [35882,2500000],
    2: [644113,5000000],
    3: [70084,600000]
  }
  private mutex = new Mutex();

  produce(client: ClientKafka) {
    for (let key in Object.keys(this.energyByDistrictByDay)) {
      let district = Number(key);
      let energy = (this.energyByDistrictByDay[key][0] / 24) / 3600;
      let maxProd =  (this.energyByDistrictByDay[key][1] / 24) / 3600;
      let production = new ProductionDto(
        new Date(moment(new Date()).tz('Europe/Paris').format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z'),
        -district,
        district,
        energy,
        maxProd
      );
      client.emit('energy.produced', JSON.stringify(production));
    }
  }

  async produceMore(request: ProductioRequestDto) {
    const release = await this.mutex.acquire();
    try {
      if (Object.keys(this.energyByDistrictByDay).includes(""+request.districtId)) {
        const requestAdaptToDay =  (request.request * 3600) * 24;
        let prodPlusDemand = Math.min(requestAdaptToDay,this.energyByDistrictByDay[request.districtId][1]-this.energyByDistrictByDay[request.districtId][0])
        this.energyByDistrictByDay[request.districtId][0] += prodPlusDemand
      }
    }
    finally {
      release();
    }
  }

  async produceLess(request: ProductioRequestDto) {
    const release = await this.mutex.acquire();
    try {
      if (Object.keys(this.energyByDistrictByDay).includes("" + request.districtId)) {
        this.energyByDistrictByDay[request.districtId][0] > (request.request * 3600) * 24 ? this.energyByDistrictByDay[request.districtId][0] -= (request.request * 3600) * 24 :this.energyByDistrictByDay[request.districtId][0] = 0;
      }
    }
    finally {
      release();
    }
  }
}
