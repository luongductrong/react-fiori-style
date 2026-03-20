import * as React from "react";
import { AttachmentsFilterBar } from "./attachments-filter-bar";
import { DynamicPage } from "@ui5/webcomponents-react/DynamicPage";
import { DynamicPageHeader } from "@ui5/webcomponents-react/DynamicPageHeader";
import { DynamicPageTitle } from "@ui5/webcomponents-react/DynamicPageTitle";
import { VariantManagement } from "@ui5/webcomponents-react/VariantManagement";
import { VariantItem } from "@ui5/webcomponents-react/VariantItem";
import { AnalyticalTable } from "@ui5/webcomponents-react/AnalyticalTable";
import { useQuery } from "@tanstack/react-query";
import { getAttachmentsQueryOptions } from "../options/query";
import { useNavigate } from "react-router";
import { Icon } from "@ui5/webcomponents-react/Icon";
import "@ui5/webcomponents-icons/navigation-right-arrow.js";

const rawColumns = [
  {
    Header: "Title",
    accessor: "Title",
  },
  {
    Header: "Version",
    accessor: "CurrentVersion",
  },
  {
    Header: "Created On",
    accessor: "Erdat",
  },
  {
    Header: "Created By",
    accessor: "Ernam",
  },
];

export function AttachmentsView() {
  const navigate = useNavigate();
  const [filter, _setFilter] = React.useState<string | undefined>(undefined);
  const [selectedIds, setSelectedIds] = React.useState<Record<string, boolean>>(
    {},
  );
  const { data, isFetching } = useQuery(
    getAttachmentsQueryOptions({
      "sap-client": 324,
      $skip: 0,
      $top: 20,
      $count: true,
      $select:
        "CurrentVersion,Erdat,Ernam,FileId,IsActive,Title,__EntityControl/Deletable,__EntityControl/Updatable",
      $filter: filter,
    }),
  );

  const attachments = data?.value || [];

  const columns = React.useMemo(() => {
    return [
      ...rawColumns,
      {
        Header: "",
        id: "nav",
        width: 60,
        disableSortBy: true,
        disableGroupBy: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cell: ({ row }: any) => (
          <button
            onClick={() => {
              const item = row.original;
              if (!item?.FileId) return;
              navigate(`/Attachments/${item.FileId}`);
            }}
          >
            <Icon name="navigation-right-arrow" />
          </button>
        ),
      },
    ];
  }, [navigate]);

  return (
    <DynamicPage
      headerArea={
        <DynamicPageHeader>
          <AttachmentsFilterBar />
        </DynamicPageHeader>
      }
      style={{
        height: "800px",
        position: "relative",
        zIndex: 0,
      }}
      titleArea={
        <DynamicPageTitle
          heading={
            <VariantManagement onClick={function fQ() {}}>
              <VariantItem>Variant 1</VariantItem>
              <VariantItem selected>Variant 2</VariantItem>
            </VariantManagement>
          }
          snappedHeading={
            <VariantManagement onClick={function fQ() {}}>
              <VariantItem>Variant 1</VariantItem>
              <VariantItem selected>Variant 2</VariantItem>
            </VariantManagement>
          }
          style={{ minHeight: "0px" }}
        />
      }
    >
      <AnalyticalTable
        header={
          <div className="bg-background w-full py-2 px-4 rounded-t-xl font-bold">
            Attachments
            <span className="ml-1">({data?.["@odata.count"]})</span>
          </div>
        }
        data={attachments}
        columns={columns}
        sortable
        groupable
        selectionMode="Multiple"
        loading={isFetching}
        rowHeight={36}
        visibleRowCountMode="Auto"
        withNavigationHighlight={true}
        withRowHighlight={true}
        selectionBehavior="RowSelector"
        scaleWidthMode="Smart"
        selectedRowIds={selectedIds}
        onRowSelect={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setSelectedIds(e.detail.selectedRowIds ?? {});
        }}
      />
    </DynamicPage>
  );
}
