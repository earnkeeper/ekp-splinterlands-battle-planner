import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { validate } from 'bycontract';
import { Model } from 'mongoose';
import { PlannerTeam } from './planner-team.schema';

@Injectable()
export class PlannerTeamRepository {
  constructor(
    @InjectModel(PlannerTeam.name)
    public model: Model<PlannerTeam>,
  ) {}

  async find(manaCap: number, leagueGroup: string): Promise<PlannerTeam[]> {
    validate([manaCap, leagueGroup], ['number', 'string']);

    return this.model
      .where({
        manaCap,
        leagueGroup,
      })
      .exec();
  }

  async findAll(leagueGroup: string): Promise<PlannerTeam[]> {
    validate([leagueGroup], ['string']);

    return this.model
      .where({
        leagueGroup,
      })
      .exec();
  }

  async save(documents: PlannerTeam[]): Promise<void> {
    validate([documents], ['Array.<object>']);

    if (documents.length === 0) {
      return;
    }

    await this.model.bulkWrite(
      documents.map((model) => {
        validate(model, 'object');
        return {
          updateOne: {
            filter: {
              id: model.id,
              leagueGroup: model.leagueGroup,
              manaCap: model.manaCap,
            },
            update: {
              $set: model,
            },
            upsert: true,
          },
        };
      }),
    );
  }
}
