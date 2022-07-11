import {
  ClientConnectedEvent,
  ClientDisconnectedEvent,
  ClientStateChangedEvent,
  RpcEvent,
} from '@earnkeeper/ekp-sdk';
import { AbstractController, ClientService } from '@earnkeeper/ekp-sdk-nestjs';
import { Injectable } from '@nestjs/common';
import { EmbedService } from './embed.service';
import { EmbedDocument } from './ui/embed.document';
import { PlannerService } from '../planner/planner.service';
import element from './ui/embed.uielement';
import { DEFAULT_EMBED_FORM } from '@/util/constants';

const COLLECTION_NAME = 'embeds';

@Injectable()
export class EmbedController extends AbstractController {
  constructor(
    clientService: ClientService,
    private embedService: EmbedService,
    private plannerService: PlannerService,
  ) {
    super(clientService);
  }

  async onClientConnected(event: ClientConnectedEvent) {
    // Do nothing
  }

  async onClientStateChanged(event: ClientStateChangedEvent) {
    const currency = event.state.client.selectedCurrency;

    const form = event.state.forms?.planner ?? DEFAULT_EMBED_FORM;
    const planner = await this.plannerService.getPlannerDocuments(
      true,
      form,
      event.state.client.subscribed,
      currency,
    );

    const documents = await this.embedService.getEmbedDocuments(planner);

    const embed: EmbedDocument = {
      id: 'splinterlands-battle-planner-tile',
      size: 'tile',
      element: element(),
      data: documents,
      page: 'planner',
    };

    await this.clientService.emitDocuments(event, COLLECTION_NAME, [embed]);
  }

  async onClientRpc(event: RpcEvent) {
    // Do nothing
  }

  async onClientDisconnected(event: ClientDisconnectedEvent) {
    // Do nothing
  }
}
