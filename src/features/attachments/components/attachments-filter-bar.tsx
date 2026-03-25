import * as React from 'react';
import { Input } from '@ui5/webcomponents-react/Input';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { FilterBar } from '@ui5/webcomponents-react/FilterBar';
import { SearchHelpDialog } from '@/components/search-help-dialog';
import { FilterGroupItem } from '@ui5/webcomponents-react/FilterGroupItem';

export function AttachmentsFilterBar() {
  const [filterKeys, setFilterKeys] = React.useState<string[]>(['FileId', 'Title', 'IsActive', 'Ernam']);

  return (
    <>
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
        <SearchHelpDialog
          label="File ID"
          field="FileId"
          options={['equal to']}
          hidden={!filterKeys.includes('FileId')}
        />
        <SearchHelpDialog label="File Title" field="Title" hidden={!filterKeys.includes('Title')} />
        <FilterGroupItem filterKey="IsActive" label="Active" hiddenInFilterBar={!filterKeys.includes('IsActive')}>
          <Select className="h-6.5">
            <Option>Yes</Option>
            <Option>No</Option>
          </Select>
        </FilterGroupItem>
        <SearchHelpDialog label="Created By" field="Ernam" hidden={!filterKeys.includes('Ernam')} />
      </FilterBar>
    </>
  );
}

// $filter=(startswith(Title,'test')%20or%20startswith(Title,'demo'))%20and%20not%20contains(Title,'123')%20and%20startswith(Ernam,'DEV')%20and%20IsActive%20eq%20true
