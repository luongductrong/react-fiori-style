import * as React from 'react';
import { toast } from '@/libs/toast';
import { useParams } from 'react-router';
import '@ui5/webcomponents-icons/share.js';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/decline.js';
import '@ui5/webcomponents-icons/refresh.js';
import { Text } from '@ui5/webcomponents-react/Text';
import { Title } from '@ui5/webcomponents-react/Title';
import { Label } from '@ui5/webcomponents-react/Label';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { BusyIndicator } from '@/components/busy-indicator';
import { FilePreview } from '@/features/attachments/components';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { Breadcrumbs } from '@ui5/webcomponents-react/Breadcrumbs';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { pushErrorMessages, pushApiErrorMessages } from '@/libs/errors';
import { BreadcrumbsItem } from '@ui5/webcomponents-react/BreadcrumbsItem';
import { ObjectPageTitle } from '@ui5/webcomponents-react/ObjectPageTitle';
import { ObjectPageHeader } from '@ui5/webcomponents-react/ObjectPageHeader';
import { downloadFile, formatFileSize } from '@/features/attachments/helpers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjectPageSection } from '@ui5/webcomponents-react/ObjectPageSection';
import { attachmentTitleQueryOptions } from '@/features/attachments/options/query';
import { rollbackVersionMutationOptions } from '@/features/attachments/options/mutation';
import { attachmentVersionDetailQueryOptions } from '@/features/attachments/options/query';

export function VersionDetailView() {
  const { id, versionNo } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: version,
    isFetching,
    refetch: refetchData,
    error: dataError,
  } = useQuery(
    attachmentVersionDetailQueryOptions(id!, versionNo!, {
      'sap-client': 324,
      $select:
        'Ernam,FileContent,FileExtension,FileId,FileName,FileSize,MimeType,VersionNo,__EntityControl/Deletable,__EntityControl/Updatable',
    }),
  );
  const {
    data: title,
    refetch: refetchTitle,
    error: titleError,
  } = useQuery(
    attachmentTitleQueryOptions(id!, {
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

  React.useEffect(() => {
    if (dataError) {
      pushApiErrorMessages(dataError);
    }
    if (titleError) {
      pushApiErrorMessages(titleError);
    }
  }, [dataError, titleError]);

  // TODO: 404 error handle

  return (
    <div className="relative">
      <ObjectPage
        hidePinButton={true}
        headerArea={
          <ObjectPageHeader>
            <FlexBox alignItems="Center" justifyContent="Start" wrap="Wrap" className="p-2">
              <FlexBox direction="Column" className="w-1/3">
                <Label>Version</Label>
                <Text>{version?.VersionNo}</Text>
              </FlexBox>
              <FlexBox direction="Column" className="w-1/3">
                <Label>Created By</Label>
                <Text>{version?.Ernam}</Text>
              </FlexBox>
            </FlexBox>
            <FlexBox alignItems="Center" justifyContent="SpaceBetween" wrap="Wrap" className="p-2">
              <FlexBox direction="Column" className="w-1/3">
                <Label>File Size</Label>
                <Text>{version?.FileSize ? formatFileSize(version?.FileSize) : ''}</Text>
              </FlexBox>
              <FlexBox direction="Column" className="w-1/3">
                <Label>File Extension</Label>
                <Text>{version?.FileExtension}</Text>
              </FlexBox>
              <FlexBox direction="Column" className="w-1/3">
                <Label>Mime Type</Label>
                <Text>{version?.MimeType}</Text>
              </FlexBox>
            </FlexBox>
          </ObjectPageHeader>
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
                {/* Disable if version is current version */}
                <ToolbarButton
                  design="Default"
                  text="Set as Current Version"
                  onClick={() => {
                    if (!version) return;
                    rollbackVersion({
                      CurrentVersion: version.VersionNo,
                    });
                  }}
                  disabled={isRollbacking}
                />
                <ToolbarButton
                  design="Default"
                  icon="refresh"
                  text="Refresh"
                  onClick={() => {
                    refetchData();
                    refetchTitle();
                  }}
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
        <BusyIndicator type="loading" show={isFetching} />
        <ObjectPageSection
          aria-label="File Preview"
          id="file-preview"
          titleText="File Preview"
          style={{ display: isFetching ? 'none' : 'block' }}
        >
          <div className="p-2 rounded-lg bg-background">
            <FilePreview mimeType={version?.MimeType} fileContent={version?.FileContent} fileName={version?.FileName} />
          </div>
        </ObjectPageSection>
      </ObjectPage>
      <BusyIndicator type="pending" show={isRollbacking} />
    </div>
  );
}
