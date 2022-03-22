import { Injectable } from '@nestjs/common';
import { ClientAutarkyDto } from './dto/client-autarky.dto';
import { Mutex } from 'async-mutex';
import { DistrictAutarkyDto } from './dto/district-autarky.dto';

@Injectable()
export class AutarkyViewerService {
  private last24HoursByClientId: { [clientId: number]: { timestamp: Date, autarky: boolean }[] } = {};
  private last24HoursByDistrictId: { [districtId: number]: { timestamp: Date, autarky: boolean }[] } = {};

  private clientMutex = new Mutex();
  private districtMutex = new Mutex();

  public async addClientHourAutarky(clientAutarky: ClientAutarkyDto) {
    const release = await this.clientMutex.acquire();
    try {
      if (this.last24HoursByClientId[clientAutarky.clientId] === undefined)
        this.last24HoursByClientId[clientAutarky.clientId] = [{ timestamp: clientAutarky.timestamp, autarky: clientAutarky.autarky }];
      else {
        let storedData = this.last24HoursByClientId[clientAutarky.clientId];
        if (storedData.length === 24)
          storedData = storedData.slice(1, storedData.length);
        storedData.push({ timestamp: clientAutarky.timestamp, autarky: clientAutarky.autarky });
        this.last24HoursByClientId[clientAutarky.clientId] = storedData;
      }
    } finally {
      release();
    }
  }

  public getLast24HoursClientAutarky(clientId: number): { timestamp: Date, autarky: boolean }[] {
    return this.last24HoursByClientId[clientId] === undefined ? [] : this.last24HoursByClientId[clientId];
  }

  public async addDistrictHourAutarky(districtAutarky: DistrictAutarkyDto) {
    const release = await this.districtMutex.acquire();
    try {
      if (this.last24HoursByDistrictId[districtAutarky.districtId] === undefined)
        this.last24HoursByDistrictId[districtAutarky.districtId] = [{ timestamp: districtAutarky.timestamp, autarky: districtAutarky.autarky }];
      else {
        let storedData = this.last24HoursByDistrictId[districtAutarky.districtId];
        if (storedData.length === 24)
          storedData = storedData.slice(1, storedData.length);
        storedData.push({ timestamp: districtAutarky.timestamp, autarky: districtAutarky.autarky });
        this.last24HoursByDistrictId[districtAutarky.districtId] = storedData;
      }
    } finally {
      release();
    }
  }

  public getLast24HoursDistrictAutarky(districtId: number): { timestamp: Date, autarky: boolean }[] {
    return this.last24HoursByDistrictId[districtId] === undefined ? [] : this.last24HoursByDistrictId[districtId];
  }
}
