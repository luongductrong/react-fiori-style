import * as React from 'react';
import { toast } from '@/libs/toast';
import '@ui5/webcomponents-icons/home.js';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/delete.js';
import '@ui5/webcomponents-icons/refresh.js';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import type { AuthUserItem } from '@/features/auth-users/types';
import { MessageBox } from '@ui5/webcomponents-react/MessageBox';
import { useCurrentAuthUser } from '@/features/auth-users/hooks';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { pushApiErrorMessages, pushErrorMessages } from '@/libs/errors';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import { authUsersQueryOptions } from '@/features/auth-users/options/query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { AuthUserCreate, AuthUsersFilterBar } from '@/features/auth-users/components';
import { deleteAuthUserMutationOptions } from '@/features/auth-users/options/mutation';
import type { AnalyticalTableCellInstance } from '@ui5/webcomponents-react/AnalyticalTable';

const rawColumns = [
  { Header: 'User Name', accessor: 'Uname' },
  { Header: 'Role', accessor: 'Role' },
  { Header: 'Created On', accessor: 'Erdat' },
  { Header: 'Created By', accessor: 'Ernam' },
];

export function UserListView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: currentAuthUser } = useCurrentAuthUser();
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AuthUserItem | null>(null);
  const username = currentAuthUser?.username ?? null;

  const { data, isFetching, error, refetch } = useQuery(
    authUsersQueryOptions({
      'sap-client': 324,
      $count: true,
      $filter: filter || undefined,
      $search: search || undefined,
      $orderby: 'Uname asc',
    }),
  );

  const users = React.useMemo(() => data?.value ?? [], [data]);
  const totalCount = Number(data?.['@odata.count'] ?? users.length);

  const { mutate: deleteUser, isPending: isDeletingUser } = useMutation(
    deleteAuthUserMutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['auth-users'] });
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
      ...rawColumns,
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
    [isDeletingUser, username],
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
                Users
              </Title>
            </FlexBox>
          </Button>
          <AuthUsersFilterBar onFilterChange={setFilter} onSearchChange={setSearch} />
        </DynamicPageHeader>
      }
      className="h-dvh"
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
        data={users}
        columns={columns}
        sortable
        groupable
        loading={isFetching || isDeletingUser}
        noDataText={filter ? 'No users match the current filters.' : 'No users found.'}
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
