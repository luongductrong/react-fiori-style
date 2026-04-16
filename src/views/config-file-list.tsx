import * as React from 'react';
import { toast } from '@/libs/toast';
import '@ui5/webcomponents-icons/home.js';
import '@ui5/webcomponents-icons/refresh.js';
import { formatFileSize } from '@/libs/utils';
import { useAuthStore } from '@/stores/auth-store';
import { pushApiErrorMessages } from '@/libs/errors';
import { useNavigate, Navigate } from 'react-router';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import type { ConfigFileItem } from '@/features/config-files/types';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { configFilesQueryOptions } from '@/features/config-files/options/query';
import { enableConfigFileMutationOptions } from '@/features/config-files/options/mutation';
import type { AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';
import { disableConfigFileMutationOptions } from '@/features/config-files/options/mutation';
import { ConfigFileCreate, ConfigFileEdit, ConfigFilesFilterBar } from '@/features/config-files/components';

const rawColumns = [
  { Header: 'File Ext', accessor: 'FileExt' },
  { Header: 'Mime Type', accessor: 'MimeType' },
  {
    Header: 'Type',
    accessor: 'Type',
    Cell: (props: AnalyticalTableCellInstance) =>
      props.value === 'IMAGE' ? 'Image' : props.value === 'DOCUMENT' ? 'Document' : `"${props.value}"`,
  },
  { Header: 'Description', accessor: 'Description' },
  {
    Header: 'Max Size',
    accessor: 'MaxBytes',
    Cell: (props: AnalyticalTableCellInstance) => formatFileSize(props.value),
  },
  {
    Header: 'Is Active',
    accessor: 'IsActive',
    Cell: (props: AnalyticalTableCellInstance) => (props.value === 'X' || props.value === true ? 'Yes' : 'No'),
  },
];

export function ConfigFileListView() {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [configFileToEdit, setConfigFileToEdit] = React.useState<ConfigFileItem | null>(null);
  // TODO: BE enable search for config files, users
  const [filter, setFilter] = React.useState('');
  const configFileListParams = React.useMemo(
    () => ({
      'sap-client': 324,
      $count: true,
      $filter: filter || undefined,
      $search: search || undefined,
      $orderby: 'FileExt asc',
    }),
    [filter, search],
  );

  const { data, isFetching, error, refetch } = useQuery(configFilesQueryOptions(configFileListParams));

  const configFiles = React.useMemo(() => data?.value ?? [], [data]);
  const totalCount = Number(data?.['@odata.count'] ?? configFiles.length);

  const { mutate: enableConfigFile, isPending: isEnablingConfigFile } = useMutation(
    enableConfigFileMutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['config-files'] });
        setFilter('');
        setSearch('');
        toast('Configuration file enabled successfully');
      },
    }),
  );

  const { mutate: disableConfigFile, isPending: isDisablingConfigFile } = useMutation(
    disableConfigFileMutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['config-files'] });
        setFilter('');
        setSearch('');
        toast('Configuration file disabled successfully');
      },
    }),
  );

  const columns = React.useMemo(
    () => [
      ...rawColumns,
      {
        Header: 'Actions',
        Cell: (props: AnalyticalTableCellInstance) => (
          <FlexBox alignItems="Center" className="gap-2">
            <Button
              design="Transparent"
              className="h-6.5"
              disabled={
                isEnablingConfigFile ||
                isDisablingConfigFile ||
                !props.row.original.__EntityControl?.Updatable ||
                (props.row.original.IsActive !== 'X' && props.row.original.IsActive !== true)
              }
              onClick={() => {
                setConfigFileToEdit(props.row.original);
              }}
            >
              Edit
            </Button>
            {props.row.original.IsActive === 'X' || props.row.original.IsActive === true ? (
              <Button
                design="Transparent"
                className="h-6.5"
                disabled={
                  !props.row.original.__OperationControl?.disable || isEnablingConfigFile || isDisablingConfigFile
                }
                onClick={() => {
                  disableConfigFile({ FileExt: props.row.original.FileExt });
                }}
              >
                Disable
              </Button>
            ) : (
              <Button
                design="Transparent"
                className="h-6.5"
                disabled={
                  !props.row.original.__OperationControl?.enable || isEnablingConfigFile || isDisablingConfigFile
                }
                onClick={() => {
                  enableConfigFile({ FileExt: props.row.original.FileExt });
                }}
              >
                Enable
              </Button>
            )}
          </FlexBox>
        ),
      },
    ],
    [disableConfigFile, enableConfigFile, isDisablingConfigFile, isEnablingConfigFile],
  );

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  if (!isAdmin) {
    return <Navigate to="/shell-home" />;
  }

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader className="py-4 px-8">
          <Button
            design="Transparent"
            tooltip="Click to go to home page"
            onClick={() => {
              navigate('/shell-home');
            }}
            className="cursor-pointer"
          >
            <FlexBox alignItems="Center" className="text-primary gap-2">
              <Icon name="home" className="text-primary" mode="Interactive" />
              <Title level="H1" className="text-primary cursor-pointer">
                Configuration Files
              </Title>
            </FlexBox>
          </Button>
          <ConfigFilesFilterBar onFilterChange={setFilter} onSearchChange={setSearch} />
        </DynamicPageHeader>
      }
      className="h-dvh"
      showFooter={true}
    >
      <ConfigFileEdit
        open={!!configFileToEdit}
        configFile={configFileToEdit}
        onClose={() => {
          setConfigFileToEdit(null);
        }}
      />
      <AnalyticalTable
        header={
          <Toolbar className="py-2 px-4 rounded-t-xl">
            <Title level="H2">Configuration Files {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            <ConfigFileCreate />
            <ToolbarButton
              design="Transparent"
              icon="refresh"
              text="Refresh"
              onClick={() => {
                refetch();
              }}
            />
          </Toolbar>
        }
        data={configFiles}
        columns={columns}
        sortable
        groupable
        loading={isFetching || isEnablingConfigFile || isDisablingConfigFile}
        noDataText={
          filter || search ? 'No configuration files match the current filters.' : 'No configuration files found.'
        }
        rowHeight={36}
        scaleWidthMode="Smart"
        visibleRowCountMode="Auto"
      />
    </DynamicPage>
  );
}
