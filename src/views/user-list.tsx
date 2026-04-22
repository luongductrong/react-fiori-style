import * as React from 'react';
import '@ui5/webcomponents-icons/delete.js';
import '@ui5/webcomponents-icons/refresh.js';
import { toast } from '@/libs/helpers/toast';
import { useViewStore } from '@/stores/view-store';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { ViewSettings } from '@/components/view-settings';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { displayListDate } from '@/libs/helpers/date-time';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { AuthUserItem } from '@/features/auth-users/types';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { useCurrentAuthUser } from '@/features/auth-users/hooks';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { useInvalidateAuthUserQuery } from '@/features/auth-users/hooks';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import { authUsersQueryOptions } from '@/features/auth-users/options/query';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { AuthUserCreate, AuthUsersFilterBar } from '@/features/auth-users/components';
import { deleteAuthUserMutationOptions } from '@/features/auth-users/options/mutation';
import { pushApiErrorMessages, pushErrorMessages } from '@/libs/helpers/error-messages';
import type { AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';
import { ToolbarButton, type ToolbarButtonPropTypes } from '@ui5/webcomponents-react/ToolbarButton';
import { AUTH_USER_LIST_FIELDS, type AuthUserListFieldId } from '@/features/auth-users/view-config';

type AuthUserListColumn = {
  id: AuthUserListFieldId;
} & Record<string, unknown>;

const ALL_COLUMNS = [
  { Header: 'User Name', accessor: 'Uname', id: 'Uname' },
  { Header: 'Role', accessor: 'Role', id: 'Role' },
  {
    Header: 'Created On',
    accessor: 'Erdat',
    id: 'Erdat',
    Cell: (props: AnalyticalTableCellInstance) => displayListDate(props.row.original.Erdat, '00:00:00'),
  },
  { Header: 'Created By', accessor: 'Ernam', id: 'Ernam' },
] as const satisfies readonly AuthUserListColumn[];

export function UserListView() {
  const invalidateUser = useInvalidateAuthUserQuery();
  const { data: currentAuthUser } = useCurrentAuthUser();
  const selectedFieldIds = useViewStore((state) => state.authUserListVisibleFieldIds);
  const setSelectedFieldIds = useViewStore((state) => state.setAuthUserListVisibleFieldIds);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AuthUserItem | null>(null);
  const username = currentAuthUser?.username ?? null;
  const authUserListSelect = React.useMemo(
    () => Array.from(new Set([...selectedFieldIds, 'Uname', '__EntityControl/Deletable'])).join(','),
    [selectedFieldIds],
  );
  const visibleColumns = React.useMemo(
    () => ALL_COLUMNS.filter((col) => selectedFieldIds.includes(col.id)),
    [selectedFieldIds],
  );

  const { data, isFetching, error } = useQuery({
    ...authUsersQueryOptions({
      $count: true,
      $select: authUserListSelect,
      $filter: filter || undefined,
      $search: search || undefined,
      $orderby: 'Uname asc',
    }),
    enabled: selectedFieldIds.length > 0,
  });

  const users = React.useMemo(() => data?.value ?? [], [data]);
  const totalCount = Number(data?.['@odata.count'] ?? users.length);

  const { mutate: deleteUser, isPending: isDeletingUser } = useMutation(
    deleteAuthUserMutationOptions({
      onSuccess: () => {
        invalidateUser.invalidateAuthUserList();
        setFilter('');
        setSearch('');
        toast('User deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      },
      onError: () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      },
    }),
  );

  const columns = React.useMemo(
    () => [
      ...visibleColumns,
      {
        Header: 'Actions',
        Cell: (props: AnalyticalTableCellInstance) => (
          <Button
            design="Transparent"
            icon="delete"
            className="h-6.5"
            disabled={
              !props.row.original.__EntityControl?.Deletable || isDeletingUser || props.row.original.Uname === username
            }
            onClick={() => {
              setSelectedUser(props.row.original);
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </Button>
        ),
      },
    ],
    [isDeletingUser, username, visibleColumns],
  );

  const handleRefetch: ToolbarButtonPropTypes['onClick'] = React.useCallback(
    () => invalidateUser.invalidateAuthUserList(),
    [invalidateUser],
  );

  React.useEffect(() => {
    if (error) {
      pushApiErrorMessages(error);
    }
  }, [error]);

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader className="py-4 px-8">
          <AuthUsersFilterBar onFilterChange={setFilter} onSearchChange={setSearch} />
        </DynamicPageHeader>
      }
      className="flex-1"
      showFooter={true}
    >
      <AnalyticalTable
        header={
          <Toolbar className="py-2 px-4 rounded-t-xl">
            <Title level="H2">Users {totalCount ? `(${totalCount})` : ''}</Title>
            <ToolbarSpacer />
            <AuthUserCreate
              onCreated={() => {
                setFilter('');
                setSearch('');
              }}
            />
            <ToolbarButton design="Transparent" icon="refresh" text="Refresh" onClick={handleRefetch} />
            <ViewSettings
              fields={AUTH_USER_LIST_FIELDS}
              selectedIds={selectedFieldIds}
              setSelectedIds={setSelectedFieldIds}
            />
          </Toolbar>
        }
        data={selectedFieldIds.length > 0 ? users : []}
        columns={selectedFieldIds.length > 0 ? columns : []}
        sortable
        groupable={false}
        loading={isFetching || isDeletingUser}
        noDataText={
          selectedFieldIds.length === 0
            ? 'There are no visible columns in the table right now. Please select the columns you need in the table settings.'
            : filter || search
              ? 'No users match the current filters.'
              : 'No users found.'
        }
        rowHeight={36}
        scaleWidthMode="Smart"
        visibleRowCountMode="Auto"
      />
      <MessageBox
        open={deleteDialogOpen && !!selectedUser?.Uname}
        titleText="Delete User"
        type="Confirm"
        actions={['Cancel', 'OK']}
        onClose={(action) => {
          setDeleteDialogOpen(false);
          if (action === 'OK' && selectedUser?.Uname) {
            if (selectedUser.Uname === username) {
              pushErrorMessages(['You cannot delete yourself']);
              return;
            }
            deleteUser({ Uname: selectedUser.Uname });
            return;
          }
          setSelectedUser(null);
        }}
      >
        Are you sure you want to delete user "{selectedUser?.Uname || '-'}"?
      </MessageBox>
    </DynamicPage>
  );
}
