import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsumptionContractController } from './consumption-contract.controller';
import { ConsumptionContractService } from './consumption-contract.service';
import { ConfigModule } from '@nestjs/config';
import { ConsumptionContract, ConsumptionContractDocument, ConsumptionContractSchema } from 'apps/schema/consumption-contract.schema';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
  }),
  MongooseModule.forRoot(
    process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
  ),
  MongooseModule.forFeature([{ name: ConsumptionContract.name, schema: ConsumptionContractSchema }])
  ],
  controllers: [ConsumptionContractController],
  providers: [ConsumptionContractService],})
export class ConsumptionContractModule {}
