import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/document.js';
import type { BizObjectItem } from '../types';
import { Card } from '@ui5/webcomponents-react/Card';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { List } from '@ui5/webcomponents-react/List';
import { CardHeader } from '@ui5/webcomponents-react/CardHeader';
import { displayBoStatus, displayBoType } from '../helpers/formatter';
import { ListItemStandard } from '@ui5/webcomponents-react/ListItemStandard';

type BizObjectCardProps = {
  data: BizObjectItem;
  loading?: boolean;
};

export function BizObjectCard({ data, loading }: BizObjectCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      header={
        <CardHeader
          avatar={<Icon name="document" />}
          titleText={data.BoTitle || data.BoId}
          subtitleText={displayBoType(data.BoType)}
          additionalText={displayBoStatus(data.Status)}
          interactive={true}
          onClick={() => navigate(`/business-objects/${data.BoId}`)}
        />
      }
      loading={loading}
    >
      <List>
        <ListItemStandard text="Type" description={displayBoType(data.BoType)} />
        <ListItemStandard
          text="Created At"
          description={data.Erdat && data.Erzet ? `${data.Erdat} ${data.Erzet}` : '-'}
        />
        <ListItemStandard text="Created By" description={data.Ernam || '-'} />
      </List>
    </Card>
  );
}
