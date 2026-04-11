import * as React from 'react';
import { Input } from '@ui5/webcomponents-react/Input';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { FilterBar } from '@ui5/webcomponents-react/FilterBar';
import { SearchHelpDialog } from '@/components/search-help-dialog';
import { FilterGroupItem } from '@ui5/webcomponents-react/FilterGroupItem';

interface AttachmentsFilterBarProps {
  showSearch?: boolean;
  showActiveFilter?: boolean;
  onFilterChange: (_filter: string) => void;
  onSearchChange?: (_search: string) => void;
}

export function AttachmentsFilterBar(props: AttachmentsFilterBarProps) {
  const { showSearch = true, showActiveFilter = true, onFilterChange, onSearchChange } = props;
  const [count, setCount] = React.useState<number>(0);
  const [filterKeys, setFilterKeys] = React.useState<string[]>(['FileId', 'Title', 'IsActive', 'Ernam']);
  const [idFilterString, setIdFilterString] = React.useState<string>('');
  const [titleFilterString, setTitleFilterString] = React.useState<string>('');
  const [createdByFilterString, setCreatedByFilterString] = React.useState<string>('');
  const [isActive, setIsActive] = React.useState<string>('');

  const handleOnGo = function () {
    const isActiveFilter = isActive ? `IsActive eq ${isActive}` : '';
    const filter = [idFilterString, titleFilterString, createdByFilterString, isActiveFilter]
      .filter(Boolean)
      .join(' and ');
    onFilterChange(filter);
  };

  const onClear = function () {
    setIsActive('');
    setCount((prev) => prev + 1);
    setFilterKeys(['FileId', 'Title', 'IsActive', 'Ernam']);
    setIdFilterString('');
    setTitleFilterString('');
    setCreatedByFilterString('');
    onSearchChange?.('');
    onFilterChange('');
  };

  return (
    <FilterBar
      hideToolbar={true}
      showGoOnFB={true}
      showResetButton={true}
      onAfterFiltersDialogOpen={function fQ() {}}
      onClear={onClear}
      onFiltersDialogCancel={function fQ() {}}
      onFiltersDialogClose={function fQ() {}}
      onFiltersDialogOpen={function fQ() {}}
      onFiltersDialogSave={(e) => setFilterKeys(e.detail.selectedFilterKeys)}
      onFiltersDialogSearch={(e) => alert(e.target.value)}
      onFiltersDialogSelectionChange={function fQ() {}}
      onGo={handleOnGo}
      onReorder={function fQ() {}}
      onRestore={onClear}
      onToggleFilters={function fQ() {}}
      search={
        showSearch ? <Input className="*:h-full h-6.5" onChange={(e) => onSearchChange?.(e.target.value)} /> : undefined
      }
    >
      <FilterGroupItem filterKey="FileId" label="File ID" hiddenInFilterBar={!filterKeys.includes('FileId')}>
        <SearchHelpDialog
          key={count}
          label="File ID"
          field="FileId"
          options={['equal to']}
          useApostrophe={false}
          afterFilterStringBuild={setIdFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem filterKey="Title" label="File Title" hiddenInFilterBar={!filterKeys.includes('Title')}>
        <SearchHelpDialog key={count} label="File Title" field="Title" afterFilterStringBuild={setTitleFilterString} />
      </FilterGroupItem>
      {showActiveFilter && (
        <FilterGroupItem filterKey="IsActive" label="Active" hiddenInFilterBar={!filterKeys.includes('IsActive')}>
          <Select value={isActive} onChange={(e) => setIsActive(e.target.value)} className="h-6.5">
            <Option value="">All</Option>
            <Option value="true">Yes</Option>
            <Option value="false">No</Option>
          </Select>
        </FilterGroupItem>
      )}
      <FilterGroupItem filterKey="Ernam" label="Created By" hiddenInFilterBar={!filterKeys.includes('Ernam')}>
        <SearchHelpDialog
          key={count}
          label="Created By"
          field="Ernam"
          afterFilterStringBuild={setCreatedByFilterString}
        />
      </FilterGroupItem>
    </FilterBar>
  );
}
