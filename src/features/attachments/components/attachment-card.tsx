import * as React from 'react';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/document.js';
import { type AttachmentItem } from '../types';
import { useViewStore } from '@/stores/view-store';
import { Card } from '@ui5/webcomponents-react/Card';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { List } from '@ui5/webcomponents-react/List';
import { displayVersion } from '../helpers/formatter';
import { CardHeader } from '@ui5/webcomponents-react/CardHeader';
import { ListItemStandard } from '@ui5/webcomponents-react/ListItemStandard';

interface AttachmentCardProps {
  data: AttachmentItem;
  loading?: boolean;
}

export function AttachmentCard({ data, loading }: AttachmentCardProps) {
  const navigate = useNavigate();
  const selectedFieldIds = useViewStore((state) => state.attachmentListVisibleFieldIds);
  const selectedFieldIdSet = React.useMemo(() => new Set(selectedFieldIds), [selectedFieldIds]);
  const hasTitle = selectedFieldIdSet.has('Title');
  const hasFileId = selectedFieldIdSet.has('FileId');
  const hasCurrentVersion = selectedFieldIdSet.has('CurrentVersion');
  const titleText = selectedFieldIdSet.has('Title') ? data.Title || 'Attachment' : data.FileId || 'Attachment';

  const subtitleText = hasCurrentVersion
    ? `Version ${displayVersion(data.CurrentVersion, '-')}`
    : hasTitle && hasFileId
      ? data.FileId || '-'
      : undefined;

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
        selectedFieldIdSet.has('EditLock') && (
          <ListItemStandard key="EditLock" text="Edit Lock" description={data.EditLock ? 'Enabled' : 'Disabled'} />
        ),
      ].filter(Boolean),
    [data.Aedat, data.Aenam, data.Aezet, data.EditLock, data.Erdat, data.Ernam, data.Erzet, selectedFieldIdSet],
  );

  return (
    <Card
      header={
        <CardHeader
          avatar={<Icon name="document" />}
          titleText={titleText}
          subtitleText={subtitleText}
          interactive={!!data.FileId}
          onClick={() => {
            if (data.FileId) {
              navigate(`/attachments/${data.FileId}`);
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
