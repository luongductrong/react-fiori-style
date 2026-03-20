import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Title } from "@ui5/webcomponents-react/Title";
import { Toolbar } from "@ui5/webcomponents-react/Toolbar";
import { ToolbarSpacer } from "@ui5/webcomponents-react/ToolbarSpacer";
import { getAttachmentVersionsQueryOptions } from "../options/query";
import { AnalyticalTable } from "@ui5/webcomponents-react/AnalyticalTable";
import { useNavigate } from "react-router";
import { Icon } from "@ui5/webcomponents-react/Icon";
import "@ui5/webcomponents-icons/navigation-right-arrow.js";

const versionColumns = [
  {
    Header: "Version",
    accessor: "VersionNo",
  },
  {
    Header: "File Name",
    accessor: "FileName",
  },
  {
    Header: "Created On",
    accessor: "Erdat",
  },
  {
    Header: "Created By",
    accessor: "Ernam",
  },
  {
    Header: "",
    id: "nav",
    width: 60,
    disableSortBy: true,
    disableGroupBy: true,
    Cell: () => <Icon name="navigation-right-arrow" />,
  },
];

export function AttachmentVersion({ fileId }: { fileId: string }) {
  const navigate = useNavigate();
  const { data: versionsData, isFetching: isVersionsFetching } = useQuery(
    getAttachmentVersionsQueryOptions(fileId, {
      "sap-client": 324,
      $count: true,
      $select:
        "Erdat,Ernam,FileId,FileName,VersionNo,__EntityControl/Deletable,__EntityControl/Updatable",
      $skip: 0,
      $top: 10,
    }),
  );

  const versions = versionsData?.value ?? [];

  return (
    <AnalyticalTable
      header={
        <Toolbar className="py-2 px-4 rounded-t-xl">
          <Title level="H4">
            Versions{" "}
            {versionsData?.["@odata.count"]
              ? `(${versionsData["@odata.count"]})`
              : ""}
          </Title>
          <ToolbarSpacer />
        </Toolbar>
      }
      data={versions}
      columns={versionColumns}
      loading={isVersionsFetching}
      rowHeight={36}
      selectionMode="None"
      visibleRows={10}
      sortable
      onRowClick={(e) => {
        const item = e.detail.row.original;
        if (!item?.FileId) return;
        navigate(`/Attachments/${item.FileId}/Versions/${item.VersionNo}`);
      }}
      groupable
      scaleWidthMode="Smart"
    />
  );
}
