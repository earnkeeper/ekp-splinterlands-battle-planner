import { SdkModule } from '@earnkeeper/ekp-sdk-nestjs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';
import { PlannerModule } from './feature/planner/planner.module';

export const MODULE_DEF = {
  imports: [
    MongooseModule.forRoot(
      config('MONGO_URI', {
        default: 'mongodb://localhost:27017/splinterlands',
      }),
    ),
    PlannerModule,
    SdkModule,
  ],
};

@Module(MODULE_DEF)
export class WorkerModule {}
