import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DayConsumption, DayConsumptionSchema } from 'apps/schema/day-consumption.schema';
import { ConsumptionDayStorerController } from './consumption-day-storer.controller';
import { ConsumptionDayStorerService } from './consumption-day-storer.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
    ),
    MongooseModule.forFeature([{ name: DayConsumption.name, schema: DayConsumptionSchema }])
],
  controllers: [ConsumptionDayStorerController],
  providers: [ConsumptionDayStorerService],
})
export class ConsumptionDayStorerModule {}
