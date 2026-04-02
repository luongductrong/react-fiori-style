import { useNavigate } from 'react-router';
import '@ui5/webcomponents-icons/chain-link.js';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Title } from '@ui5/webcomponents-react/Title';
import { Button } from '@ui5/webcomponents-react/Button';
import { Toolbar } from '@ui5/webcomponents-react/Toolbar';
import '@ui5/webcomponents-icons/navigation-right-arrow.js';
import { attachmentBOsQueryOptions } from '../options/biz-query';
import { ToolbarSpacer } from '@ui5/webcomponents-react/ToolbarSpacer';
import { AnalyticalTable } from '@ui5/webcomponents-react/AnalyticalTable';

const columns = [
  {
    Header: 'Object Type',
    accessor: '_Bo.BoType',
  },
  {
    Header: 'Object Title',
    accessor: '_Bo.BoTitle',
  },
  {
    Header: '',
    id: 'nav',
    width: 60,
    disableSortBy: true,
    disableGroupBy: true,
    Cell: () => <Icon name="navigation-right-arrow" />,
  },
];

export function AttachmentBizObjects({ fileId, isActive }: { fileId: string; isActive: boolean }) {
  const navigate = useNavigate();
  const { data, isFetching } = useQuery(
    attachmentBOsQueryOptions(fileId, {
      'sap-client': 324,
      $count: true,
      $expand: '_Bo',
    }),
  );

  const bizObjects = data?.value ?? [];
  const totalCount = data?.['@odata.count'] ?? 0;

  return (
    <AnalyticalTable
      header={
        <Toolbar className="py-2 px-4 rounded-t-xl">
          <Title level="H4">Objects {totalCount ? `(${totalCount})` : ''}</Title>
          <ToolbarSpacer />
          <Button
            design="Emphasized"
            icon="chain-link"
            onClick={() => alert('Link Object clicked')}
            disabled={!isActive}
            className="h-8"
          >
            Link Object
          </Button>
        </Toolbar>
      }
      data={bizObjects}
      columns={columns}
      loading={isFetching}
      rowHeight={36}
      selectionMode="None"
      visibleRows={10}
      sortable
      onRowClick={(e) => {
        const item = e.detail.row.original;
        if (!item?.FileId) return;
        navigate(`/business-objects/${item.BoId}`);
      }}
      groupable
      scaleWidthMode="Smart"
    />
  );
}
