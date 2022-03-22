import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConsumptionDto } from './dto/consumption.dto';
import * as moment from 'moment';
import 'moment-timezone';
import { OLD_PERSON, POPULATION_BY_DISTRICT, TYPE_REPRESENTATION, WORKER, CONSUMPTION_REDUCTION_BY_DISTRICT, PRODUCTOR } from 'apps/utils/data';
import { OutletConsumptionDto } from './dto/outlet-consumption.dto';
import { ProductionDto } from './dto/production.dto';

@Injectable()
export class HouseService {
  energyConsumed(client: ClientKafka) {
    let date = moment(new Date()).tz('Europe/Paris');

    let energy;
    let energyNonEssential;
    let energyReduction;
    // pour chaque district
    for (let district = 0; district < POPULATION_BY_DISTRICT.length; district++) {
      // pour chaque habitant
      for (let i = 0; i < POPULATION_BY_DISTRICT[district]; i++) {
        // on récupère le type
        let type = i < POPULATION_BY_DISTRICT[district] * TYPE_REPRESENTATION.oldPerson ?
          OLD_PERSON : WORKER;

        // on récupère la quantité d'énergie à produire
        energyReduction = CONSUMPTION_REDUCTION_BY_DISTRICT[district] / 3600
        if (date.isoWeekday() < 6) {
          energy = type.dayOfWeek[date.hours()];
          energyNonEssential = Math.max(type.dayOfWeekNonEssential[date.hours()] - energyReduction, 0)
        } else if (date.isoWeekday() === 6) {
          energy = type.saturday[date.hours()];
          energyNonEssential = Math.max(type.saturdayNonEssential[date.hours()] - energyReduction, 0)
        } else if (date.isoWeekday() === 7) {
          energy = type.sunday[date.hours()];
          energyNonEssential = Math.max(type.sundayNonEssential[date.hours()] - energyReduction, 0)
        }
        //console.log("non essential energy "+energyNonEssential+" district "+district)
        energy = energy / 3600;
        energyNonEssential = energyNonEssential / 3600

        // on emit
        var consumption = new ConsumptionDto(
          new Date(date.format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z'),
          Number(String(district + 1) + String(i)),
          district,
          {
            0: new OutletConsumptionDto("ESSENTIAL", energy),
            1: new OutletConsumptionDto("NON_ESSENTIAL", energyNonEssential),
            2: new OutletConsumptionDto("CLOSED", energyReduction)
          },
          "GRID"
        );
        client.emit('energy.consumed', JSON.stringify(consumption));
        //        if(i < POPULATION_BY_DISTRICT[district] * TYPE_REPRESENTATION.productor)
        this.energyProduced(client, district, Number(String(district) + String(i)), date)
        consumption = undefined
        type = undefined
      }
    }
    energy = undefined
    energyNonEssential = undefined
    energyReduction = undefined
  }

  reduceConsumption(districtId: number, value: number) {
    CONSUMPTION_REDUCTION_BY_DISTRICT[districtId] = Math.max(CONSUMPTION_REDUCTION_BY_DISTRICT[districtId] + (value * 3600) / POPULATION_BY_DISTRICT[districtId], 0.71);
    //console.log("consumption reduction  districtId" + districtId + "--value" + CONSUMPTION_REDUCTION_BY_DISTRICT[districtId])
  }
  reopenClosedConsumption(districtId: number, value: number) {
    CONSUMPTION_REDUCTION_BY_DISTRICT[districtId] = Math.max(0, CONSUMPTION_REDUCTION_BY_DISTRICT[districtId] - ((value * 3600) / POPULATION_BY_DISTRICT[districtId]))
    //console.log("consumption Reopen districtId" + districtId + "--value of closed" + CONSUMPTION_REDUCTION_BY_DISTRICT[districtId])
  }
  energyProduced(client: ClientKafka, districtId: number, clientId: number, date: moment.Moment) {
    // client produce energy here
    var production = new ProductionDto(new Date(date.format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z'),
      clientId, districtId,
      PRODUCTOR[date.hours()],
      "GRID")
    //console.log("energy produced "+ JSON.stringify(production))
    client.emit('energy.produced', JSON.stringify(production));
    production = undefined
  }

  clientEnergyProduced(client: ClientKafka, production: ProductionDto) {
    console.log(production)
    client.emit('energy.produced', JSON.stringify(production));
  }

  clientEnergyConsumed(client: ClientKafka, consumption: ConsumptionDto) {
    console.log(consumption)
    client.emit('energy.consumed', JSON.stringify(consumption));

  }

  getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
