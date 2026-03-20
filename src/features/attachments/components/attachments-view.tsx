import * as React from "react";
import { AttachmentsFilterBar } from "./attachments-filter-bar";
import { DynamicPage } from "@ui5/webcomponents-react/DynamicPage";
import { DynamicPageHeader } from "@ui5/webcomponents-react/DynamicPageHeader";
import { DynamicPageTitle } from "@ui5/webcomponents-react/DynamicPageTitle";
import { VariantManagement } from "@ui5/webcomponents-react/VariantManagement";
import { VariantItem } from "@ui5/webcomponents-react/VariantItem";
import { AnalyticalTable } from "@ui5/webcomponents-react/AnalyticalTable";
import { useQuery } from "@tanstack/react-query";
import { getAttachmentsQueryOptions } from "../hooks/query";

const columns = [
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
  const [filter, _setFilter] = React.useState<string | undefined>(undefined);
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
        data={attachments}
        columns={columns}
        withNavigationHighlight
        sortable
        groupable
        selectionMode="Multiple"
        loading={isFetching}
      />
    </DynamicPage>
  );
}
