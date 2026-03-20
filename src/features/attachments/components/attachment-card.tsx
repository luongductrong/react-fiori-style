import { Card } from "@ui5/webcomponents-react/Card";
import { CardHeader } from "@ui5/webcomponents-react/CardHeader";
import { Icon } from "@ui5/webcomponents-react/Icon";
import { List } from "@ui5/webcomponents-react/List";
import { ListItemStandard } from "@ui5/webcomponents-react/ListItemStandard";
import { CheckBox } from "@ui5/webcomponents-react/CheckBox";
import "@ui5/webcomponents-icons/document.js";
import { useNavigate } from "react-router";

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
  selected?: boolean;
  onSelectChange?: (checked: boolean) => void;
  loading?: boolean;
};

export function AttachmentCard({
  data,
  selected = false,
  onSelectChange,
  loading,
}: AttachmentCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      header={
        <CardHeader
          avatar={<Icon name="document" />}
          titleText={data.Title}
          subtitleText={`Version ${data.CurrentVersion}`}
          additionalText={data.IsActive ? "Active" : "Inactive"}
          interactive={true}
          onClick={() => navigate(`/Attachments/${data.FileId}`)}
          action={
            <CheckBox
              checked={selected}
              onChange={(e) => onSelectChange?.(e.target.checked ?? false)}
            />
          }
        />
      }
      loading={loading}
    >
      <List>
        <ListItemStandard
          text="Is Active"
          description={data.IsActive ? "Yes" : "No"}
        />
        <ListItemStandard text="Created On" description={data.Erdat} />
        <ListItemStandard text="Created By" description={data.Ernam} />
      </List>
    </Card>
  );
}
