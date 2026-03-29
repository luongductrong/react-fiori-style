import * as React from 'react';
import '@ui5/webcomponents-icons/share.js';
import '@ui5/webcomponents-icons/decline.js';
import '@ui5/webcomponents-icons/arrow-bottom.js';
import { Text } from '@ui5/webcomponents-react/Text';
import { useParams, useNavigate } from 'react-router';
import { Label } from '@ui5/webcomponents-react/Label';
import { Title } from '@ui5/webcomponents-react/Title';
import { Toast } from '@ui5/webcomponents-react/Toast';
import { Input } from '@ui5/webcomponents-react/Input';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { downloadFile } from '@/features/attachments/helpers';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { Breadcrumbs } from '@ui5/webcomponents-react/Breadcrumbs';
import { BusyIndicator } from '@ui5/webcomponents-react/BusyIndicator';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { AttachmentBizObjects } from '@/features/attachments/components';
import { BreadcrumbsItem } from '@ui5/webcomponents-react/BreadcrumbsItem';
import { ObjectPageTitle } from '@ui5/webcomponents-react/ObjectPageTitle';
import { ObjectPageHeader } from '@ui5/webcomponents-react/ObjectPageHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjectPageSection } from '@ui5/webcomponents-react/ObjectPageSection';
import { attachmentDetailQueryOptions } from '@/features/attachments/options/query';
import { deleteAttachmentMutationOptions } from '@/features/attachments/options/mutation';
import { updateAttachmentTitleMutationOptions } from '@/features/attachments/options/mutation';
import { AttachmentVersion, AttachmentAudit, FilePreview } from '@/features/attachments/components';

export function AttachmentsDetailView() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [toastVisible, setToastVisible] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const { data: attachment, isLoading } = useQuery(
    attachmentDetailQueryOptions(id!, {
      'sap-client': 324,
      $select: 'CurrentVersion,Erdat,Ernam,FileId,IsActive,Title,__EntityControl/Deletable,__EntityControl/Updatable',
      $expand: '_CurrentVersion($select=FileContent,FileId,FileName,MimeType,VersionNo)',
    }),
  );

  const { mutate: updateAttachmentTitle, isPending: isUpdating } = useMutation(
    updateAttachmentTitleMutationOptions({
      fileId: id!,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['attachments', id],
        });
        alert('Title updated successfully');
        setIsEditMode(false);
      },
      onError: (error) => {
        alert(error?.response?.data?.error?.message || error.message);
      },
    }),
  );

  const { mutate: deleteAttachment, isPending: isDeleting } = useMutation(
    deleteAttachmentMutationOptions({
      fileId: id!,
      onSuccess: () => {
        alert('Attachment deleted successfully');
        queryClient.invalidateQueries({
          queryKey: ['attachments'],
        });
        navigate('/attachments');
      },
      onError: (error) => {
        setToastMessage(error?.response?.data?.error?.message || error.message);
        setToastVisible(true);
      },
    }),
  );

  const handleSave = () => {
    if (!title) {
      alert('Title cannot be empty');
      return;
    }
    updateAttachmentTitle({ Title: title });
  };

  return (
    <div className="relative">
      <ObjectPage
        headerArea={
          <ObjectPageHeader>
            <FlexBox alignItems="Center" justifyContent="SpaceBetween" wrap="Wrap" className="p-2">
              <FlexBox direction="Column" className="w-1/2">
                <Label>Current Version</Label>
                <Text>{attachment?.CurrentVersion}</Text>
              </FlexBox>
              <FlexBox direction="Column" className="w-1/2">
                <Label>Is Active</Label>
                <Text>{attachment ? (attachment?.IsActive ? 'Yes' : 'No') : ''}</Text>
              </FlexBox>
            </FlexBox>
            <FlexBox alignItems="Center" justifyContent="SpaceBetween" wrap="Wrap" className="p-2">
              <FlexBox direction="Column" className="w-1/2">
                <Label>Created On</Label>
                <Text>{attachment?.Erdat}</Text>
              </FlexBox>
              <FlexBox direction="Column" className="w-1/2">
                <Label>Created By</Label>
                <Text>{attachment?.Ernam}</Text>
              </FlexBox>
            </FlexBox>
          </ObjectPageHeader>
        }
        image={
          <FilePreview
            mimeType={attachment?._CurrentVersion?.MimeType}
            fileContent={attachment?._CurrentVersion?.FileContent}
            fileName={attachment?._CurrentVersion?.FileName}
            className="aspect-square"
            onlyImage={true}
          />
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
                {!isEditMode && (
                  <>
                    <ToolbarButton
                      icon="arrow-bottom"
                      tooltip="Download current version"
                      onClick={() => {
                        if (!attachment?._CurrentVersion) return;
                        const success = downloadFile(
                          attachment._CurrentVersion.FileContent,
                          attachment._CurrentVersion.FileName,
                          attachment._CurrentVersion.MimeType,
                        );
                        if (!success) {
                          setToastMessage('Failed to download file.');
                          setToastVisible(true);
                        }
                      }}
                      disabled={!attachment?._CurrentVersion?.FileContent || !attachment?._CurrentVersion?.MimeType}
                    />
                    <ToolbarButton
                      design="Emphasized"
                      text="Edit"
                      onClick={() => setIsEditMode(true)}
                      disabled={!attachment?.__EntityControl?.Updatable}
                    />
                    <ToolbarButton
                      design="Transparent"
                      text="Delete"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={isDeleting || !attachment?.__EntityControl?.Deletable}
                    />
                  </>
                )}
                {isEditMode && (
                  <>
                    <ToolbarButton design="Emphasized" text="Save" onClick={handleSave} disabled={!title} />
                    <ToolbarButton design="Transparent" text="Cancel" onClick={() => setIsEditMode(false)} />
                  </>
                )}
              </Toolbar>
            }
            breadcrumbs={
              <Breadcrumbs onItemClick={() => navigate('/attachments')}>
                <BreadcrumbsItem>Attachments</BreadcrumbsItem>
                <BreadcrumbsItem>{isLoading ? 'Loading...' : attachment?.Title || 'Unnamed Object'}</BreadcrumbsItem>
              </Breadcrumbs>
            }
            header={
              isEditMode ? (
                <Input
                  icon={null}
                  placeholder={attachment?.Title}
                  style={{
                    minWidth: '400px',
                  }}
                  type="Text"
                  valueState="None"
                  onClick={(e) => e.stopPropagation()}
                  className="h-full"
                  value={title}
                  onInput={(e) => setTitle(e.target.value)}
                />
              ) : (
                <Title level="H2">{isLoading ? 'Loading...' : attachment?.Title || 'Unnamed Object'}</Title>
              )
            }
            subHeader={isLoading ? 'Loading...' : attachment?.FileId || 'Unnamed Object'}
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
      >
        {isLoading && (
          <FlexBox alignItems="Center" justifyContent="Center" style={{ padding: '1rem', minHeight: '50dvh' }}>
            <BusyIndicator delay={0} active size="L" />
          </FlexBox>
        )}
        <ObjectPageSection
          aria-label="Versions"
          id="versions"
          titleText="Versions"
          style={{ display: isLoading ? 'none' : 'block' }}
        >
          <AttachmentVersion fileId={id!} />
        </ObjectPageSection>
        <ObjectPageSection
          aria-label="Audit"
          id="audit"
          titleText="Audit"
          style={{ display: isLoading ? 'none' : 'block' }}
        >
          <AttachmentAudit fileId={id!} />
        </ObjectPageSection>
        <ObjectPageSection
          aria-label="Business Objects"
          id="business-objects"
          titleText="Business Objects"
          style={{ display: isLoading ? 'none' : 'block' }}
        >
          <AttachmentBizObjects fileId={id!} />
        </ObjectPageSection>
        <ObjectPageSection
          aria-label="File Preview"
          id="file-preview"
          titleText="File Preview"
          style={{ display: isLoading ? 'none' : 'block' }}
        >
          <div className="p-2 rounded-lg bg-background">
            <FilePreview
              mimeType={attachment?._CurrentVersion?.MimeType}
              fileContent={attachment?._CurrentVersion?.FileContent}
              fileName={attachment?._CurrentVersion?.FileName}
            />
          </div>
        </ObjectPageSection>
        <Toast open={toastVisible} onClose={() => setToastVisible(false)} duration={2000} className="py-1 px-2">
          {toastMessage}
        </Toast>
      </ObjectPage>
      <MessageBox
        open={deleteDialogOpen}
        type="Confirm"
        titleText="Delete Attachment"
        actions={['Cancel', 'OK']}
        onClose={(action) => {
          setDeleteDialogOpen(false);
          if (action === 'OK' && attachment?.FileId) {
            deleteAttachment();
          }
        }}
      >
        Are you sure you want to delete this attachment? This action cannot be undone.
      </MessageBox>
      {(isUpdating || isDeleting) && (
        <FlexBox
          alignItems="Center"
          justifyContent="Center"
          style={{
            padding: '1rem',
            minHeight: '50dvh',
            position: 'absolute',
            inset: 0,
          }}
        >
          <BusyIndicator delay={0} active size="L" />
        </FlexBox>
      )}
    </div>
  );
}
