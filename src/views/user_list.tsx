import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { DynamicPageTitle } from '@ui5/webcomponents-react/DynamicPageTitle';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import type { AnalyticalTableColumnDefinition } from '@ui5/webcomponents-react/AnalyticalTable';
import { MessageStrip } from '@ui5/webcomponents-react/MessageStrip';
import { BusyIndicator } from '@ui5/webcomponents-react/BusyIndicator';
import { IllustratedMessage } from '@ui5/webcomponents-react/IllustratedMessage';
import { Input } from '@ui5/webcomponents-react/Input';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { useNavigate } from 'react-router';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData.js';
import '@ui5/webcomponents-icons/refresh.js';
import '@ui5/webcomponents-icons/group.js';
import '@ui5/webcomponents-icons/person-placeholder.js';
import '@ui5/webcomponents-icons/checklist.js';
import { getAuthUsersQueryOptions } from '@/features/auth-users/options/query';
import type { AuthUserItem } from '@/features/auth-users/types';

type UserTableItem = AuthUserItem & {
	RoleTone: string;
	PermissionTone: string;
	MessageCount: number;
};

const rawColumns: AnalyticalTableColumnDefinition[] = [
	{
		Header: 'User',
		accessor: 'Uname',
		width: 220,
	},
	{
		Header: 'Role',
		accessor: 'Role',
		width: 160,
	},
	{
		Header: 'Created On',
		accessor: 'Erdat',
		width: 150,
	},
	{
		Header: 'Created By',
		accessor: 'Ernam',
		width: 150,
	},
	{
		Header: 'Messages',
		accessor: 'MessageCount',
		width: 120,
	},
	{
		Header: 'Updatable',
		accessor: 'PermissionTone',
		width: 140,
	},
	{
		Header: 'Deletable',
		accessor: 'RoleTone',
		width: 140,
	},
];

function getRoleTone(role?: string) {
	const normalized = (role || '').toUpperCase();

	if (normalized === 'ADMIN') return 'bg-sky-500/15 text-sky-700 border-sky-500/25';
	if (normalized === 'POWERUSER' || normalized === 'SUPPORT') return 'bg-amber-500/15 text-amber-800 border-amber-500/25';
	if (normalized === 'USER') return 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25';

	return 'bg-slate-500/15 text-slate-700 border-slate-500/25';
}

function getPermissionTone(enabled: boolean) {
	return enabled
		? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25'
		: 'bg-rose-500/15 text-rose-700 border-rose-500/25';
}

function pillClassName(tone: string) {
	return `inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`;
}

export function UserListView() {
	const navigate = useNavigate();
	const [search, setSearch] = React.useState('');
	const [roleFilter, setRoleFilter] = React.useState('ALL');

	const { data, isFetching, isLoading, error, refetch } = useQuery(
		getAuthUsersQueryOptions({
			'sap-client': 324,
			$count: true,
			$top: 200,
			$skip: 0,
			$select: 'Uname,Role,Erdat,Ernam,__EntityControl/Deletable,__EntityControl/Updatable,SAP__Messages',
			$orderby: 'Uname asc',
		}),
	);

	const users = data?.value ?? [];

	const roleOptions = React.useMemo(() => {
		return ['ALL', ...Array.from(new Set(users.map((user) => user.Role).filter(Boolean)))].filter(Boolean);
	}, [users]);

	const filteredUsers = React.useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		return users.filter((user) => {
			const matchesSearch =
				!normalizedSearch ||
				[user.Uname, user.Role, user.Erdat, user.Ernam]
					.filter(Boolean)
					.some((value) => String(value).toLowerCase().includes(normalizedSearch));
			const matchesRole = roleFilter === 'ALL' || user.Role === roleFilter;

			return matchesSearch && matchesRole;
		});
	}, [roleFilter, search, users]);

	const tableRows = React.useMemo<UserTableItem[]>(() => {
		return filteredUsers.map((user) => ({
			...user,
			RoleTone: getRoleTone(user.Role),
			PermissionTone: getPermissionTone(Boolean(user.__EntityControl?.Updatable)),
			MessageCount: user.SAP__Messages?.length ?? 0,
		}));
	}, [filteredUsers]);

	const totalCount = data?.['@odata.count'] ? Number(data['@odata.count']) : users.length;
	const adminCount = users.filter((user) => (user.Role || '').toUpperCase() === 'ADMIN').length;
	const updatableCount = users.filter((user) => user.__EntityControl?.Updatable).length;
	const deletableCount = users.filter((user) => user.__EntityControl?.Deletable).length;

	const columns = React.useMemo(() => {
		return rawColumns.map((column) => {
			if (column.accessor === 'RoleTone') {
				return {
					...column,
					Cell: ({ row }: any) => {
						const value = row.original as UserTableItem;
						return <span className={pillClassName(value.RoleTone)}>{value.__EntityControl?.Deletable ? 'Yes' : 'No'}</span>;
					},
				};
			}

			if (column.accessor === 'PermissionTone') {
				return {
					...column,
					Cell: ({ row }: any) => {
						const value = row.original as UserTableItem;
						return (
							<span className={pillClassName(value.PermissionTone)}>{value.__EntityControl?.Updatable ? 'Yes' : 'No'}</span>
						);
					},
				};
			}

			if (column.accessor === 'MessageCount') {
				return {
					...column,
					Cell: ({ value }: any) => <span>{value}</span>,
				};
			}

			return column;
		});
	}, []);

	return (
		<DynamicPage
			titleArea={
				<DynamicPageTitle
					className="p-3"
					heading={
						<div className="flex items-center gap-3">
							<span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-700">
								<Icon name="group" />
							</span>
							<div>
								<div className="text-lg font-semibold text-slate-900">User List</div>
								<div className="text-sm text-slate-500">Browse Auth users from the SAP Auth service</div>
							</div>
						</div>
					}
					style={{ minHeight: '0px' }}
				/>
			}
			headerArea={
				<DynamicPageHeader>
					<div className="flex flex-col gap-4 p-4">
						<div className="rounded-3xl border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(239,246,255,0.9))] p-4 shadow-sm">
							<div className="grid gap-4 lg:grid-cols-4">
								<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
									<div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
										<Icon name="person-placeholder" />
										Total users
									</div>
									<div className="mt-2 text-3xl font-semibold text-slate-900">{totalCount}</div>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
									<div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
										<Icon name="checklist" />
										Admin users
									</div>
									<div className="mt-2 text-3xl font-semibold text-slate-900">{adminCount}</div>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
									<div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
										<Icon name="group" />
										Updatable
									</div>
									<div className="mt-2 text-3xl font-semibold text-slate-900">{updatableCount}</div>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
									<div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
										<Icon name="group" />
										Deletable
									</div>
									<div className="mt-2 text-3xl font-semibold text-slate-900">{deletableCount}</div>
								</div>
							</div>
						</div>

						<Toolbar className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm">
							<ToolbarSpacer />
							<ToolbarButton design="Emphasized" text="Create User" onClick={() => navigate('/Users/Create')} />
							<div className="min-w-64">
								<Input
									placeholder="Search user, role, creator"
									value={search}
									onInput={(event) => setSearch(event.target.value)}
								/>
							</div>
							<div className="min-w-40">
								<Select value={roleFilter} onChange={(event) => setRoleFilter(event.detail.selectedOption?.value || 'ALL')}>
									<Option value="ALL">All roles</Option>
									{roleOptions
										.filter((role) => role !== 'ALL')
										.map((role) => (
											<Option key={role} value={role}>
												{role}
											</Option>
										))}
								</Select>
							</div>
							<ToolbarButton design="Transparent" icon="refresh" text="Refresh" onClick={() => refetch()} />
						</Toolbar>
					</div>
				</DynamicPageHeader>
			}
			style={{
				height: '100dvh',
				overflow: 'hidden',
				position: 'relative',
				background: 'linear-gradient(180deg,rgba(242,247,251,0.98) 0%,rgba(231,240,248,0.98) 100%)',
			}}
		>
			<div className="mx-auto flex h-full w-full max-w-[96rem] flex-col gap-4 p-4">
				{error ? (
					<MessageStrip design="Negative" hideCloseButton>
						{(error as Error).message || 'Cannot load Auth users'}
					</MessageStrip>
				) : null}

				<div
					className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
					style={{ height: '680px' }}
				>
					<AnalyticalTable
						data={tableRows}
						columns={columns}
						sortable
						groupable
						loading={isFetching || isLoading}
						visibleRowCountMode="Fixed"
						style={{ height: '100%' }}
						scaleWidthMode="Smart"
						rowHeight={44}
						selectionMode="None"
						noDataText={search || roleFilter !== 'ALL' ? 'No users match the current filters.' : 'No users found.'}
					/>
				</div>

				{!isFetching && tableRows.length === 0 ? <IllustratedMessage name="NoData" /> : null}
			</div>

			{isLoading ? (
				<FlexBox alignItems="Center" justifyContent="Center" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
					<BusyIndicator delay={0} active size="L" />
				</FlexBox>
			) : null}
		</DynamicPage>
	);
}

