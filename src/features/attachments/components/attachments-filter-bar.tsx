import * as React from 'react';
import '@ui5/webcomponents-icons/value-help.js';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Input } from '@ui5/webcomponents-react/Input';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { FilterBar } from '@ui5/webcomponents-react/FilterBar';
import { FilterGroupItem } from '@ui5/webcomponents-react/FilterGroupItem';

export function AttachmentsFilterBar() {
  const [filterKeys, setFilterKeys] = React.useState<string[]>(['FileId', 'Title', 'IsActive', 'Ernam']);

  return (
    <FilterBar
      hideToolbar={true}
      showGoOnFB={true}
      showResetButton={true}
      onAfterFiltersDialogOpen={function fQ() {}}
      onClear={function fQ() {}}
      onFiltersDialogCancel={function fQ() {}}
      onFiltersDialogClose={function fQ() {}}
      onFiltersDialogOpen={function fQ() {}}
      onFiltersDialogSave={(e) => setFilterKeys(e.detail.selectedFilterKeys)}
      onFiltersDialogSearch={function fQ() {}}
      onFiltersDialogSelectionChange={function fQ() {}}
      onGo={function fQ(e) {
        console.log(e);
      }}
      onReorder={function fQ() {}}
      onRestore={() => setFilterKeys(['FileId', 'Title', 'IsActive', 'Ernam'])}
      onToggleFilters={function fQ() {}}
      search={<Input className="*:h-full h-6.5" />}
    >
      <FilterGroupItem filterKey="FileId" label="File ID" hiddenInFilterBar={!filterKeys.includes('FileId')}>
        <Input icon={<Icon className="h-full" name="value-help" />} className="h-6.5" />
      </FilterGroupItem>
      <FilterGroupItem filterKey="Title" label="File Title" hiddenInFilterBar={!filterKeys.includes('Title')}>
        <Input icon={<Icon className="h-full" name="value-help" />} className="h-6.5" />
      </FilterGroupItem>
      <FilterGroupItem filterKey="IsActive" label="Active" hiddenInFilterBar={!filterKeys.includes('IsActive')}>
        <Select className="h-6.5">
          <Option>Yes</Option>
          <Option>No</Option>
        </Select>
      </FilterGroupItem>
      <FilterGroupItem filterKey="Ernam" label="Created By" hiddenInFilterBar={!filterKeys.includes('Ernam')}>
        <Input icon={<Icon className="h-full" name="value-help" />} className="h-6.5" />
      </FilterGroupItem>
    </FilterBar>
  );
}
