import * as React from 'react';
import { useParams } from 'react-router';
import '@ui5/webcomponents-icons/share.js';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/decline.js';
import '@ui5/webcomponents-icons/arrow-bottom.js';
import { Text } from '@ui5/webcomponents-react/Text';
import { Title } from '@ui5/webcomponents-react/Title';
import { Label } from '@ui5/webcomponents-react/Label';
import { Toast } from '@ui5/webcomponents-react/Toast';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { downloadFile } from '@/features/attachments/helpers';
import { FilePreview } from '@/features/attachments/components';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { Breadcrumbs } from '@ui5/webcomponents-react/Breadcrumbs';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { BusyIndicator } from '@ui5/webcomponents-react/BusyIndicator';
import { BreadcrumbsItem } from '@ui5/webcomponents-react/BreadcrumbsItem';
import { ObjectPageTitle } from '@ui5/webcomponents-react/ObjectPageTitle';
import { ObjectPageHeader } from '@ui5/webcomponents-react/ObjectPageHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjectPageSection } from '@ui5/webcomponents-react/ObjectPageSection';
import { attachmentTitleQueryOptions } from '@/features/attachments/options/query';
import { rollbackVersionMutationOptions } from '@/features/attachments/options/mutation';
import { attachmentVersionDetailQueryOptions } from '@/features/attachments/options/query';

export function VersionDetailView() {
  const { id, versionNo } = useParams();
  const queryClient = useQueryClient();
  const [toastVisible, setToastVisible] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const navigate = useNavigate();
  const { data: version, isLoading } = useQuery(
    attachmentVersionDetailQueryOptions(id!, versionNo!, {
      'sap-client': 324,
      $select:
        'Ernam,FileContent,FileExtension,FileId,FileName,FileSize,MimeType,VersionNo,__EntityControl/Deletable,__EntityControl/Updatable',
    }),
  );
  const { data: title } = useQuery(
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
        setToastMessage('Version rolled back successfully');
        setToastVisible(true);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        setToastMessage(error?.response?.data?.error?.message || error.message);
        setToastVisible(true);
      },
    }),
  );

  return (
    <div className="relative">
      <ObjectPage
        headerArea={
          <ObjectPageHeader>
            <FlexBox alignItems="Center" justifyContent="Start" wrap="Wrap" className="p-2">
              <FlexBox direction="Column" className="w-1/3">
                <Label>Current Version</Label>
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
                <Text>{version?.FileSize}</Text>
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
        onBeforeNavigate={function fQ() {}}
        hidePinButton={true}
        onSelectedSectionChange={function fQ() {}}
        onToggleHeaderArea={function fQ() {}}
        titleArea={
          <ObjectPageTitle
            actionsBar={
              <Toolbar design="Transparent" style={{ height: 'auto' }}>
                <ToolbarButton
                  design="Transparent"
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
                  icon="arrow-bottom"
                  tooltip="Download"
                  onClick={() => {
                    if (!version) return;
                    const success = downloadFile(version.FileContent, version.FileName, version.MimeType);
                    if (!success) {
                      setToastVisible(true);
                      setToastMessage('Failed to download file');
                    }
                  }}
                  disabled={!version?.FileContent || !version?.MimeType}
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
                <BreadcrumbsItem data-route="/Attachments">Attachments</BreadcrumbsItem>
                <BreadcrumbsItem data-route={`/Attachments/${id}`}>
                  {isLoading ? 'Loading...' : title?.value || 'Unnamed Object'}
                </BreadcrumbsItem>
                <BreadcrumbsItem>{isLoading ? 'Loading...' : version?.FileName || 'Unnamed Object'}</BreadcrumbsItem>
              </Breadcrumbs>
            }
            header={<Title level="H2">{isLoading ? 'Loading...' : version?.FileName || 'Unnamed Object'}</Title>}
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
        {isLoading && (
          <FlexBox alignItems="Center" justifyContent="Center" style={{ padding: '1rem', minHeight: '50dvh' }}>
            <BusyIndicator delay={0} active size="L" />
          </FlexBox>
        )}
        <ObjectPageSection
          aria-label="File Preview"
          id="file-preview"
          titleText="File Preview"
          style={{ display: isLoading ? 'none' : 'block' }}
        >
          <div className="p-2 rounded-lg bg-background">
            <FilePreview mimeType={version?.MimeType} fileContent={version?.FileContent} fileName={version?.FileName} />
          </div>
        </ObjectPageSection>
      </ObjectPage>
      <Toast open={toastVisible} onClose={() => setToastVisible(false)} duration={2000} className="py-1 px-2">
        {toastMessage}
      </Toast>
      {isRollbacking && (
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
