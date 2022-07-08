import { SdkModule } from '@earnkeeper/ekp-sdk-nestjs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';
import { EmbedModule } from './feature/embed/embed.module';
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
    EmbedModule,
  ],
};

@Module(MODULE_DEF)
export class WorkerModule {}
