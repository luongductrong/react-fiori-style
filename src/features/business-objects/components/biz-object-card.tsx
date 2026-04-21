import * as React from 'react';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/document.js';
import type { BizObjectItem } from '../types';
import { useViewStore } from '@/stores/view-store';
import { Card } from '@ui5/webcomponents-react/Card';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { List } from '@ui5/webcomponents-react/List';
import { CardHeader } from '@ui5/webcomponents-react/CardHeader';
import { displayBoStatus, displayBoType } from '../helpers/formatter';
import { ListItemStandard } from '@ui5/webcomponents-react/ListItemStandard';

interface BizObjectCardProps {
  data: BizObjectItem;
  loading?: boolean;
}

export function BizObjectCard({ data, loading }: BizObjectCardProps) {
  const navigate = useNavigate();
  const selectedFieldIds = useViewStore((state) => state.boListVisibleFieldIds);
  const selectedFieldIdSet = React.useMemo(() => new Set(selectedFieldIds), [selectedFieldIds]);
  const hasBoTitle = selectedFieldIdSet.has('BoTitle');
  const hasBoId = selectedFieldIdSet.has('BoId');
  const hasBoType = selectedFieldIdSet.has('BoType');
  const titleText = hasBoTitle ? data.BoTitle || 'Business Object' : data.BoId || 'Business Object';
  const subtitleText = hasBoType
    ? displayBoType(data.BoType || '')
    : hasBoTitle && hasBoId
      ? data.BoId || '-'
      : undefined;
  const additionalText = selectedFieldIdSet.has('Status') ? displayBoStatus(data.Status || '') : undefined;
  const detailItems = React.useMemo(
    () =>
      [
        selectedFieldIdSet.has('Erdat') && (
          <ListItemStandard key="Erdat" text="Created On" description={data.Erdat || '-'} />
        ),
        selectedFieldIdSet.has('Erzet') && (
          <ListItemStandard key="Erzet" text="Created At" description={data.Erzet || '-'} />
        ),
        selectedFieldIdSet.has('Ernam') && (
          <ListItemStandard key="Ernam" text="Created By" description={data.Ernam || '-'} />
        ),
        selectedFieldIdSet.has('Aedat') && (
          <ListItemStandard key="Aedat" text="Changed On" description={data.Aedat || '-'} />
        ),
        selectedFieldIdSet.has('Aezet') && (
          <ListItemStandard key="Aezet" text="Changed At" description={data.Aezet || '-'} />
        ),
        selectedFieldIdSet.has('Aenam') && (
          <ListItemStandard key="Aenam" text="Changed By" description={data.Aenam || '-'} />
        ),
      ].filter(Boolean),
    [data.Aedat, data.Aenam, data.Aezet, data.Erdat, data.Ernam, data.Erzet, selectedFieldIdSet],
  );

  return (
    <Card
      header={
        <CardHeader
          avatar={<Icon name="document" />}
          titleText={titleText}
          subtitleText={subtitleText}
          additionalText={additionalText}
          interactive={!!data.BoId}
          onClick={() => {
            if (data.BoId) {
              navigate(`/business-objects/${data.BoId}`);
            }
          }}
        />
      }
      loading={loading}
    >
      {detailItems.length > 0 && <List>{detailItems}</List>}
    </Card>
  );
}
