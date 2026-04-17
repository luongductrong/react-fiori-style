import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/document.js';
import { Card } from '@ui5/webcomponents-react/Card';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { List } from '@ui5/webcomponents-react/List';
import { CardHeader } from '@ui5/webcomponents-react/CardHeader';
import { ListItemStandard } from '@ui5/webcomponents-react/ListItemStandard';

type Attachment = {
  FileId: string;
  Title: string;
  CurrentVersion: string | number;
  IsActive: boolean;
  Erdat: string;
  Ernam: string;
};

type AttachmentCardProps = {
  data: Attachment;
  isAdmin: boolean;
  loading?: boolean;
};

export function AttachmentCard({ data, isAdmin, loading }: AttachmentCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      header={
        <CardHeader
          avatar={<Icon name="document" />}
          titleText={data.Title}
          subtitleText={`Version ${data.CurrentVersion}`}
          additionalText={isAdmin ? (data.IsActive ? 'Active' : 'Inactive') : undefined}
          interactive={true}
          onClick={() => navigate(`/attachments/${data.FileId}`)}
        />
      }
      loading={loading}
    >
      <List>
        {isAdmin && <ListItemStandard text="Is Active" description={data.IsActive ? 'Yes' : 'No'} />}
        <ListItemStandard text="Created On" description={data.Erdat} />
        <ListItemStandard text="Created By" description={data.Ernam} />
      </List>
    </Card>
  );
}
