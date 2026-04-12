import * as React from 'react';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/decline.js';
import { pushErrorMessages } from '@/libs/errors';
import { Input } from '@ui5/webcomponents-react/Input';
import { Title } from '@ui5/webcomponents-react/Title';
import { Label } from '@ui5/webcomponents-react/Label';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { BusyIndicator } from '@/components/busy-indicator';
import { CheckBox } from '@ui5/webcomponents-react/CheckBox';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { Breadcrumbs } from '@ui5/webcomponents-react/Breadcrumbs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { BreadcrumbsItem } from '@ui5/webcomponents-react/BreadcrumbsItem';
import { ObjectPageTitle } from '@ui5/webcomponents-react/ObjectPageTitle';
import type { CreateAttachmentPayload } from '@/features/attachments/types';
import { ObjectPageHeader } from '@ui5/webcomponents-react/ObjectPageHeader';
import { createAttachmentMutationOptions } from '@/features/attachments/options/mutation';

export function AttachmentNewView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = React.useState<CreateAttachmentPayload>({
    Title: '',
    EditLock: false,
  });
  const { mutate: createAttachment, isPending: isCreating } = useMutation(
    createAttachmentMutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['attachments'],
        });
        navigate(`/attachments/${data.FileId}`);
      },
    }),
  );

  const handleCreate = () => {
    const trimmedTitle = formData.Title.trim();

    if (!trimmedTitle) {
      pushErrorMessages(['Title cannot be empty']);
      return;
    }

    createAttachment({
      Title: trimmedTitle,
      EditLock: formData.EditLock,
    });
  };

  return (
    <div className="relative">
      <ObjectPage
        headerArea={
          <ObjectPageHeader>
            <FlexBox alignItems="End" justifyContent="Start" wrap="Wrap" className="p-2" style={{ gap: '1rem' }}>
              <FlexBox direction="Column" style={{ minWidth: '20rem', flex: 1 }}>
                <Label>Title</Label>
                <Input
                  value={formData.Title}
                  placeholder="Enter attachment title"
                  onInput={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      Title: e.target.value,
                    }))
                  }
                  style={{ width: '50%' }}
                />
              </FlexBox>
              <FlexBox direction="Column" style={{ minWidth: '12rem' }}>
                <Label>Edit Lock</Label>
                <CheckBox
                  checked={formData.EditLock}
                  text="Enable edit lock"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      EditLock: e.target.checked ?? false,
                    }))
                  }
                />
              </FlexBox>
            </FlexBox>
          </ObjectPageHeader>
        }
        mode="Default"
        onBeforeNavigate={function fQ() {}}
        hidePinButton={true}
        onSelectedSectionChange={function fQ() {}}
        onToggleHeaderArea={function fQ() {}}
        titleArea={
          <ObjectPageTitle
            actionsBar={
              <Toolbar design="Transparent" style={{ height: 'auto' }}>
                <ToolbarButton
                  design="Emphasized"
                  text="Create"
                  onClick={handleCreate}
                  disabled={isCreating || !formData.Title.trim()}
                />
                <ToolbarButton
                  design="Transparent"
                  text="Cancel"
                  onClick={() => navigate('/attachments')}
                  disabled={isCreating}
                />
              </Toolbar>
            }
            breadcrumbs={
              <Breadcrumbs onItemClick={() => navigate('/attachments')}>
                <BreadcrumbsItem>Attachments</BreadcrumbsItem>
                <BreadcrumbsItem>New Attachment</BreadcrumbsItem>
              </Breadcrumbs>
            }
            header={<Title level="H2">New Attachment</Title>}
            navigationBar={
              <Button
                accessibleName="Close"
                design="Transparent"
                icon="decline"
                tooltip="Close"
                onClick={() => navigate('/attachments')}
              />
            }
          />
        }
      />
      <BusyIndicator type="pending" show={isCreating} />
    </div>
  );
}
