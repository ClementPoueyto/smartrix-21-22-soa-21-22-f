import { Injectable } from '@nestjs/common';
import { Mutex } from 'async-mutex';
import { balanceByDistrictDto } from './dto/balance-by-district.dto';
import { ConsumptionDto } from './dto/consumption.dto';
import { ProductionDto } from './dto/production.dto';

@Injectable()
export class BalancerService {
  // consommations par district
  private consumptionsByDistrict: Record<number, number[]> = {};
  private outletClosedByDistrict: Record<number, number> = {};
  // production par district
  private productionsByDistrict: Record<number, number[]> = {};
  private productionMaxByDistrict: Record<number, number> = {};
  private mutex = new Mutex();

  public async addConsumption(consumption: ConsumptionDto) {
    const release = await this.mutex.acquire();
    try {
      if (this.consumptionsByDistrict[consumption.districtId] === undefined)
        this.consumptionsByDistrict[consumption.districtId] = [];

      this.consumptionsByDistrict[consumption.districtId].push(consumption.consumption)
    } finally {
      release();
    }
  }
  public async addClosedOutlet(consumption: ConsumptionDto) {
    const release = await this.mutex.acquire();
    try {
      if(this.outletClosedByDistrict[consumption.districtId] === undefined )
        this.outletClosedByDistrict[consumption.districtId] = 0
      this.outletClosedByDistrict[consumption.districtId] += consumption.consumption
    } finally {
      release();
    }
  }

  public async addProduction(production: ProductionDto) {
    const release = await this.mutex.acquire();
    try {
      if (this.productionsByDistrict[production.districtId] === undefined)
        this.productionsByDistrict[production.districtId] = [];
      if( this.productionMaxByDistrict[production.districtId] === undefined)
        this.productionMaxByDistrict[production.districtId] = 0.0;
      this.productionMaxByDistrict[production.districtId] += production.maxProduction? production.maxProduction : production.production
      this.productionsByDistrict[production.districtId].push(production.production);
    } finally {
      release();
    }
  }

  private findAllDistricts(): number[] {
    return [... new Set<number>([...Object.keys(this.consumptionsByDistrict).map(Number), ...Object.keys(this.productionsByDistrict).map(Number)])];
  }

  public async getBalances(): Promise<balanceByDistrictDto[]> {
    let consumptionsSizeByDistrict: Record<number, number> = {};
    let productionsSizeByDistrict: Record<number, number> = {};
    let districts: number[];

    // snapshot des données à l'instant t
    const firstRelease = await this.mutex.acquire();
    try {
      districts = this.findAllDistricts();
      districts.forEach(district => {
        consumptionsSizeByDistrict[district] =
          this.consumptionsByDistrict[district] === undefined ? 0 : this.consumptionsByDistrict[district].length;

        productionsSizeByDistrict[district] =
          this.productionsByDistrict[district] === undefined ? 0 : this.productionsByDistrict[district].length;
      })
    } finally {
      firstRelease();
    }


    // somme des données par district
    let totalConsumptionByDistrict: Record<number, number> = {};
    let totalProductionByDistrict: Record<number, number> = {};

    districts.forEach(district => {
      for (let i = 0; i < consumptionsSizeByDistrict[district]; i++)
        totalConsumptionByDistrict[district] === undefined ?
          totalConsumptionByDistrict[district] = this.consumptionsByDistrict[district][i] :
          totalConsumptionByDistrict[district] += this.consumptionsByDistrict[district][i];
      for (let i = 0; i < productionsSizeByDistrict[district]; i++)
        totalProductionByDistrict[district] === undefined ?
          totalProductionByDistrict[district] = this.productionsByDistrict[district][i] :
          totalProductionByDistrict[district] += this.productionsByDistrict[district][i];
    });

    // balance par district
    let balancesByDistrict: balanceByDistrictDto[] = [];

    districts.forEach(district => {
      let consumption = totalConsumptionByDistrict[district] === undefined ? 0 : totalConsumptionByDistrict[district];
      let production = totalProductionByDistrict[district] === undefined ? 0 : totalProductionByDistrict[district];
      let balance = consumption == 0 || production == 0 ? 0 : consumption * 100 / production;
      let maxProductionDistrict = this.productionMaxByDistrict[district];
      let closedOutlet = this.outletClosedByDistrict[district]?this.outletClosedByDistrict[district]:0;
      balancesByDistrict.push(new balanceByDistrictDto(
        consumption,
        production,
        balance,
        district,
        maxProductionDistrict,
        closedOutlet
      ));
    });

    const secondRelease = await this.mutex.acquire();
    try {
      districts.forEach(district => {
        if (consumptionsSizeByDistrict[district] > 0)
          this.consumptionsByDistrict[district].splice(0, productionsSizeByDistrict[district]);
        if (productionsSizeByDistrict[district] > 0)
          this.productionsByDistrict[district].splice(0, productionsSizeByDistrict[district]);
        if(this.productionMaxByDistrict[district]!=0)
          this.productionMaxByDistrict[district] =0
        if(this.outletClosedByDistrict[district] = 0)
          this.outletClosedByDistrict[district] = 0
      });
    } finally {
      secondRelease();
    }

    return balancesByDistrict;
  }
}
