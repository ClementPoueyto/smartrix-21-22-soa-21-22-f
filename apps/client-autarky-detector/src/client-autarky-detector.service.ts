import { Injectable } from '@nestjs/common';
import { Mutex } from 'async-mutex';

@Injectable()
export class ClientAutarkyDetectorService {
  private autarkyStatusByClientId: { [clientId: number]: { districtId: number, autarky: boolean } } = {};
  private mutex = new Mutex();

  public async hasConsumedFromGrid(clientId: number, districtId: number): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      this.autarkyStatusByClientId[clientId] = { districtId: districtId, autarky: false };
    }
    finally {
      release();
    }
  }

  public async hasConsumedFromOther(clientId: number, districtId: number): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      if (this.autarkyStatusByClientId[clientId] === undefined)
        this.autarkyStatusByClientId[clientId] = { districtId: districtId, autarky: true };
    }
    finally {
      release();
    }
  }

  public async getAutarkyStatusByClientId(): Promise<{ [clientId: number]: { districtId: number, autarky: boolean } }> {
    const release = await this.mutex.acquire();
    try {
      let tmp = { ...this.autarkyStatusByClientId };
      this.autarkyStatusByClientId = {};
      return tmp;
    }
    finally {
      release();
    }
  }
}
