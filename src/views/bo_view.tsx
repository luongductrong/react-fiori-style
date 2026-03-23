import * as React from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DynamicPage } from '@ui5/webcomponents-react/DynamicPage';
import { DynamicPageHeader } from '@ui5/webcomponents-react/DynamicPageHeader';
import { DynamicPageTitle } from '@ui5/webcomponents-react/DynamicPageTitle';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { Title } from '@ui5/webcomponents-react/Title';
import { Label } from '@ui5/webcomponents-react/Label';
import { List } from '@ui5/webcomponents-react/List';
import { ListItemStandard } from '@ui5/webcomponents-react/ListItemStandard';
import { Input } from '@ui5/webcomponents-react/Input';
import { MessageStrip } from '@ui5/webcomponents-react/MessageStrip';
import { BusyIndicator } from '@ui5/webcomponents-react/BusyIndicator';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { IllustratedMessage } from '@ui5/webcomponents-react/IllustratedMessage';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toast } from '@ui5/webcomponents-react/Toast';
import type { AnalyticalTableColumnDefinition } from '@ui5/webcomponents-react/AnalyticalTable';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData.js';
import '@ui5/webcomponents-icons/refresh.js';
import '@ui5/webcomponents-icons/list.js';
import '@ui5/webcomponents-icons/document.js';
import { getBizObjectsQueryOptions } from '@/features/biz-object/options/query';
import {
	deleteBizObjectMutationOptions,
	updateBizObjectMutationOptions,
} from '@/features/biz-object/options/mutation';
import type { BizObjectItem } from '@/features/biz-object/types';

const rawColumns: AnalyticalTableColumnDefinition[] = [
	{
		Header: 'BO ID',
		accessor: 'BoId',
		width: 260,
	},
	{
		Header: 'Type',
		accessor: 'BoType',
		width: 140,
	},
	{
		Header: 'Title',
		accessor: 'BoTitle',
	},
	{
		Header: 'Status',
		accessor: 'Status',
		width: 120,
	},
	{
		Header: 'Created On',
		accessor: 'Erdat',
		width: 140,
	},
	{
		Header: 'Created By',
		accessor: 'Ernam',
		width: 140,
	},
	
];

type BizObjectTableItem = BizObjectItem & {
	LinkAttachmentText: string;
};

type BizObjectFormState = {
	BoType: string;
	BoTitle: string;
	Status: string;
};

const DEFAULT_FORM: BizObjectFormState = {
	BoType: '',
	BoTitle: '',
	Status: '',
};

function formatDateTime(date?: string | null, time?: string | null) {
	if (!date && !time) return '-';
	if (!date) return time || '-';
	if (!time) return date;
	return `${date} ${time}`;
}

function getStatusTone(status?: string) {
	const normalized = (status || '').toUpperCase();

	if (normalized === 'NEW') return 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25';
	if (normalized === 'APPROVED' || normalized === 'ACTIVE') {
		return 'bg-sky-500/15 text-sky-700 border-sky-500/25';
	}
	if (normalized === 'REJECTED' || normalized === 'ERROR') {
		return 'bg-rose-500/15 text-rose-700 border-rose-500/25';
	}

	return 'bg-slate-500/15 text-slate-700 border-slate-500/25';
}
export function BoView() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [search, setSearch] = React.useState('');
	const [selectedBoId, setSelectedBoId] = React.useState<string | null>(null);
	const [detailOpen, setDetailOpen] = React.useState(false);
	const [editForm, setEditForm] = React.useState<BizObjectFormState>(DEFAULT_FORM);
	const [toastVisible, setToastVisible] = React.useState(false);
	const [toastMessage, setToastMessage] = React.useState('');

	const { data, isFetching, isLoading, error } = useQuery(
		getBizObjectsQueryOptions({
			'sap-client': 324,
			$select:
				'BoId,BoType,BoTitle,Status,Erdat,Erzet,Ernam,Aedat,Aezet,Aenam,__EntityControl/Deletable,__EntityControl/Updatable,__OperationControl/link_attachment',
			$top: 100,
		}),
	);

	const bizObjects = data?.value ?? [];

	const filteredBizObjects = React.useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();

		if (!normalizedSearch) return bizObjects;

		return bizObjects.filter((item) => {
			return [item.BoId, item.BoType, item.BoTitle, item.Status, item.Ernam, item.Aenam]
				.filter(Boolean)
				.some((value) => value.toLowerCase().includes(normalizedSearch));
		});
	}, [bizObjects, search]);

	const tableRows = React.useMemo<BizObjectTableItem[]>(() => {
		return filteredBizObjects.map((item) => ({
			...item,
			LinkAttachmentText: item.__OperationControl?.link_attachment ? 'Yes' : 'No',
		}));
	}, [filteredBizObjects]);

	React.useEffect(() => {
		if (filteredBizObjects.length === 0) {
			setSelectedBoId(null);
			setDetailOpen(false);
			return;
		}

		const stillVisible = selectedBoId
			? filteredBizObjects.some((item) => item.BoId === selectedBoId)
			: false;

		if (!stillVisible) {
			setSelectedBoId(filteredBizObjects[0].BoId);
		}
	}, [filteredBizObjects, selectedBoId]);

	const selectedBo = React.useMemo(() => {
		return filteredBizObjects.find((item) => item.BoId === selectedBoId) ?? filteredBizObjects[0] ?? null;
	}, [filteredBizObjects, selectedBoId]);

	const canUpdate = Boolean(
		selectedBo && editForm.BoType.trim() && editForm.BoTitle.trim() && editForm.Status.trim(),
	);

	React.useEffect(() => {
		if (!detailOpen || !selectedBo) {
			return;
		}

		setEditForm({
			BoType: selectedBo.BoType || '',
			BoTitle: selectedBo.BoTitle || '',
			Status: selectedBo.Status || '',
		});
	}, [detailOpen, selectedBo]);

	const { mutate: updateBizObject, isPending: isUpdating } = useMutation(
		updateBizObjectMutationOptions({
			boId: selectedBo?.BoId ?? '',
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['biz-objects'] });
				setToastMessage('Business Object updated successfully');
				setToastVisible(true);
				setDetailOpen(false);
			},
			onError: (error) => {
				setToastMessage(error.message || 'Cannot update Business Object');
				setToastVisible(true);
			},
		}),
	);

	const { mutate: deleteBizObject, isPending: isDeleting } = useMutation(
		deleteBizObjectMutationOptions({
			boId: selectedBo?.BoId ?? '',
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['biz-objects'] });
				setToastMessage('Business Object deleted successfully');
				setToastVisible(true);
				setDetailOpen(false);
				setSelectedBoId(null);
			},
			onError: (error) => {
				setToastMessage(error.message || 'Cannot delete Business Object');
				setToastVisible(true);
			},
		}),
	);

	const columns = React.useMemo(
		() => rawColumns,
		[],
	);

	return (
		<DynamicPage
			headerArea={
				<DynamicPageHeader>
					<div className="flex flex-col gap-4 p-4">
						<Toolbar className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm">
							<Title level="H2">Business Object</Title>
							<ToolbarSpacer />
							<ToolbarButton
								design="Transparent"
								icon="refresh"
								text="Refresh"
								onClick={() => {
									queryClient.invalidateQueries({ queryKey: ['biz-objects'] });
								}}
							/>
							<ToolbarButton
								design="Transparent"
								icon="list"
								text="Attachments"
								onClick={() => navigate('/Attachments')}
							/>
							<ToolbarButton
								design="Emphasized"
								text="Create Business Object"
								onClick={() => navigate('/BO/Create')}
							/>
						</Toolbar>

					
					</div>
				</DynamicPageHeader>
			}
			titleArea={
				<DynamicPageTitle
					className="p-3"
					heading={
						<div className="flex items-center gap-3">
							<span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-700">
								<Icon name="document" />
							</span>
							<div>
								<div className="text-lg font-semibold text-slate-900">Business Object View</div>
								<div className="text-sm text-slate-500">List and inspect BizObject records from the BIZ service</div>
							</div>
						</div>
					}
					snappedHeading={
						<div className="flex items-center gap-2 text-slate-900">
							<Icon name="document" />
							<span>Business Object View</span>
						</div>
					}
					style={{ minHeight: '0px' }}
				/>
			}
			style={{
				height: '100dvh',
				overflow: 'hidden',
				position: 'relative',
				zIndex: 0,
				background:
					'linear-gradient(180deg,rgba(243,248,252,0.95) 0%,rgba(239,245,250,0.95) 55%,rgba(231,240,248,0.95) 100%)',
			}}
		>
			<div className="w-full p-4">
				<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_16px_40px_rgba(84,104,130,0.08)]">
					<Toolbar className="border-b border-slate-200/80 px-4 py-3">
						
						<ToolbarSpacer />
						<Input
							aria-label="Search BO"
							placeholder="Search by title, type, status, id"
							value={search}
							onInput={(event) => setSearch(event.target.value)}
							style={{ minWidth: '18rem' }}
						/>
					</Toolbar>

					{error ? (
						<MessageStrip design="Critical" hideCloseButton className="m-4">
							{error instanceof Error ? error.message : 'Cannot load BizObject data.'}
						</MessageStrip>
					) : null}

					<AnalyticalTable
						data={tableRows}
						columns={columns}
						loading={isFetching || isLoading}
						rowHeight={44}
						selectionMode="None"
						visibleRows={10}
						sortable
						groupable
						scaleWidthMode="Smart"
						onRowClick={(event) => {
							const item = event.detail.row.original as BizObjectTableItem;
							if (item?.BoId) {
								setSelectedBoId(item.BoId);
								setDetailOpen(true);
							}
						}}
					/>

					{!isFetching && tableRows.length === 0 ? (
						<div className="border-t border-slate-200/80 p-6">
							<IllustratedMessage name="NoData" />
						</div>
					) : null}
				</div>
			</div>

		<Dialog
			open={detailOpen}
			onClose={() => setDetailOpen(false)}
			headerText={selectedBo?.BoTitle || 'Business Object detail'}
			style={{ width: 'min(92vw, 72rem)' }}
		>
			{isLoading ? (
				<FlexBox alignItems="Center" justifyContent="Center" style={{ minHeight: '22rem' }}>
					<BusyIndicator delay={0} active size="L" />
				</FlexBox>
			) : selectedBo ? (
				<div className="space-y-4 p-2">
					<div className="flex flex-wrap items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
						<span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-700">
							<Icon name="document" />
						</span>
						<div className="min-w-0 flex-1">
							<div className="text-lg font-semibold text-slate-900">{selectedBo.BoTitle}</div>
							<div className="mt-1 text-sm text-slate-600">BO ID {selectedBo.BoId} · Type {selectedBo.BoType}</div>
						</div>
						<div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(selectedBo.Status)}`}>
							{selectedBo.Status}
						</div>
					</div>

					<div className="grid gap-3 md:grid-cols-2">
						<div className="rounded-2xl bg-slate-50 p-4">
							<div className="text-xs uppercase tracking-[0.18em] text-slate-500">Overview</div>
							<div className="mt-2 text-sm text-slate-600">Created {formatDateTime(selectedBo.Erdat, selectedBo.Erzet)}</div>
							<div className="mt-1 text-sm text-slate-600">Created By {selectedBo.Ernam || '-'}</div>
							<div className="mt-1 text-sm text-slate-600">Changed {formatDateTime(selectedBo.Aedat, selectedBo.Aezet)}</div>
							<div className="mt-1 text-sm text-slate-600">Changed By {selectedBo.Aenam || '-'}</div>
						</div>

						<div className="rounded-2xl bg-slate-50 p-4">
							<div className="text-xs uppercase tracking-[0.18em] text-slate-500">Capabilities</div>
							<div className="mt-2 text-sm text-slate-600">Can link attachment {selectedBo.__OperationControl?.link_attachment ? 'Yes' : 'No'}</div>
							<div className="mt-1 text-sm text-slate-600">Editable {selectedBo.__EntityControl?.Updatable ? 'Yes' : 'No'}</div>
							<div className="mt-1 text-sm text-slate-600">Deletable {selectedBo.__EntityControl?.Deletable ? 'Yes' : 'No'}</div>
							<div className="mt-1 text-sm text-slate-600">Messages {selectedBo.SAP__Messages?.length ?? 0}</div>
						</div>
					</div>

					<div className="rounded-2xl border border-slate-200 bg-white p-4">
						<div className="text-xs uppercase tracking-[0.18em] text-slate-500">Edit BO</div>
						<div className="mt-3 grid gap-4 md:grid-cols-3">
							<div className="flex flex-col gap-1.5">
								<Label>BoType</Label>
								<Input
									value={editForm.BoType}
									placeholder="Enter BO type"
									onInput={(event) => setEditForm((prev) => ({ ...prev, BoType: event.target.value }))}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label>BoTitle</Label>
								<Input
									value={editForm.BoTitle}
									placeholder="Enter BO title"
									onInput={(event) => setEditForm((prev) => ({ ...prev, BoTitle: event.target.value }))}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label>Status</Label>
								<Input
									value={editForm.Status}
									placeholder="Enter BO status"
									onInput={(event) => setEditForm((prev) => ({ ...prev, Status: event.target.value }))}
								/>
							</div>
						</div>
						<div className="mt-3 text-xs text-slate-500">
							Changes here will be sent in the PUT request when you press Update.
						</div>
					</div>

					<List>
						<ListItemStandard text="BO ID" description={selectedBo.BoId} />
						<ListItemStandard text="BoType" description={selectedBo.BoType} />
						<ListItemStandard text="BoTitle" description={selectedBo.BoTitle} />
						<ListItemStandard text="Status" description={selectedBo.Status} />
						<ListItemStandard text="Created" description={formatDateTime(selectedBo.Erdat, selectedBo.Erzet)} />
						<ListItemStandard text="Created By" description={selectedBo.Ernam || '-'} />
						<ListItemStandard text="Changed" description={formatDateTime(selectedBo.Aedat, selectedBo.Aezet)} />
						<ListItemStandard text="Changed By" description={selectedBo.Aenam || '-'} />
						<ListItemStandard text="Can link attachment" description={selectedBo.__OperationControl?.link_attachment ? 'Yes' : 'No'} />
						<ListItemStandard text="Editable" description={selectedBo.__EntityControl?.Updatable ? 'Yes' : 'No'} />
						<ListItemStandard text="Deletable" description={selectedBo.__EntityControl?.Deletable ? 'Yes' : 'No'} />
					</List>
				</div>
			) : (
				<div className="p-6 text-sm text-slate-500">No business object is selected.</div>
			)}
			<div slot="footer" className="flex items-center justify-end gap-2 px-2 pb-2 pt-4">
				<Button
					design="Emphasized"
					disabled={!canUpdate || !selectedBo.__EntityControl?.Updatable || isUpdating || isDeleting}
					onClick={() => {
						if (!selectedBo) return;
						updateBizObject({
							BoType: editForm.BoType.trim(),
							BoTitle: editForm.BoTitle.trim(),
							Status: editForm.Status.trim(),
						});
					}}
				>
					Update
				</Button>
				<Button
					design="Negative"
					disabled={!selectedBo || !selectedBo.__EntityControl?.Deletable || isUpdating || isDeleting}
					onClick={() => {
						if (!selectedBo) return;
						deleteBizObject();
					}}
				>
					Delete
				</Button>
				<Button onClick={() => setDetailOpen(false)}>Close</Button>
			</div>
		</Dialog>

		<Toast open={toastVisible} duration={2500} onClose={() => setToastVisible(false)}>
			{toastMessage}
		</Toast>
		</DynamicPage>
	);
}
