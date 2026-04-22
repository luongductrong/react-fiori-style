import * as React from 'react';
import axios from 'axios';
import { toast } from '@/libs/helpers/toast';
import '@ui5/webcomponents-icons/decline.js';
import '@ui5/webcomponents-icons/refresh.js';
import '@ui5/webcomponents-icons/attachment.js';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Text } from '@ui5/webcomponents-react/Text';
import { useParams, useNavigate } from 'react-router';
import { Label } from '@ui5/webcomponents-react/Label';
import { API } from '@/features/attachments/constants';
import { Title } from '@ui5/webcomponents-react/Title';
import { MutationBar } from '@/components/mutation-bar';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { BusyIndicator } from '@/components/busy-indicator';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useCurrentAuthUser } from '@/features/auth-users/hooks';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { AttachmentBizList } from '@/features/attachments/components';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { NotFoundIllustrated } from '@/components/not-found-illustrated';
import { displayVersion } from '@/features/attachments/helpers/formatter';
import { ObjectPageTitle } from '@ui5/webcomponents-react/ObjectPageTitle';
import { useInvalidateAttachmentQuery } from '@/features/attachments/hooks';
import { downloadFile } from '@/features/attachments/helpers/download-file';
import { useInvalidateConfigFileQuery } from '@/features/config-files/hooks';
import { ObjectPageSection } from '@ui5/webcomponents-react/ObjectPageSection';
import { displayDetailDate, displayDetailTime } from '@/libs/helpers/date-time';
import { validateFileTitle } from '@/features/attachments/helpers/input-validate';
import { attachmentDetailQueryOptions } from '@/features/attachments/options/query';
import { deleteAttachmentMutationOptions } from '@/features/attachments/options/mutation';
import { restoreAttachmentMutationOptions } from '@/features/attachments/options/mutation';
import { updateAttachmentTitleMutationOptions } from '@/features/attachments/options/mutation';
import { pushErrorMessages, pushApiErrorMessages, getError } from '@/libs/helpers/error-messages';
import { AttachmentVersionList, AttachmentAudit, FilePreview } from '@/features/attachments/components';
import { AttachmentForm, type AttachmentFormValues } from '@/features/attachments/components/attachment-form';

export function AttachmentDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invalidateAtt = useInvalidateAttachmentQuery();
  const invalidateConfig = useInvalidateConfigFileQuery();
  const { data: currentAuthUser, isPending: isAuthPending } = useCurrentAuthUser();
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [titleError, setTitleError] = React.useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editValues, setEditValues] = React.useState<AttachmentFormValues>({
    title: '',
    editLock: false,
  });
  const {
    data: attachment,
    isFetching,
    error: attachmentError,
  } = useQuery(
    attachmentDetailQueryOptions(id!, {
      $expand: API.detailExpand,
    }),
  );

  const { mutate: updateAttachment, isPending: isUpdating } = useMutation(
    updateAttachmentTitleMutationOptions({
      fileId: id!,
      onSuccess: () => {
        invalidateAtt.invalidateAttachmentDetail(id!);
        invalidateAtt.invalidateAttachmentTitle(id!);
        toast('Attachment updated successfully');
        setIsEditMode(false);
        setTitleError('');
      },
    }),
  );

  const { mutate: deleteAttachment, isPending: isDeleting } = useMutation(
    deleteAttachmentMutationOptions({
      fileId: id!,
      onSuccess: () => {
        invalidateAtt.invalidateAttachmentList();
        invalidateAtt.invalidateAttachmentDetail(id!);
        toast('Attachment deleted successfully');
        navigate('/attachments');
      },
    }),
  );

  const { mutate: restoreAttachment, isPending: isRestoring } = useMutation(
    restoreAttachmentMutationOptions({
      onSuccess: () => {
        invalidateAtt.invalidateAttachmentList();
        invalidateAtt.invalidateAttachmentDetail(id!);
        toast('Attachment restored successfully');
      },
    }),
  );

  const isAdmin = currentAuthUser?.isAdmin ?? false;
  const username = currentAuthUser?.username ?? null;
  const isOwner = username === attachment?.Ernam;
  const canModifyLockedAttachment = !attachment?.EditLock || (!isAuthPending && (isOwner || isAdmin));
  const canEditAttachment = Boolean(
    attachment?.IsActive && attachment.__EntityControl?.Updatable && canModifyLockedAttachment,
  );
  const canDeleteAttachment = Boolean(
    attachment?.IsActive && attachment.__EntityControl?.Deletable && canModifyLockedAttachment,
  );

  const refetchAttachment = function () {
    invalidateAtt.invalidateAttachmentDetail(id!);
    invalidateAtt.invalidateAttachmentVersions(id!);
    invalidateAtt.invalidateAttachmentAudit(id!);
    invalidateAtt.invalidateAttachmentTitle(id!);
    invalidateAtt.invalidateAttachmentCurrentVersion(id!);
    invalidateAtt.invalidateAttachmentBoLinks(id!);
    invalidateConfig.invalidateConfigFileList();
  };

  const handleEditModeOn = function () {
    if (!canEditAttachment) {
      return;
    }

    setEditValues({
      title: attachment?.Title || '',
      editLock: attachment?.EditLock ?? false,
    });
    setTitleError('');
    setIsEditMode(true);
  };

  const handleEditFormChange = function (nextValues: AttachmentFormValues) {
    setEditValues(nextValues);
    if (nextValues.title !== editValues.title) {
      setTitleError(validateFileTitle(nextValues.title));
    }
  };

  const handleSave = function () {
    const nextTitleError = validateFileTitle(editValues.title);

    setTitleError(nextTitleError);

    if (nextTitleError) {
      return;
    }

    updateAttachment({
      Title: editValues.title.trim(),
      EditLock: editValues.editLock,
    });
  };

  const isAttachmentNotFound = axios.isAxiosError(attachmentError) && attachmentError.response?.status === 404;

  React.useEffect(() => {
    if (attachmentError && !isAttachmentNotFound) {
      pushApiErrorMessages(attachmentError);
    }
  }, [attachmentError, isAttachmentNotFound]);

  if (attachmentError && isAttachmentNotFound) {
    return (
      <NotFoundIllustrated
        title="Attachment Not Found"
        subtitle={getError(attachmentError)[0]}
        breadcrumbRoute="/attachments"
        breadcrumbText="Attachments"
      />
    );
  }

  return (
    <div className="relative flex-1">
      <ObjectPage
        image={
          <div className="border rounded-lg aspect-square flex! items-center justify-center p-2">
            <Icon name="attachment" className="w-full h-full text-primary" />
          </div>
        }
        mode="Default"
        hidePinButton={true}
        titleArea={
          <ObjectPageTitle
            actionsBar={
              !isEditMode ? (
                <Toolbar design="Transparent" style={{ height: 'auto' }}>
                  {attachment && canEditAttachment && (
                    <ToolbarButton
                      design="Emphasized"
                      text="Edit"
                      onClick={() => handleEditModeOn()}
                      disabled={!canEditAttachment}
                    />
                  )}
                  {isAdmin && attachment && !attachment.IsActive && attachment.__OperationControl?.Reactivate && (
                    <ToolbarButton
                      design="Default"
                      text="Restore"
                      onClick={() => restoreAttachment(id!)}
                      disabled={attachment.IsActive || isRestoring}
                    />
                  )}
                  {attachment && canDeleteAttachment && (
                    <ToolbarButton
                      design="Default"
                      text="Delete"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={isDeleting || !canDeleteAttachment}
                    />
                  )}
                  <ToolbarButton
                    design="Default"
                    text="Download"
                    onClick={() => {
                      if (!attachment?._CurrentVersion) return;
                      const success = downloadFile(
                        attachment._CurrentVersion.FileContent,
                        attachment._CurrentVersion.FileName,
                        attachment._CurrentVersion.MimeType,
                      );
                      if (!success) {
                        pushErrorMessages(['Failed to download file.']);
                      }
                    }}
                    disabled={!attachment?._CurrentVersion?.FileContent || !attachment?._CurrentVersion?.MimeType}
                  />
                  <ToolbarButton
                    design="Default"
                    icon="refresh"
                    tooltip="Refresh"
                    onClick={() => refetchAttachment()}
                    disabled={isFetching}
                    // TODO: Disable all Refresh buttons when isFetching is true
                  />
                </Toolbar>
              ) : undefined
            }
            header={<Title level="H2">{isFetching ? 'Loading...' : attachment?.Title || 'Unnamed Object'}</Title>}
            subHeader={isFetching ? 'Loading...' : attachment?.FileId || 'Unnamed Object'}
            navigationBar={
              <Button
                accessibleName="Close"
                design="Transparent"
                icon="decline"
                tooltip="Close"
                onClick={() => navigate(-1)}
              />
            }
          />
        }
      >
        {isFetching && <BusyIndicator type="loading" />}
        <ObjectPageSection
          aria-label="General Information"
          id="general"
          titleText="General Information"
          hideTitleText={true}
          style={{ display: isFetching ? 'none' : 'block' }}
        >
          <div className="md:grid md:grid-cols-3 gap-3">
            <div className="space-y-3">
              <Title level="H3">Basic Data</Title>
              {isEditMode ? (
                <AttachmentForm
                  value={editValues}
                  onChange={handleEditFormChange}
                  titleError={titleError}
                  inputClassName="md:w-full"
                  canChangeLockEdit={isAdmin || isOwner}
                />
              ) : (
                <React.Fragment>
                  <div className="flex flex-col">
                    <Label showColon>Title</Label>
                    <Text>{attachment?.Title || '-'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Edit Lock</Label>
                    <Text>{attachment ? (attachment.EditLock ? 'Enabled' : 'Disabled') : '-'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Current Version</Label>
                    <Text>{displayVersion(attachment?.CurrentVersion, '-')}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Is Active</Label>
                    <Text>{attachment ? (attachment.IsActive ? 'Yes' : 'No') : '-'}</Text>
                  </div>
                </React.Fragment>
              )}
            </div>
            <div className="space-y-3 md:col-span-2">
              <Title level="H3">Audit Information</Title>
              <div className="md:grid md:grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <Label showColon>Created By</Label>
                    <Text>{attachment?.Ernam || '-'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Created On</Label>
                    <Text>{displayDetailDate(attachment?.Erdat, attachment?.Erzet)}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Created At</Label>
                    <Text>{displayDetailTime(attachment?.Erdat, attachment?.Erzet)}</Text>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <Label showColon>Last Changed By</Label>
                    <Text>{attachment?.Aenam || '-'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Last Changed On</Label>
                    <Text>{displayDetailDate(attachment?.Aedat, attachment?.Aezet)}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Last Changed At</Label>
                    <Text>{displayDetailTime(attachment?.Aedat, attachment?.Aezet)}</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ObjectPageSection>
        <ObjectPageSection
          aria-label="Preview"
          id="preview"
          titleText="Preview"
          style={{ display: isFetching ? 'none' : 'block' }}
        >
          <div className="p-2 rounded-lg bg-background">
            <FilePreview
              mimeType={attachment?._CurrentVersion?.MimeType}
              fileContent={attachment?._CurrentVersion?.FileContent}
              fileName={attachment?._CurrentVersion?.FileName}
              fileExtension={attachment?._CurrentVersion?.FileExtension}
            />
          </div>
        </ObjectPageSection>
        <ObjectPageSection
          aria-label="Version History"
          id="version-history"
          titleText="Version History"
          style={{ display: isFetching ? 'none' : 'block' }}
        >
          <AttachmentVersionList
            fileId={id!}
            disabled={!canEditAttachment}
            currentVersionNo={attachment?.CurrentVersion || '0'}
            currentExtension={attachment?._CurrentVersion?.FileExtension || ''}
          />
        </ObjectPageSection>
        <ObjectPageSection
          aria-label="Linked Objects"
          id="linked-objects"
          titleText="Linked Objects"
          style={{ display: isFetching ? 'none' : 'block' }}
        >
          <AttachmentBizList fileId={id!} disabled={!canEditAttachment} />
        </ObjectPageSection>
        <ObjectPageSection
          aria-label="Audit Log"
          id="audit-log"
          titleText="Audit Log"
          style={{ display: isFetching ? 'none' : 'block' }}
        >
          <AttachmentAudit fileId={id!} />
        </ObjectPageSection>
        {isEditMode && (
          <MutationBar
            okText="Save"
            cancelText="Discard"
            onOk={handleSave}
            onCancel={() => {
              setIsEditMode(false);
              setTitleError('');
            }}
            disabledOk={
              isUpdating ||
              !editValues.title.trim() ||
              !!titleError ||
              (editValues.title.trim() === (attachment?.Title ?? '').trim() &&
                editValues.editLock === (attachment?.EditLock ?? false))
            }
            disabledCancel={isUpdating}
          />
        )}
      </ObjectPage>
      <MessageBox
        open={deleteDialogOpen}
        type="Confirm"
        titleText="Delete Attachment"
        actions={['Cancel', 'OK']}
        onClose={(action) => {
          setDeleteDialogOpen(false);
          if (action === 'OK' && attachment?.FileId && canDeleteAttachment) {
            deleteAttachment();
          } else if (action === 'OK' && attachment?.FileId && !canDeleteAttachment) {
            pushErrorMessages(['You do not have permission to delete this attachment']);
          }
        }}
      >
        Are you sure you want to delete this attachment? This action cannot be undone.
      </MessageBox>
      {(isUpdating || isDeleting || isRestoring) && <BusyIndicator type="pending" />}
    </div>
  );
}
