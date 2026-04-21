import * as React from 'react';
import axios from 'axios';
import { toast } from '@/libs/helpers/toast';
import '@ui5/webcomponents-icons/refresh.js';
import '@ui5/webcomponents-icons/decline.js';
import { Text } from '@ui5/webcomponents-react/Text';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { useNavigate, useParams } from 'react-router';
import { Title } from '@ui5/webcomponents-react/Title';
import { Label } from '@ui5/webcomponents-react/Label';
import { MutationBar } from '@/components/mutation-bar';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { BusyIndicator } from '@/components/busy-indicator';
import '@ui5/webcomponents-icons/business-objects-mobile.js';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { ObjectPage } from '@ui5/webcomponents-react/ObjectPage';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { NotFoundIllustrated } from '@/components/not-found-illustrated';
import { ObjectPageTitle } from '@ui5/webcomponents-react/ObjectPageTitle';
import { getError, pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { ObjectPageSection } from '@ui5/webcomponents-react/ObjectPageSection';
import { type BoType, type BoStatus } from '@/features/business-objects/constants';
import { BizObjectLinkedAttachments } from '@/features/business-objects/components';
import { BizForm, type BizFormValues } from '@/features/business-objects/components';
import { bizObjectDetailQueryOptions } from '@/features/business-objects/options/query';
import { updateBizObjectMutationOptions } from '@/features/business-objects/options/mutation';
import { deleteBizObjectMutationOptions } from '@/features/business-objects/options/mutation';
import { displayBoStatus, displayBoType } from '@/features/business-objects/helpers/formatter';

export function BoDetailView() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [editValues, setEditValues] = React.useState<BizFormValues>({
    title: '',
    type: '',
    status: '',
  });

  const {
    data: bizObject,
    error: bizObjectError,
    refetch,
    isFetching: isBizObjectFetching,
  } = useQuery(bizObjectDetailQueryOptions(id!, {}));

  const refetchBizObject = function () {
    queryClient.invalidateQueries({
      queryKey: ['biz-objects', id],
    });
  };

  const { mutate: deleteBizObject, isPending: isDeleting } = useMutation(
    deleteBizObjectMutationOptions({
      boId: id!,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['biz-objects'],
        });
        toast('Business object deleted successfully');
        navigate('/business-objects');
      },
    }),
  );

  const { mutate: updateBizObject, isPending: isUpdating } = useMutation(
    updateBizObjectMutationOptions({
      boId: id!,
      onSuccess: () => {
        refetch();
        toast('Business object updated successfully');
        setEditMode(false);
      },
    }),
  );

  const handleEditModeOn = function () {
    setEditMode(true);
    setEditValues({
      title: bizObject?.BoTitle || '',
      type: bizObject?.BoType || '',
      status: bizObject?.Status || '',
    });
  };

  React.useEffect(() => {
    if (bizObjectError) {
      pushApiErrorMessages(bizObjectError);
    }
  }, [bizObjectError]);

  const isBizObjectNotFound = axios.isAxiosError(bizObjectError) && bizObjectError.response?.status === 404;

  if (bizObjectError && isBizObjectNotFound) {
    return (
      <NotFoundIllustrated
        title="Business Object Not Found"
        subtitle={getError(bizObjectError)[0]}
        breadcrumbRoute="/business-objects"
        breadcrumbText="Business Objects"
      />
    );
  }

  return (
    <div className="relative flex-1">
      <ObjectPage
        mode="Default"
        image={
          <div className="border rounded-lg aspect-square flex! items-center justify-center p-2">
            <Icon name="business-objects-mobile" className="w-full h-full text-primary" />
          </div>
        }
        hidePinButton={true}
        titleArea={
          <ObjectPageTitle
            header={
              <Title level="H2">{isBizObjectFetching ? 'Loading...' : bizObject?.BoTitle || 'Unnamed Object'}</Title>
            }
            subHeader={isBizObjectFetching ? 'Loading...' : bizObject?.BoId || '–'}
            actionsBar={
              !editMode ? (
                <Toolbar design="Transparent" style={{ height: 'auto' }}>
                  <ToolbarButton
                    design="Emphasized"
                    text="Edit"
                    onClick={() => handleEditModeOn()}
                    disabled={!bizObject?.__EntityControl.Updatable}
                  />
                  <ToolbarButton
                    design="Default"
                    text="Delete"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={!bizObject?.__EntityControl.Deletable || isDeleting}
                  />
                  <ToolbarButton design="Default" icon="refresh" text="Refresh" onClick={() => refetchBizObject()} />
                </Toolbar>
              ) : undefined
            }
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
        {isBizObjectFetching && <BusyIndicator type="loading" />}
        <ObjectPageSection
          aria-label="General Information"
          id="general"
          titleText="General Information"
          hideTitleText={true}
          style={{ display: isBizObjectFetching ? 'none' : 'block' }}
        >
          <div className="md:grid md:grid-cols-3 gap-3">
            <div className="space-y-3">
              <Title level="H3">Basic Data</Title>
              {editMode ? (
                <BizForm value={editValues} onChange={setEditValues} />
              ) : (
                <React.Fragment>
                  <div className="flex flex-col">
                    <Label showColon>Title</Label>
                    <Text>{bizObject?.BoTitle || '–'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Type</Label>
                    <Text>{displayBoType(bizObject?.BoType as BoType) || '–'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Status</Label>
                    <Text>{displayBoStatus(bizObject?.Status as BoStatus) || '–'}</Text>
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
                    <Text>{bizObject?.Ernam || '–'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Created On</Label>
                    <Text>{bizObject?.Erdat || '–'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Created At</Label>
                    <Text>{bizObject?.Erzet || '–'}</Text>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <Label showColon>Last Changed By</Label>
                    <Text>{bizObject?.Aenam || '–'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Last Changed On</Label>
                    <Text>{bizObject?.Aedat || '–'}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Label showColon>Last Changed At</Label>
                    <Text>{bizObject?.Aezet || '–'}</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ObjectPageSection>
        <ObjectPageSection
          aria-label="Attachments"
          id="attachments"
          titleText="Attachments"
          style={{ display: isBizObjectFetching ? 'none' : 'block' }}
        >
          <BizObjectLinkedAttachments boId={id!} disabled={!bizObject} />
        </ObjectPageSection>
        {editMode && (
          <MutationBar
            okText="Save"
            cancelText="Discard"
            onOk={() => {
              updateBizObject({
                BoTitle: editValues.title,
                BoType: editValues.type,
                Status: editValues.status,
              });
            }}
            onCancel={() => {
              setEditMode(false);
            }}
            disabledOk={
              !editValues.title.trim() ||
              !editValues.type.trim() ||
              !editValues.status.trim() ||
              (editValues.title === bizObject?.BoTitle &&
                editValues.type === bizObject?.BoType &&
                editValues.status === bizObject?.Status)
            }
          />
        )}
      </ObjectPage>
      <MessageBox
        open={deleteDialogOpen}
        type="Confirm"
        titleText="Delete Business Object"
        actions={['Cancel', 'OK']}
        onClose={(action) => {
          setDeleteDialogOpen(false);
          if (action === 'OK' && id) {
            deleteBizObject();
          }
        }}
      >
        Are you sure you want to delete this business object? This action cannot be undone.
      </MessageBox>
      <BusyIndicator type="pending" show={isDeleting || isUpdating} />
      {/* TODO: Handle time zone display */}
    </div>
  );
}

// TODO: Disable unlink when have linked attachments
