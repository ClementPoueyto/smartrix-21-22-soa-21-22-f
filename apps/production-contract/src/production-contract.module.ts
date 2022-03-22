import { Module } from '@nestjs/common';
import { ProductionContractController } from './production-contract.controller';
import { ProductionContractService } from './production-contract.service';
import { ConfigModule } from '@nestjs/config';
import { ProductionContract, ProductionContractDocument, ProductionContractSchema } from 'apps/schema/production-contract.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
  }),
  MongooseModule.forRoot(
    process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
  ),
  MongooseModule.forFeature([{ name: ProductionContract.name, schema: ProductionContractSchema }])],
  controllers: [ProductionContractController],
  providers: [ProductionContractService],
})
export class ProductionContractModule {}
