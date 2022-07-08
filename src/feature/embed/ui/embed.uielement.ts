import {
  Row,
  Span,
  Col,
  UiElement,
  Div,
  Image,
  Fragment,
  formatCurrency,
  Container,
  formatTemplate,
  formatPercent,
} from '@earnkeeper/ekp-sdk';

export default function element(): UiElement {
  return Div({
    children: [
      Span({
        className: 'font-medium-2',
        content: 'Most Successful Teams',
      }),
      Row({
        children: [
          Col({
            className: 'col-12',
            children: [listingRow(2)],
          }),
          Col({
            className: 'col-12',
            children: [listingRow(1)],
          }),
          Col({
            className: 'col-12',
            children: [listingRow(0)],
          }),
        ],
      }),
    ],
  });
}

function listingRow(documentIndex: number) {
  return Row({
    className: 'pt-1',
    context: `$.data[${documentIndex}]`,
    children: [
      Col({
        className: 'col-auto my-auto',
        children: [
          Image({
            className: 'm-0',
            src: '$.cardArtUrl',
            size: 32,
          }),
        ],
      }),
      Col({
        className: 'pl-0 col-auto',
        children: [
          Span({
            className: 'font-small-3 d-block',
            content: '$.name',
          }),
          Span({
            className: 'font-small-1 d-block',
            content: formatTemplate('{{ battles }} Battles', {
              battles: '$.battles',
            }),
          }),
        ],
      }),
      Col({
        className: 'text-right',
        children: [
          Span({
            className: 'text-success font-small-3 d-block',
            content: formatTemplate('Win Rate {{ winRate }}', {
              winRate: formatPercent('$.winRate'),
            }),
          }),
        ],
      }),
    ],
  });
}
