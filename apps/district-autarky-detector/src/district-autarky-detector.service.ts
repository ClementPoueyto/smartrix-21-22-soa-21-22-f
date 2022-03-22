import { Injectable } from '@nestjs/common';
import { Mutex } from 'async-mutex';

@Injectable()
export class DistrictAutarkyDetectorService {
  private autarkyStatusByDistrictId: { [districtId: number]: boolean }
  private mutex = new Mutex();

  public async clientAutarky(districtId: number): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      this.autarkyStatusByDistrictId[districtId] = false;
    }
    finally {
      release();
    }
  }

  public async clientNotAutrky(districtId: number): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      if (this.autarkyStatusByDistrictId[districtId] === undefined)
        this.autarkyStatusByDistrictId[districtId] = true;
    }
    finally {
      release();
    }
  }

  public async getAutarkyStatusByDistrictId(): Promise<{ [clientId: number]: boolean }> {
    const release = await this.mutex.acquire();
    try {
      let tmp = { ...this.autarkyStatusByDistrictId };
      this.autarkyStatusByDistrictId = {};
      return tmp;
    }
    finally {
      release();
    }
  }
}
