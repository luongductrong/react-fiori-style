import * as React from 'react';
import { toast } from '@/libs/toast';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/share.js';
import '@ui5/webcomponents-icons/decline.js';
import '@ui5/webcomponents-icons/arrow-bottom.js';
import { Text } from '@ui5/webcomponents-react/Text';
import { Title } from '@ui5/webcomponents-react/Title';
import { Label } from '@ui5/webcomponents-react/Label';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { BusyIndicator } from '@/components/busy-indicator';
import { formatFileSize } from '@/features/attachments/helpers';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { UploadVersion } from '@/features/attachments/components';
import { Breadcrumbs } from '@ui5/webcomponents-react/Breadcrumbs';
import type { UploadedFileData } from '@/features/attachments/types';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { pushErrorMessages, pushApiErrorMessages } from '@/libs/errors';
import { BreadcrumbsItem } from '@ui5/webcomponents-react/BreadcrumbsItem';
import { ObjectPageTitle } from '@ui5/webcomponents-react/ObjectPageTitle';
import { ObjectPageHeader } from '@ui5/webcomponents-react/ObjectPageHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjectPageSection } from '@ui5/webcomponents-react/ObjectPageSection';
import { attachmentTitleQueryOptions } from '@/features/attachments/options/query';
import { uploadVersionMutationOptions } from '@/features/attachments/options/mutation';

export function UploadVersionView() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [fileData, setFileData] = React.useState<UploadedFileData | null>(null);
  const navigate = useNavigate();
  const {
    data: title,
    isLoading: isTitleLoading,
    error,
  } = useQuery(
    attachmentTitleQueryOptions(id!, {
      'sap-client': 324,
    }),
  );
  const { mutate: uploadVersion, isPending: isUploading } = useMutation(
    uploadVersionMutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['attachments', id],
        });
        toast('Version uploaded successfully');
        navigate(`/attachments/${data.FileId}`);
      },
    }),
  );

  const handleUpload = (fileData: UploadedFileData) => {
    setFileData(fileData);
    uploadVersion({
      FileId: id!,
      FileName: fileData.FileName,
      FileContent: fileData.FileContent,
      FileExtension: fileData.FileExtension,
      MimeType: fileData.MimeType,
      FileSize: fileData.FileSize,
    });
  };

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  // TODO: 404 error handle

  return (
    <div className="relative">
      <ObjectPage
        headerArea={
          <ObjectPageHeader>
            <FlexBox alignItems="Center" justifyContent="Start" wrap="Wrap" className="p-2">
              <FlexBox direction="Column" className="w-1/3">
                <Label>File Extension</Label>
                <Text>{fileData?.FileExtension || '-'}</Text>
              </FlexBox>
              <FlexBox direction="Column" className="w-1/3">
                <Label>File Size</Label>
                <Text>{fileData?.FileSize ? formatFileSize(fileData?.FileSize) : '-'}</Text>
              </FlexBox>
              <FlexBox direction="Column" className="w-1/3">
                <Label>Mime Type</Label>
                <Text>{fileData?.MimeType || '-'}</Text>
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
                  text="Save"
                  onClick={() => {
                    if (fileData) {
                      handleUpload(fileData);
                    } else {
                      pushErrorMessages(['Please select a file to upload']);
                    }
                  }}
                  disabled={isUploading || !fileData}
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
                  {isTitleLoading ? 'Loading...' : title?.value || 'Unnamed Object'}
                </BreadcrumbsItem>
                <BreadcrumbsItem>Upload new version</BreadcrumbsItem>
              </Breadcrumbs>
            }
            header={<Title level="H2">{fileData?.FileName || 'Unnamed Object'}</Title>}
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
        <BusyIndicator type="loading" show={isTitleLoading} />
        <ObjectPageSection
          aria-label="Upload new version"
          id="upload-new-version"
          titleText="Upload new version"
          style={{ display: isTitleLoading ? 'none' : 'block' }}
        >
          <UploadVersion
            onUpload={(fileData) => {
              setFileData(fileData);
            }}
            onCancel={() => {
              setFileData(null);
            }}
          />
        </ObjectPageSection>
      </ObjectPage>
      <BusyIndicator type="pending" show={isUploading} />
    </div>
  );
}
