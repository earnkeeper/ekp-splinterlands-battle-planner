import { IgnRepository, PlannerTeam, PlannerTeamRepository } from '@/shared/db';
import { Card, CardService, MarketService } from '@/shared/game';
import { DEFAULT_MAIN_FORM, MainForm } from '@/util';
import { CurrencyDto } from '@earnkeeper/ekp-sdk';
import { Injectable } from '@nestjs/common';
import { validate } from 'bycontract';
import _ from 'lodash';
import moment from 'moment';
import { PlannerDocument } from './ui/planner.document';

@Injectable()
export class PlannerService {
  constructor(
    private cardService: CardService,
    private ignRepository: IgnRepository,
    private marketService: MarketService,
    private plannerTeamRepository: PlannerTeamRepository,
  ) {}

  async getPlannerDocuments(
    isEmbed: boolean,
    form: MainForm,
    subscribed: boolean,
    currency: CurrencyDto,
  ) {
    validate([form, form.manaCap], ['object', 'number']);

    if (!!form.playerName) {
      this.ignRepository.save([{ id: form.playerName }]);
    }

    let teams;
    if (!!isEmbed) {
      teams = await this.plannerTeamRepository.findAll(
        form.leagueGroup ?? DEFAULT_MAIN_FORM.leagueGroup,
      );
    } else {
      teams = await this.plannerTeamRepository.find(
        form.manaCap,
        form.leagueGroup ?? DEFAULT_MAIN_FORM.leagueGroup,
      );
    }

    const cardPrices: Record<string, number> =
      await this.marketService.getMarketPrices();

    const playerCards = await this.cardService.getPlayerCards(form.playerName);

    for (const card of playerCards) {
      delete cardPrices[card.hash];
    }

    const plannerDocuments = await this.mapDocuments(
      teams,
      cardPrices,
      currency,
    );
    return plannerDocuments;
  }

  mapToQuests(summoner: Card, monsters: Card[]) {
    const quests = [];

    if (summoner.splinter === 'Earth') {
      quests.push('Earth');
    }
    if (summoner.splinter === 'Death') {
      quests.push('Death');
    }
    if (summoner.splinter === 'Life') {
      quests.push('Life');
    }
    if (summoner.splinter === 'Water') {
      quests.push('Water');
    }
    if (summoner.splinter === 'Fire') {
      quests.push('Fire');
    }
    if (summoner.splinter === 'Dragon') {
      quests.push('Dragon');
    }
    if (!_.some(monsters, (it) => it.splinter === 'Neutral')) {
      quests.push('No Neutral');
    }
    if (_.some(monsters, (it) => it.stats.abilities.includes('Sneak'))) {
      quests.push('Sneak');
    }
    if (_.some(monsters, (it) => it.stats.abilities.includes('Snipe'))) {
      quests.push('Snipe');
    }
    return quests;
  }

  async mapDocuments(
    plannerTeams: PlannerTeam[],
    cardPrices: Record<string, number>,
    currency: CurrencyDto,
  ): Promise<PlannerDocument[]> {
    const now = moment().unix();

    const conversionRate = await this.marketService.getConversionRate(
      'usd-coin',
      currency.id,
    );

    return _.chain(plannerTeams)
      .map((team) => {
        const mana =
          team.summoner.stats.mana +
          _.chain(team.monsters)
            .map((it) => it.stats.mana)
            .sum()
            .value();

        const monsters = [];

        const battles = _.chain(team.daily).values().sumBy('battles').value();
        const wins = _.chain(team.daily).values().sumBy('wins').value();

        monsters.push({
          id: team.summoner.id,
          fiatSymbol: currency.symbol,
          icon: `https://d36mxiodymuqjm.cloudfront.net/card_art/${team.summoner.name}.png`,
          level: team.summoner.level,
          mana: team.summoner.stats.mana,
          name: team.summoner.name,
          price: cardPrices[team.summoner.hash],
          splinter: team.summoner.splinter,
          type: 'Summoner',
        });

        // TODO: check if these are added in the right order, order is important
        monsters.push(
          ...team.monsters.map((monster) => ({
            id: monster.id,
            edition: monster.edition,
            fiatSymbol: currency.symbol,
            icon: `https://d36mxiodymuqjm.cloudfront.net/card_art/${monster.name}.png`,
            level: team.summoner.level,
            mana: monster.stats.mana,
            name: monster.name,
            price: cardPrices[monster.hash],
            splinter: monster.splinter,
            type: 'Monster',
          })),
        );

        const price = _.chain(monsters)
          .filter((it) => !!it.price)
          .sumBy('price')
          .thru((it) => it * conversionRate)
          .value();

        const document: PlannerDocument = {
          id: team.id,
          updated: now,
          battles,
          fiatSymbol: currency.symbol,
          mana,
          monsterCount: team.monsters.length,
          monsters,
          owned: price === 0 ? 'Yes' : ' No',
          price,
          quests: this.mapToQuests(team.summoner, team.monsters),
          rulesets: [...team.rulesets],
          splinter: team.summoner.splinter,
          summonerName: team.summoner.name,
          summonerIcon: `https://d36mxiodymuqjm.cloudfront.net/card_art/${team.summoner.name}.png`,
          summonerCardImg: `https://d36mxiodymuqjm.cloudfront.net/cards_by_level/${team.summoner.edition.toLowerCase()}/${
            team.summoner.name
          }_lv${team.summoner.level}.png`,
          summonerEdition: team.summoner.edition,
          winpc: (wins * 100) / battles,
        };

        return document;
      })
      .value();
  }
}
