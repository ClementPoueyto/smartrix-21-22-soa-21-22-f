import { ProductionContract } from 'apps/schema/production-contract.schemas';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientInvoice, ClientInvoiceDocument } from 'apps/schema/client-invoice.schema';
import { ConsumptionContract } from 'apps/schema/consumption-contract.schema';
import { Model } from 'mongoose';
import { map } from 'rxjs';

@Injectable()
export class ClientInvoiceService {

  analytics_url
  production_contract_url
  consumption_contract_url
  production_storer_url


  constructor(private httpService: HttpService, @InjectModel(ClientInvoice.name) private clientInvoiceModel: Model<ClientInvoiceDocument> ) {
    this.analytics_url="http://"+process.env.ANALYTICS_URL;
    this.consumption_contract_url="http://"+process.env.CONSUMPTION_CONTRACT_URL;
    this.production_contract_url="http://"+process.env.PRODUCTION_CONTRACT_URL;
    this.production_storer_url="http://"+process.env.PRODUCTION_STORER_URL;

   }
   async callHttp(url) {
    return this.httpService.get(url).pipe(
      map((axiosResponse) => {
        return axiosResponse.data;
      })
    ).toPromise();
  }
  async getInvoicesByYear(year:number, idClient:number){
    console.log(year+" "+idClient)
    return await this.clientInvoiceModel.find({
      year : year,
      idClient : idClient
    })
  }

  async getInvoicesByMonth(year:number, month: number, idClient:number){
    return await this.clientInvoiceModel.find({
      year : year,
      month : month,
      idClient : idClient
    })
  }
  async updateAllClientInvoiceByYear(year:number){
    for(let i=0; i<=12; i++){
      this.updateClientInvoice(i, year);
    }
  }

  //prendre en compte les earnings
  async updateClientInvoice(month:number, year:number){
    const urlcontracts= this.consumption_contract_url+"/consumptioncontract";
    const urlproductioncontracts= this.production_contract_url+"/productioncontract/client";
    const urlproductionstorer= this.production_storer_url+"/production-storer/month/total";

    console.log(urlcontracts)
    const response  = await this.callHttp(urlcontracts)
    if(year==null){
      year= new Date().getFullYear();
    }
    if(month==null){
      month= new Date().getMonth()+1;
      console.log("current month "+month)
    }
    response.forEach(async (contract : ConsumptionContract)=>{
      let urlcons = this.analytics_url+"/statistics/year?year="+year+"&userid="+contract.idClient;
      console.log(urlcons)
      let responseCons : Array<ConsumptionContract> = await this.callHttp(urlcons)

      const prodContract : ProductionContract = await this.callHttp(urlproductioncontracts+"?idClient="+contract.idClient)
      let earn = 0;
      if(prodContract!=null){
        const prodtotalMonth = await this.callHttp(urlproductionstorer+"?productorId="+contract.idClient+"&year="+year+"&month="+month);
        earn = prodContract.price_KW*prodtotalMonth.productionGrid
      }


      let price = (responseCons[month-1][1]*contract.price_KW)//-responseEarn;
      const newInvoice = new ClientInvoice(contract.idClient, responseCons[month-1][1],price,month, year, earn);//responseEarn)
      console.log(newInvoice)
      const invoice = await this.clientInvoiceModel.findOneAndUpdate({
        idClient : contract.idClient,
        month : month,
        year : year
      }, newInvoice, {upsert : true})

    })
  }

  getHello(): string {
    return 'Hello World!';
  }

  async predictInvoice(idClient : number, month: number, year:number, day:number){
    const urlproductioncontracts= this.production_contract_url+"/productioncontract/client";
    const urlproductionstorer= this.production_storer_url+"/production-storer/month/total";
    const date = new Date();
    if(month==null||year==null||day==null){
      month =date.getMonth()+1
      year = date.getFullYear();
      day = date.getDate();
    }
    const urlcontract= this.consumption_contract_url+"/consumptioncontract/client?idClient="+idClient;
    const contract : ConsumptionContract = await this.callHttp(urlcontract)
    const urlCons = this.analytics_url+"/statistics/year?year="+year+"&userid="+idClient;
    const consumptionStats  = await this.callHttp(urlCons)
    const prodContract : ProductionContract = await this.callHttp(urlproductioncontracts+"?idClient="+contract.idClient)
    let earn = 0;
    if(prodContract!=null){
      const prodtotalMonth = await this.callHttp(urlproductionstorer+"?productorId="+contract.idClient+"&year="+year+"&month="+month);
      earn = prodContract.price_KW*prodtotalMonth.productionGrid
    }
    const currentCons = consumptionStats[month-1][1];

    if(contract==null||currentCons==0){
      return 0;
    }
    const lastYearInvoice  = await this.clientInvoiceModel.findOne({
      idClient : idClient,
      year : (year-1),
      month : month
    })
    const lastYearConsumption = lastYearInvoice!=null?lastYearInvoice.consumption:0;
    const averageConsByDay = currentCons/day
    console.log(averageConsByDay)

    let predictConsEndMonth = averageConsByDay*30;
    console.log(predictConsEndMonth)
    if(lastYearConsumption!=null&&lastYearConsumption!=0){
      predictConsEndMonth = (lastYearConsumption+predictConsEndMonth)/2
    }
    const predictPriceEndMonth = ((predictConsEndMonth)*(contract.price_KW))-earn;

    return Math.trunc(predictPriceEndMonth);
  }
}
