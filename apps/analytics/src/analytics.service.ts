import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConsumptionDto } from './dto/consumption.dto';
import { firstValueFrom, map } from 'rxjs';
import { DayConsumptionDto } from './dto/day-consumption.dto';
import { OutletConsumptionDto } from './dto/outlet-consumption.dto';
import { ProductionDto } from 'apps/production-storer/src/dto/production.dto'
@Injectable()
export class AnalyticsService {
 



  consumption_viewer_url;
  consumption_storer_url;
  day_consumption_storer_url;
  production_storer_url;
  constructor(private httpService: HttpService) {
    this.consumption_viewer_url = "http://" + process.env.CONSUMPTION_VIEWER_URL;
    this.consumption_storer_url = "http://" + process.env.CONSUMPTION_STORER_URL;
    this.day_consumption_storer_url = "http://" + process.env.DAY_CONSUMPTION_STORER_URL;
    this.production_storer_url =  "http://production-storer:3013/production-storer" 
  }
  
  getStatsProductionOfMonth(date: Date, dateEnd: Date) {
    throw new Error('Method not implemented.');
  }
  
  getStatsProductionOfDay(date: Date, dateEnd: Date) {
    throw new Error('Method not implemented.');
  }
  
  async getStatsProductionOfMonthConsumer(date: Date, dateEnd: Date, clientId: number) {
    console.log(this.production_storer_url+"/month?year="+date.getFullYear()+"&month="+date.getMonth()+"&productorId="+clientId)
    const response$ = this.httpService.get(this.production_storer_url+"/month?year="+date.getFullYear()+"&month="+date.getMonth()+"&productorId="+clientId).pipe(
      map(response => response.data)
    );
    const res : ProductionDto[]= await firstValueFrom(response$);
    console.log(res)
    const nbDay = new Date(date.getFullYear(),date.getMonth(),0).getDate()
    console.log(nbDay)
    let prodAnalytics = new Map<number,number>();
    for(let i=1; i <= nbDay ;i++){
      prodAnalytics.set(i,0)
    }
    res.forEach(prod => {
      const day = new Date(prod.timestamp).getDate()
      prodAnalytics.set(day, prod.production+prodAnalytics.get(day))
    });
    return Array.from(prodAnalytics.entries());
  }
  async getStatsProductionOfDayConsumer(date: Date, dateEnd: Date, clientId: number) {
    console.log(this.production_storer_url+"/month?year="+date.getFullYear()+"&month="+date.getMonth()+"&day="+date.getDay()+"&productorId="+clientId)
    const response$ = this.httpService.get(this.production_storer_url+"/day?year="+date.getFullYear()+"&month="+date.getMonth()+"&day="+date.getDay()+"&productorId="+clientId).pipe(
      map(response => response.data)
    );
    const res : ProductionDto[]= await firstValueFrom(response$);
    console.log(res)
    let prodAnalytics = new Map<number,number>();
    for(let i=1; i <= 24 ;i++){
      prodAnalytics.set(i,0)
    }
    res.forEach(prod => {
      const day = new Date(prod.timestamp)
      prodAnalytics.set(day.getHours(), prod.production+prodAnalytics.get(day.getHours()))
    });
    return Array.from(prodAnalytics.entries());
  }
  
  async callHttpConsumption(url): Promise<Array<Array<ConsumptionDto>>> {
    console.log(url)
    const response$ = this.httpService.get(url).pipe(
      map(response => response.data)
    );

    return await firstValueFrom(response$);
  }
  async callHttpDayConsumption(url): Promise<Array<DayConsumptionDto>> {
    console.log(url)
    const response$ = this.httpService.get(url).pipe(
      map(response => response.data)
    );

    return await firstValueFrom(response$);
  }
  
  async getActualStats(clientId: number) {
    let analytics = new Map<Date, { [outletId: number]:  OutletConsumptionDto}>();
    const url = this.consumption_viewer_url + "/consumption/"+clientId
    const response = await this.callHttpConsumption(url);
    response[0].forEach((cons => {
      if (cons.timestamp != null) {
        const date = new Date(cons.timestamp);
        var consumptionByOutlet:{ [outletId: number]:  OutletConsumptionDto } = {0:null};
        for(var key in Object.keys(cons.consumptionByOutlet)){
          consumptionByOutlet[key] = cons.consumptionByOutlet[key];
        }
        analytics.set(date, consumptionByOutlet);
      }
    }));
    //const consumptionArray:IterableIterator<[number, Map<number, number>]>=analytics.entries();
    analytics = new Map([...analytics.entries()].sort((a, b) => a[0].getTime() - b[0].getTime()));
    return Array.from(analytics.entries());
  }

  async getStatsOfDay(first: Date,second: Date) {
    let analytics = new Map<number, Map<number, number>>();
    const url = this.consumption_storer_url + "/hourConsumption?firstDate=" + first.toString() + "&secondDate=" + second.toString();
    const response = await this.callHttpDayConsumption(url);
    for (let i = 0; i < 24; i++) {
      analytics.set(i, new Map<number, number>());
    }
    response.forEach((cons => {
      if (cons.timestamp != null) {
        const clientId = cons.clientId;
        const date = new Date(cons.timestamp);
        const hour: number = date.getUTCHours();
        const clientMap: Map<number, number> = analytics.get(hour) != null ? analytics.get(hour) : new Map<number, number>()
        const currentValueClientID: number = clientMap.get(clientId) != null ? clientMap.get(clientId) : 0;
        clientMap.set(clientId, currentValueClientID + this.totalConsumptionDay(cons))
        analytics.set(hour, clientMap);
      }
    }));
    //const consumptionArray:IterableIterator<[number, Map<number, number>]>=analytics.entries();
    analytics = new Map([...analytics.entries()].sort((a, b) => a[0] - b[0]));
    const res: Map<number, object> = new Map<number, object>();
    analytics.forEach((val: Map<number, number>, key: number) => {
      res.set(key, Object.fromEntries(val))
    })
    return Object.fromEntries(res);
  }



  async getStatsOfDayConsumer(first: Date,second: Date, clientId: number) {
    let analytics = new Map<number,{ [outletId: number]:  number }>();
    const url = this.consumption_storer_url + "/hourConsumption?firstDate=" + first.toISOString() + "&secondDate=" + second.toISOString()+ "&clientId=" + clientId
    const response = await this.callHttpDayConsumption(url)
    for (let i = 0; i < 24; i++) {
      analytics.set(i, {0:0});
    }
    response.forEach((cons => {
      if (cons.timestamp != null) {
        const date = new Date(cons.timestamp);
        const hour: number = date.getUTCHours();
        var consumptionByOutlet:{ [outletId: number]:  number } = {0:0};
        for(var key in Object.keys(cons.consumptionByOutlet)){
          consumptionByOutlet[key] = cons.consumptionByOutlet[key];
        }
        analytics.set(hour, consumptionByOutlet);
      }
    }));
    //const consumptionArray:IterableIterator<[number, Map<number, number>]>=analytics.entries();
    analytics = new Map([...analytics.entries()].sort((a, b) => a[0] - b[0]));
    return Array.from(analytics.entries());
  }

  async getStatsOfMonth(first: Date,second: Date) {
    let analytics = new Map<number, Map<number, number>>();
    const url = this.day_consumption_storer_url + "/dayConsumption/dates?firstDate=" + first.toISOString() + "&secondDate=" + second.toISOString()
    const response = await this.callHttpDayConsumption(url)
    for (let i = 1; i < 31; i++) {
      analytics.set(i, new Map<number, number>());
    }
    response.forEach((cons => {
      if (cons.timestamp != null) {
        const clientId = cons.clientId;
        const date = new Date(cons.timestamp)
        const day: number = date.getDay() + 1;
        const clientMap: Map<number, number> = analytics.get(day) != null ? analytics.get(day) : new Map<number, number>()
        const currentValueClientID: number = clientMap.get(clientId) != null ? clientMap.get(clientId) : 0;
        clientMap.set(clientId, currentValueClientID + this.totalConsumptionDay(cons))
        analytics.set(day, clientMap);
      }
    }));
    //const consumptionArray:IterableIterator<[number, Map<number, number>]>=analytics.entries();
    analytics = new Map([...analytics.entries()].sort((a, b) => a[0] - b[0]));
    const res: Map<number, object> = new Map<number, object>();
    analytics.forEach((val: Map<number, number>, key: number) => {
      res.set(key, Object.fromEntries(val))
    })
    return Object.fromEntries(res);  }

  async getStatsOfMonthConsumer(first: Date,second: Date,  clientId: number) {
    let analytics = new Map<number, number>();
    const url = this.day_consumption_storer_url + "/dayConsumption/dates?firstDate=" + first.toISOString() + "&secondDate=" + second.toISOString() + "&clientId=" + clientId
    const response = await this.callHttpDayConsumption(url)
    for (let i = 1; i < 31; i++) {
      analytics.set(i, 0);
    }
    response.forEach((cons => {
      if (cons.timestamp != null) {
        const date = new Date(cons.timestamp)
        const day: number = date.getDay() + 1;
        const currentValue: number = analytics.get(day) != null ? analytics.get(day) : 0;
        analytics.set(day, currentValue + this.totalConsumptionDay(cons));
      }
    }));

    analytics = new Map([...analytics.entries()].sort((a, b) => a[0] - b[0]));
    return Array.from(analytics.entries());  }

  async getStatsOfYear(first: Date,second: Date) {
    let analytics = new Map<number, number>();
    const url = this.day_consumption_storer_url + "/dayConsumption/dates?firstDate=" + first.toISOString() + "&secondDate=" + second.toISOString()
    const response = await this.callHttpDayConsumption(url)
    for (let i = 1; i <= 12; i++) {
      analytics.set(i, 0)
    }
    response.forEach((cons => {
      if (cons.timestamp != null) {
        const date = new Date(cons.timestamp)
        const month: number = date.getMonth() + 1;
        const currentValue: number = analytics.get(month) != null ? analytics.get(month) : 0;
        analytics.set(month, currentValue + this.totalConsumptionDay(cons));
      }
    }));

    analytics = new Map([...analytics.entries()].sort((a, b) => a[0] - b[0]));
    return Array.from(analytics.entries());
  }

  async getStatsOfYearConsumer(first: Date,second: Date, clientId: number) {
    let analytics = new Map<number, number>();
    const url = this.day_consumption_storer_url + "/dayConsumption/dates?firstDate=" + first.toISOString() + "&secondDate=" + second.toISOString() + "&clientId=" + clientId
    const response = await this.callHttpDayConsumption(url)
    for (let i = 1; i <= 12; i++) {
      analytics.set(i, 0)
    }
    response.forEach((cons => {
      if (cons.timestamp != null) {
        const date = new Date(cons.timestamp)
        const month: number = date.getMonth() + 1;
        const currentValue: number = analytics.get(month) != null ? analytics.get(month) : 0;
        analytics.set(month, currentValue + this.totalConsumptionDay(cons));
      }
    }));

    analytics = new Map([...analytics.entries()].sort((a, b) => a[0] - b[0]));
    return Array.from(analytics.entries());
  }



  async getStatsOfDayByDistrict(first: Date,second: Date, districtId: number) {
    let analytics = new Map<number, number>();
    const url = this.consumption_storer_url + "/hourConsumption/district?firstDate=" + first.toISOString() + "&secondDate=" + second.toISOString() +"&districtid=" + districtId;
    const response = await this.callHttpDayConsumption(url)
    for (let i = 0; i < 24; i++) {
      analytics.set(i, 0)
    }
    response.forEach((cons => {
      if (cons.timestamp != null) {
        const date = new Date(cons.timestamp);
        const hour: number = date.getUTCHours();
        const currentValue: number = analytics.get(hour) != null ? analytics.get(hour) : 0;
        analytics.set(hour, currentValue + this.totalConsumptionDay(cons));
      }
    }));

    analytics = new Map([...analytics.entries()].sort((a, b) => a[0] - b[0]));
    return Array.from(analytics.entries());
  }
  async getStatsOfDayDistricts(first: Date,second: Date) {
    let analytics = new Map<number, number>();
    const url = this.consumption_storer_url + "/hourConsumption?firstDate=" + first.toISOString() + "&secondDate=" + second.toISOString()
    const response = await this.callHttpDayConsumption(url)
    response.forEach((cons => {
      if (cons.timestamp != null) {
        const district = cons.districtId
        const currentValue: number = analytics.get(district) != null ? analytics.get(district) : 0;
        analytics.set(district, currentValue + this.totalConsumptionDay(cons));
      }
    }));

    analytics = new Map([...analytics.entries()].sort((a, b) => a[0] - b[0]));
    return Array.from(analytics.entries());
  }


  async getStatsOfMonthByDistrict(first: Date,second: Date, districtId: number) {
    let analytics = new Map<number, number>();
    const url = this.day_consumption_storer_url + "/dayConsumption/dates/district?firstDate=" + first.toISOString() + "&secondDate=" + second.toISOString() + "&year=" + "&districtid=" + districtId;
    const response = await this.callHttpDayConsumption(url)
    for (let i = 0; i < 24; i++) {
      analytics.set(i, 0)
    }
    response.forEach((cons => {
      if (cons.timestamp != null) {
        const date = new Date(cons.timestamp);
        const hour: number = date.getUTCHours();
        const currentValue: number = analytics.get(hour) != null ? analytics.get(hour) : 0;
        analytics.set(hour, currentValue + this.totalConsumptionDay(cons));
      }
    }));

    analytics = new Map([...analytics.entries()].sort((a, b) => a[0] - b[0]));
    return Array.from(analytics.entries());
  }
  async getStatsOfMonthDistricts(first: Date,second: Date,) {
    let analytics = new Map<number, number>();
    const url = this.consumption_viewer_url + "dayConsumption/dates?firstDate=" + first.toISOString() + "&secondDate=" + second.toISOString()
    const response = await this.callHttpDayConsumption(url)
    response.forEach((cons => {
      if (cons.timestamp != null) {
        const district = cons.districtId
        const currentValue: number = analytics.get(district) != null ? analytics.get(district) : 0;
        analytics.set(district, currentValue + this.totalConsumptionDay(cons));
      }
    }));

    analytics = new Map([...analytics.entries()].sort((a, b) => a[0] - b[0]));
    return Array.from(analytics.entries());
  }



  private totalConsumption(consumption: ConsumptionDto): number {
    let total = 0;
    for (let i = 0; i < Object.keys(consumption.consumptionByOutlet).length; i++) {
      let outletId = Number(Object.keys(consumption.consumptionByOutlet)[i]);
      total += consumption.consumptionByOutlet[outletId].consumption;
    }
    return total;
  }

  private totalConsumptionDay(consumption: DayConsumptionDto): number {
    let total = 0;
    for (let i = 0; i < Object.keys(consumption.consumptionByOutlet).length; i++) {
      let outletId = Number(Object.keys(consumption.consumptionByOutlet)[i]);
      total += consumption.consumptionByOutlet[outletId];
    }
    return total;
  }
}
