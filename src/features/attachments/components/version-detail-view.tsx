import { useParams } from "react-router";
import { ObjectPage } from "@ui5/webcomponents-react/ObjectPage";
import { ObjectPageHeader } from "@ui5/webcomponents-react/ObjectPageHeader";
import { ObjectPageTitle } from "@ui5/webcomponents-react/ObjectPageTitle";
import { ObjectPageSection } from "@ui5/webcomponents-react/ObjectPageSection";
import { Toolbar } from "@ui5/webcomponents-react/Toolbar";
import { ToolbarButton } from "@ui5/webcomponents-react/ToolbarButton";
import { Breadcrumbs } from "@ui5/webcomponents-react/Breadcrumbs";
import { BreadcrumbsItem } from "@ui5/webcomponents-react/BreadcrumbsItem";
import { Title } from "@ui5/webcomponents-react/Title";
import { FlexBox } from "@ui5/webcomponents-react/FlexBox";
import { Label } from "@ui5/webcomponents-react/Label";
import { Text } from "@ui5/webcomponents-react/Text";
import { Button } from "@ui5/webcomponents-react/Button";
import "@ui5/webcomponents-icons/decline.js";
import "@ui5/webcomponents-icons/share.js";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { BusyIndicator } from "@ui5/webcomponents-react/BusyIndicator";
import { FilePreview } from "./file-preview";
import "@ui5/webcomponents-icons/arrow-bottom.js";
import {
  getAttachmentVersionDetailQueryOptions,
  getAttachmentTitleQueryOptions,
} from "../options/query";

export function VersionDetailView() {
  const { id, versionNo } = useParams();
  const navigate = useNavigate();
  const { data: version, isLoading } = useQuery(
    getAttachmentVersionDetailQueryOptions(id!, versionNo!, {
      "sap-client": 324,
      $select:
        "Ernam,FileContent,FileExtension,FileId,FileName,FileSize,MimeType,VersionNo,__EntityControl/Deletable,__EntityControl/Updatable",
    }),
  );
  const { data: title } = useQuery(
    getAttachmentTitleQueryOptions(id!, {
      "sap-client": 324,
    }),
  );

  return (
    <ObjectPage
      headerArea={
        <ObjectPageHeader>
          <FlexBox
            alignItems="Center"
            justifyContent="Start"
            wrap="Wrap"
            className="p-2"
          >
            <FlexBox direction="Column" className="w-1/3">
              <Label>Current Version</Label>
              <Text>{version?.VersionNo}</Text>
            </FlexBox>
            <FlexBox direction="Column" className="w-1/3">
              <Label>Created By</Label>
              <Text>{version?.Ernam}</Text>
            </FlexBox>
          </FlexBox>
          <FlexBox
            alignItems="Center"
            justifyContent="SpaceBetween"
            wrap="Wrap"
            className="p-2"
          >
            <FlexBox direction="Column" className="w-1/3">
              <Label>File Size</Label>
              <Text>{version?.FileSize}</Text>
            </FlexBox>
            <FlexBox direction="Column" className="w-1/3">
              <Label>File Extension</Label>
              <Text>{version?.FileExtension}</Text>
            </FlexBox>
            <FlexBox direction="Column" className="w-1/3">
              <Label>Mime Type</Label>
              <Text>{version?.MimeType}</Text>
            </FlexBox>
          </FlexBox>
        </ObjectPageHeader>
      }
      mode="Default"
      onBeforeNavigate={function fQ() {}}
      hidePinButton={true}
      onSelectedSectionChange={function fQ() {}}
      onToggleHeaderArea={function fQ() {}}
      titleArea={
        <ObjectPageTitle
          actionsBar={
            <Toolbar design="Transparent" style={{ height: "auto" }}>
              <ToolbarButton
                design="Transparent"
                text="Set as Current Version"
                // disabled={!attachment?.__EntityControl?.Updatable}
              />
              <ToolbarButton
                design="Default"
                icon="arrow-bottom"
                tooltip="Download"
                // disabled={!attachment?.__EntityControl?.Deletable}
              />
            </Toolbar>
          }
          breadcrumbs={
            <Breadcrumbs
              onItemClick={(e) => {
                const route = e.detail.item.dataset.route;
                if (route) {
                  navigate(route);
                }
              }}
            >
              <BreadcrumbsItem data-route="/Attachments">
                Attachments
              </BreadcrumbsItem>
              <BreadcrumbsItem data-route={`/Attachments/${id}`}>
                {isLoading ? "Loading..." : title?.value || "Unnamed Object"}
              </BreadcrumbsItem>
              <BreadcrumbsItem>
                {isLoading
                  ? "Loading..."
                  : version?.FileName || "Unnamed Object"}
              </BreadcrumbsItem>
            </Breadcrumbs>
          }
          header={
            <Title level="H2">
              {isLoading ? "Loading..." : version?.FileName || "Unnamed Object"}
            </Title>
          }
          navigationBar={
            <Button
              accessibleName="Close"
              design="Transparent"
              icon="decline"
              tooltip="Close"
              onClick={() => navigate(-1)}
            />
          }
        />
      }
    >
      {isLoading && (
        <FlexBox
          alignItems="Center"
          justifyContent="Center"
          style={{ padding: "1rem", minHeight: "50dvh" }}
        >
          <BusyIndicator delay={0} active size="L" />
        </FlexBox>
      )}
      <ObjectPageSection
        aria-label="File Preview"
        id="file-preview"
        titleText="File Preview"
        style={{ display: isLoading ? "none" : "block" }}
      >
        <div className="p-2 rounded-lg bg-background">
          <FilePreview
            mimeType={version?.MimeType}
            fileContent={version?.FileContent}
            fileName={version?.FileName}
          />
        </div>
      </ObjectPageSection>
    </ObjectPage>
  );
}
