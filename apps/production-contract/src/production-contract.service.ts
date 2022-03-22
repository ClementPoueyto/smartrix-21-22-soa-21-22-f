import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductionContract,ProductionContractDocument } from 'apps/schema/production-contract.schemas';
import { Model } from 'mongoose';
import { ProductionContractDto } from '../dto/production-contract.dto';

@Injectable()
export class ProductionContractService {
  constructor(@InjectModel(ProductionContract.name) private productionContractModel: Model<ProductionContractDocument>) { }


  async createContract(productionContractDto: ProductionContractDto) : Promise<ProductionContract> {
      const createdproductionContract = new ProductionContract(productionContractDto);

      return await this.productionContractModel.findOneAndUpdate({
        idClient : productionContractDto.idClient
      }, createdproductionContract, {upsert : true})

  }
  
  async getAllContracts(){
    const contract = await this.productionContractModel.find().exec()
    return contract.map(contract => ({
      id : contract.id,
      idClient: contract.idClient,
      beg_date: contract.beg_date,
      end_date:contract.end_date,
      price_KW:contract.price_KW,
    }));
  }

  async getContractByClientId(idClient: number){
    return await this.productionContractModel.findOne({ idClient : idClient }).exec()
  }
}
