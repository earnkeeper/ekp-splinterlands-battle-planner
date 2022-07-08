import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { EmbedDataDocument } from './ui/embed-data.document';
import { PlannerDocument } from '../planner/ui/planner.document';

@Injectable()
export class EmbedService {
  async getEmbedDocuments(
    planner: PlannerDocument[],
  ): Promise<EmbedDataDocument[]> {
    return _.chain(planner)
      .filter((planner) => planner.battles > 2)
      .sortBy((planner) => planner.winpc)
      .takeRight(3)
      .map((planner) => {
        return {
          id: planner.id,
          name: planner.summonerName,
          cardArtUrl: planner.summonerCardImg,
          splinter: planner.splinter,
          battles: planner.battles,
          winRate: planner.winpc,
          price: planner.price,
          fiatSymbol: planner.fiatSymbol,
        };
      })
      .value();
  }
}
