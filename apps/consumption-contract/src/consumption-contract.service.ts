import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConsumptionContract, ConsumptionContractDocument } from 'apps/schema/consumption-contract.schema';
import { Model } from 'mongoose';
import { ConsumptionContractDto } from '../dto/consumption-contract.dto';

@Injectable()
export class ConsumptionContractService {

  constructor(@InjectModel(ConsumptionContract.name) private ConsumptionContractModel: Model<ConsumptionContractDocument>) { }


  async createContract(consumptionContractDto: ConsumptionContractDto) : Promise<ConsumptionContract> {
      const createdConsumptionContract = new ConsumptionContract(consumptionContractDto);

      return await this.ConsumptionContractModel.findOneAndUpdate({
        idClient : consumptionContractDto.idClient
      }, createdConsumptionContract, {upsert : true})

  }
  
  async getAllContracts(){
    const contract = await this.ConsumptionContractModel.find().exec()
    return contract.map(contract => ({
      id : contract.id,
      idClient: contract.idClient,
      beg_date: contract.beg_date,
      end_date:contract.end_date,
      price_KW:contract.price_KW,
    }));
  }

  async getContractByClientId(idClient: number){
    return await this.ConsumptionContractModel.findOne({ idClient : idClient }).exec()
  }
}
