import { Module } from '@nestjs/common';
import { EmbedController } from './embed.controller';
import { EmbedService } from './embed.service';
import { GameModule } from '../../shared/game/game.module';
import { PlannerModule } from '../planner/planner.module';
import { PlannerService } from '../planner/planner.service';
import { DbModule } from '@/shared/db';

@Module({
  imports: [PlannerModule, GameModule, DbModule],
  providers: [EmbedController, EmbedService, PlannerService],
  exports: [EmbedController],
})
export class EmbedModule {}
