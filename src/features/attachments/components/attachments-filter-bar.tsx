import { Input } from "@ui5/webcomponents-react/Input";
import { FilterBar } from "@ui5/webcomponents-react/FilterBar";
import { Title } from "@ui5/webcomponents-react/Title";
import { FilterGroupItem } from "@ui5/webcomponents-react/FilterGroupItem";
import { Select } from "@ui5/webcomponents-react/Select";
import { Option } from "@ui5/webcomponents-react/Option";

export function AttachmentsFilterBar() {
  return (
    <FilterBar
      filterContainerWidth="10rem"
      header={
        <Title level="H2" size="H1">
          FilterBar
        </Title>
      }
      hideToolbar={true}
      showGoOnFB={true}
      showResetButton={true}
      onAfterFiltersDialogOpen={function fQ() {}}
      onClear={function fQ() {}}
      onFiltersDialogCancel={function fQ() {}}
      onFiltersDialogClose={function fQ() {}}
      onFiltersDialogOpen={function fQ() {}}
      onFiltersDialogSave={function fQ() {}}
      onFiltersDialogSearch={function fQ() {}}
      onFiltersDialogSelectionChange={function fQ() {}}
      onGo={function fQ() {}}
      onReorder={function fQ() {}}
      onRestore={function fQ() {}}
      onToggleFilters={function fQ() {}}
      search={<Input />}
      className="w-full p-4"
    >
      <FilterGroupItem filterKey="IsActive" label="Is Active">
        <Select>
          <Option>Yes</Option>
          <Option>No</Option>
        </Select>
      </FilterGroupItem>
    </FilterBar>
  );
}
