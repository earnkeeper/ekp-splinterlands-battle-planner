import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BattleRepository } from './battle/battle.repository';
import { Battle, BattleSchema } from './battle/battle.schema';
import { CardStats, CardStatsSchema } from './card';
import { CardStatsRepository } from './card/card-stats.repository';
import { Ign, IgnRepository, IgnSchema } from './ign';
import {
  PlannerTeam,
  PlannerTeamRepository,
  PlannerTeamSchema,
} from './plannerTeam';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Battle.name, schema: BattleSchema },
      { name: CardStats.name, schema: CardStatsSchema },
      { name: Ign.name, schema: IgnSchema },
      { name: PlannerTeam.name, schema: PlannerTeamSchema },
    ]),
  ],
  providers: [
    BattleRepository,
    CardStatsRepository,
    IgnRepository,
    PlannerTeamRepository,
  ],
  exports: [
    BattleRepository,
    CardStatsRepository,
    IgnRepository,
    PlannerTeamRepository,
  ],
})
export class DbModule {}
