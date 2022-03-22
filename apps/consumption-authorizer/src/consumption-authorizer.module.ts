import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConsumptionAuthorizerController } from './consumption-authorizer.controller';
import { ConsumptionAuthorizerService } from './consumption-authorizer.service';

@Module({
  imports: [],
  controllers: [ConsumptionAuthorizerController],
  providers: [ConsumptionAuthorizerService],
})
export class ConsumptionAuthorizerModule {}
