import { EkConfigService, SdkModule } from '@earnkeeper/ekp-sdk-nestjs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlannerModule } from './feature/planner/planner.module';

export const MODULE_DEF = {
  imports: [
    MongooseModule.forRootAsync({ useClass: EkConfigService }),
    PlannerModule,
    SdkModule,
  ],
};

@Module(MODULE_DEF)
export class WorkerModule {}
