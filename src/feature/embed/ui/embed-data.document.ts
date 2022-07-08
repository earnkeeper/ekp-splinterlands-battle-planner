import { DocumentDto } from '@earnkeeper/ekp-sdk';

export class EmbedDataDocument extends DocumentDto {
  constructor(properties: EmbedDataDocument) {
    super(properties);
  }

  readonly name: string;
  readonly splinter: string;
  readonly cardArtUrl: string;
  readonly battles: number;
  readonly winRate: number;
  readonly price: number;
  readonly fiatSymbol: string;
}
