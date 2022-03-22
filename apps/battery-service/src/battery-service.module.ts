import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BatteryStatus, BatteryStatusDocument, BatteryStatusSchema } from 'apps/schema/battery-status.schema';
import { BatteryServiceController } from './battery-service.controller';
import { BatteryService } from './battery-service.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
  }),
  MongooseModule.forRoot(
    process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
  ),
  MongooseModule.forFeature([{ name: BatteryStatus.name, schema: BatteryStatusSchema }])],
  controllers: [BatteryServiceController],
  providers: [BatteryService],
})
export class BatteryServiceModule {}
