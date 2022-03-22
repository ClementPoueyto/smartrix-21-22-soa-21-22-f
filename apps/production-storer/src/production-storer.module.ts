import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DayClientProduction, DayClientProductionSchema } from 'apps/schema/day-client-production.schema';
import { Production,ProductionSchema } from 'apps/schema/production.schema';
import { ProductionStorerController } from './production-storer.controller';
import { ProductionStorerService } from './production-storer.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot({
    envFilePath: '.env',
  }),
  MongooseModule.forRoot(
    process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
  ),
  MongooseModule.forFeature([{ name: Production.name, schema: ProductionSchema },{ name: DayClientProduction.name, schema: DayClientProductionSchema }])
],
  controllers: [ProductionStorerController],
  providers: [ProductionStorerService],
})
export class ProductionStorerModule { }
