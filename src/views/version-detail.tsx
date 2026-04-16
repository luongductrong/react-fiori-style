import * as React from 'react';
import axios from 'axios';
import { toast } from '@/libs/toast';
import { useParams } from 'react-router';
import '@ui5/webcomponents-icons/share.js';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/decline.js';
import '@ui5/webcomponents-icons/refresh.js';
import '@ui5/webcomponents-icons/document.js';
import { getError } from '@/libs/error-message';
import { Text } from '@ui5/webcomponents-react/Text';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { API } from '@/features/attachments/constants';
import { Title } from '@ui5/webcomponents-react/Title';
import { Label } from '@ui5/webcomponents-react/Label';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { BusyIndicator } from '@/components/busy-indicator';
import { FilePreview } from '@/features/attachments/components';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { Breadcrumbs } from '@ui5/webcomponents-react/Breadcrumbs';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { pushErrorMessages, pushApiErrorMessages } from '@/libs/errors';
import { NotFoundIllustrated } from '@/components/not-found-illustrated';
import { BreadcrumbsItem } from '@ui5/webcomponents-react/BreadcrumbsItem';
import { ObjectPageTitle } from '@ui5/webcomponents-react/ObjectPageTitle';
import { downloadFile, formatFileSize } from '@/features/attachments/helpers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjectPageSection } from '@ui5/webcomponents-react/ObjectPageSection';
import { attachmentTitleQueryOptions } from '@/features/attachments/options/query';
import { rollbackVersionMutationOptions } from '@/features/attachments/options/mutation';
import { attachmentVersionDetailQueryOptions } from '@/features/attachments/options/query';
import { attachmentCurrentVersionQueryOptions } from '@/features/attachments/options/query';

export function VersionDetailView() {
  const { id, versionNo } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: version,
    isFetching: isVersionFetching,
    error: dataError,
  } = useQuery(
    attachmentVersionDetailQueryOptions(id!, versionNo!, {
      'sap-client': 324,
      $select: API.versionDetailSelect,
    }),
  );
  const {
    data: title,
    isFetching: isTitleFetching,
    error: titleError,
  } = useQuery(
    attachmentTitleQueryOptions(id!, {
      'sap-client': 324,
    }),
  );
  const {
    data: currentVersion,
    isFetching: isCurrentVersionFetching,
    error: currentVersionError,
  } = useQuery(
    attachmentCurrentVersionQueryOptions(id!, {
      'sap-client': 324,
    }),
  );

  const { mutate: rollbackVersion, isPending: isRollbacking } = useMutation(
    rollbackVersionMutationOptions({
      fileId: id!,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['attachments', id],
        });
        toast(`Version ${versionNo} is now current`);
      },
    }),
  );

  const isFetching = isVersionFetching || isTitleFetching || isCurrentVersionFetching;

  const attachmentNotFoundError =
    (axios.isAxiosError(titleError) && titleError.response?.status === 404 ? titleError : null) ??
    (axios.isAxiosError(currentVersionError) && currentVersionError.response?.status === 404
      ? currentVersionError
      : null);

  const versionNotFoundError = axios.isAxiosError(dataError) && dataError.response?.status === 404 ? dataError : null;

  const notFoundError = attachmentNotFoundError ?? versionNotFoundError;

  const refetchVersion = function () {
    queryClient.invalidateQueries({
      queryKey: ['attachments', id],
    });
  };

  React.useEffect(() => {
    if (dataError && dataError !== versionNotFoundError) {
      pushApiErrorMessages(dataError);
    }
    if (titleError && titleError !== attachmentNotFoundError) {
      pushApiErrorMessages(attachmentNotFoundError);
    }
  }, [dataError, titleError, attachmentNotFoundError, versionNotFoundError]);

  if (notFoundError) {
    return (
      <NotFoundIllustrated
        title={attachmentNotFoundError ? 'Attachment Not Found' : 'Version Not Found'}
        subtitle={getError(notFoundError)[0]}
        breadcrumbRoute={attachmentNotFoundError ? '/attachments' : `/attachments/${id}`}
        breadcrumbText="Attachments"
      />
    );
  }

  return (
    <div className="relative">
      <ObjectPage
        hidePinButton={true}
        image={
          <div className="border rounded-lg aspect-square flex! items-center justify-center p-2">
            <Icon name="document" className="w-full h-full text-primary" />
          </div>
        }
        mode="Default"
        titleArea={
          <ObjectPageTitle
            actionsBar={
              <Toolbar design="Transparent" style={{ height: 'auto' }}>
                <ToolbarButton
                  design="Emphasized"
                  text="Download"
                  onClick={() => {
                    if (!version) return;
                    const success = downloadFile(version.FileContent, version.FileName, version.MimeType);
                    if (!success) {
                      pushErrorMessages(['Failed to download file.']);
                    }
                  }}
                  disabled={!version?.FileContent || !version?.MimeType}
                />
                {version && version?.VersionNo !== currentVersion?.value && (
                  <ToolbarButton
                    design="Default"
                    text="Set as Current Version"
                    onClick={() => {
                      if (!version) return;
                      rollbackVersion({
                        CurrentVersion: version.VersionNo,
                      });
                    }}
                    disabled={isRollbacking || isFetching}
                  />
                )}
                <ToolbarButton
                  design="Default"
                  icon="refresh"
                  tooltip="Refresh"
                  onClick={() => refetchVersion()}
                  disabled={isFetching}
                />
              </Toolbar>
            }
            breadcrumbs={
              <Breadcrumbs
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) {
                    navigate(route);
                  }
                }}
              >
                <BreadcrumbsItem data-route="/attachments">Attachments</BreadcrumbsItem>
                <BreadcrumbsItem data-route={`/attachments/${id}`}>
                  {isFetching ? 'Loading...' : title?.value || 'Unnamed Object'}
                </BreadcrumbsItem>
                <BreadcrumbsItem>{isFetching ? 'Loading...' : version?.FileName || 'Unnamed Object'}</BreadcrumbsItem>
              </Breadcrumbs>
            }
            header={<Title level="H2">{isFetching ? 'Loading...' : version?.FileName || 'Unnamed Object'}</Title>}
            subHeader={isFetching ? 'Loading...' : `Version ${version?.VersionNo || versionNo || '-'}`}
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
            <div className="space-y-3 md:col-span-2">
              <Title level="H3">Basic Data</Title>
              <div className="md:grid md:grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <Label showColon>File Name</Label>
                    <Text>{version?.FileName || '-'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>File Extension</Label>
                    <Text>{version?.FileExtension || '-'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Mime Type</Label>
                    <Text>{version?.MimeType || '-'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>File Size</Label>
                    <Text>{version?.FileSize ? formatFileSize(version.FileSize) : '-'}</Text>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <Label showColon>File ID</Label>
                    <Text>{version?.FileId || '-'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>File Title</Label>
                    <Text>{title?.value || '-'}</Text>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-3">
                <Title level="H3">Audit Information</Title>
                <div className="flex flex-col">
                  <Label showColon>Created By</Label>
                  <Text>{version?.Ernam || '-'}</Text>
                </div>
                <div className="flex flex-col">
                  <Label showColon>Created On</Label>
                  <Text>{version?.Erdat || '-'}</Text>
                </div>
                <div className="flex flex-col">
                  <Label showColon>Created At</Label>
                  <Text>{version?.Erzet || '-'}</Text>
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
              mimeType={version?.MimeType}
              fileContent={version?.FileContent}
              fileName={version?.FileName}
              fileExtension={version?.FileExtension}
            />
          </div>
        </ObjectPageSection>
      </ObjectPage>
      <BusyIndicator type="pending" show={isRollbacking} />
    </div>
  );
}

// TODO: Author check for Edit Lock
