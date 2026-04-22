import * as React from 'react';
import { toast } from '@/libs/helpers/toast';
import '@ui5/webcomponents-icons/refresh.js';
import { formatFileSize } from '@/libs/utils';
import { useViewStore } from '@/stores/view-store';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { ViewSettings } from '@/components/view-settings';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import type { ConfigFileItem } from '@/features/config-files/types';
import { pushApiErrorMessages } from '@/libs/helpers/error-messages';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import { useInvalidateConfigFileQuery } from '@/features/config-files/hooks';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { configFilesQueryOptions } from '@/features/config-files/options/query';
import { ConfigFileCreate, ConfigFileEdit } from '@/features/config-files/components';
import { ConfigFileView, ConfigFilesFilterBar } from '@/features/config-files/components';
import { enableConfigFileMutationOptions } from '@/features/config-files/options/mutation';
import type { AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';
import { disableConfigFileMutationOptions } from '@/features/config-files/options/mutation';
import { ToolbarButton, type ToolbarButtonPropTypes } from '@ui5/webcomponents-react/ToolbarButton';
import { CONFIG_FILE_LIST_FIELDS, type ConfigFileListFieldId } from '@/features/config-files/view-config';

type ConfigFileListColumn = {
  id: ConfigFileListFieldId;
} & Record<string, unknown>;

const ALL_COLUMNS = [
  { Header: 'Extension', accessor: 'FileExt', id: 'FileExt' },
  {
    Header: 'Type',
    accessor: 'Type',
    id: 'Type',
    Cell: (props: AnalyticalTableCellInstance) =>
      props.value === 'IMAGE' ? 'Image' : props.value === 'DOCUMENT' ? 'Document' : `"${props.value}"`,
  },
  { Header: 'Description', accessor: 'Description', id: 'Description' },
  {
    Header: 'Max Size',
    accessor: 'MaxBytes',
    id: 'MaxBytes',
    Cell: (props: AnalyticalTableCellInstance) => formatFileSize(props.value, ''),
  },
  {
    Header: 'Is Active',
    accessor: 'IsActive',
    id: 'IsActive',
    Cell: (props: AnalyticalTableCellInstance) => (props.value ? 'Yes' : 'No'),
  },
] as const satisfies readonly ConfigFileListColumn[];

export function ConfigFileListView() {
  const invalidateConfig = useInvalidateConfigFileQuery();
  const selectedFieldIds = useViewStore((state) => state.configFileListVisibleFieldIds);
  const setSelectedFieldIds = useViewStore((state) => state.setConfigFileListVisibleFieldIds);
  const [search, setSearch] = React.useState('');
  const [configFileToEdit, setConfigFileToEdit] = React.useState<ConfigFileItem | null>(null);
  const [configFileToView, setConfigFileToView] = React.useState<ConfigFileItem | null>(null);
  const [filter, setFilter] = React.useState('');
  const visibleColumns = React.useMemo(
    () => ALL_COLUMNS.filter((col) => selectedFieldIds.includes(col.id)),
    [selectedFieldIds],
  );
  const configFileListParams = React.useMemo(
    () => ({
      $count: true,
      $filter: filter || undefined,
      $search: search || undefined,
      $orderby: 'FileExt asc',
    }),
    [filter, search],
  );

  const { data, isFetching, error } = useQuery(configFilesQueryOptions(configFileListParams));

  const configFiles = React.useMemo(() => data?.value ?? [], [data]);
  const totalCount = Number(data?.['@odata.count'] ?? configFiles.length);

  const { mutate: enableConfigFile, isPending: isEnablingConfigFile } = useMutation(
    enableConfigFileMutationOptions({
      onSuccess: () => {
        invalidateConfig.invalidateConfigFileList();
        setFilter('');
        setSearch('');
        toast('Configuration file enabled successfully');
      },
    }),
  );

  const { mutate: disableConfigFile, isPending: isDisablingConfigFile } = useMutation(
    disableConfigFileMutationOptions({
      onSuccess: () => {
        invalidateConfig.invalidateConfigFileList();
        setFilter('');
        setSearch('');
        toast('Configuration file disabled successfully');
      },
    }),
  );

  const columns = React.useMemo(
    () => [
      ...visibleColumns,
      {
        Header: 'Actions',
        width: 212,
        Cell: (props: AnalyticalTableCellInstance) => (
          <FlexBox alignItems="Center" className="gap-2">
            <Button
              design="Transparent"
              className="h-6.5"
              onClick={() => {
                setConfigFileToView(props.row.original);
              }}
            >
              View
            </Button>
            <Button
              design="Transparent"
              className="h-6.5"
              disabled={
                isEnablingConfigFile ||
                isDisablingConfigFile ||
                !props.row.original.__EntityControl?.Updatable ||
                !props.row.original.IsActive
              }
              onClick={() => {
                setConfigFileToEdit(props.row.original);
              }}
            >
              Edit
            </Button>
            {props.row.original.IsActive ? (
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
    [disableConfigFile, enableConfigFile, isDisablingConfigFile, isEnablingConfigFile, visibleColumns],
  );

  const handleRefetch: ToolbarButtonPropTypes['onClick'] = React.useCallback(() => {
    invalidateConfig.invalidateConfigFileList();
  }, [invalidateConfig]);

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader className="py-4 px-8">
          <ConfigFilesFilterBar onFilterChange={setFilter} onSearchChange={setSearch} />
        </DynamicPageHeader>
      }
      className="flex-1"
      showFooter={true}
    >
      <ConfigFileEdit
        open={!!configFileToEdit}
        configFile={configFileToEdit}
        onClose={() => {
          setConfigFileToEdit(null);
        }}
      />
      <ConfigFileView
        open={!!configFileToView}
        configFile={configFileToView}
        onClose={() => {
          setConfigFileToView(null);
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
              onClick={handleRefetch}
              disabled={isFetching || isEnablingConfigFile || isDisablingConfigFile}
            />
            <ViewSettings
              fields={CONFIG_FILE_LIST_FIELDS}
              selectedIds={selectedFieldIds}
              setSelectedIds={setSelectedFieldIds}
            />
          </Toolbar>
        }
        data={selectedFieldIds.length > 0 ? configFiles : []}
        columns={selectedFieldIds.length > 0 ? columns : []}
        sortable
        groupable={false}
        loading={isFetching || isEnablingConfigFile || isDisablingConfigFile}
        noDataText={
          selectedFieldIds.length === 0
            ? 'There are no visible columns in the table right now. Please select the columns you need in the table settings.'
            : filter || search
              ? 'No configuration files match the current filters.'
              : 'No configuration files found.'
        }
        rowHeight={36}
        scaleWidthMode="Smart"
        visibleRowCountMode="Auto"
      />
    </DynamicPage>
  );
}
