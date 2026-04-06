import * as React from 'react';
import { Input } from '@ui5/webcomponents-react/Input';
import { FilterBar } from '@ui5/webcomponents-react/FilterBar';
import { FilterGroupItem } from '@ui5/webcomponents-react/FilterGroupItem';
import { SearchHelpDialog } from '@/components/search-help-dialog';

interface BizObjectFilterBarProps {
  onFilterChange: (_filter: string) => void;
  onSearchChange: (_search: string) => void;
}

export function BizObjectFilterBar({ onFilterChange, onSearchChange }: BizObjectFilterBarProps) {
  const [count, setCount] = React.useState(0);
  const [filterKeys, setFilterKeys] = React.useState<string[]>(['BoId', 'BoType', 'BoTitle', 'Status', 'Ernam']);
  const [boIdFilterString, setBoIdFilterString] = React.useState('');
  const [boTypeFilterString, setBoTypeFilterString] = React.useState('');
  const [boTitleFilterString, setBoTitleFilterString] = React.useState('');
  const [statusFilterString, setStatusFilterString] = React.useState('');
  const [createdByFilterString, setCreatedByFilterString] = React.useState('');

  const handleOnGo = function () {
    const filter = [boIdFilterString, boTypeFilterString, boTitleFilterString, statusFilterString, createdByFilterString]
      .filter(Boolean)
      .join(' and ');
    onFilterChange(filter);
  };

  const onClear = function () {
    setCount((prev) => prev + 1);
    setFilterKeys(['BoId', 'BoType', 'BoTitle', 'Status', 'Ernam']);
    setBoIdFilterString('');
    setBoTypeFilterString('');
    setBoTitleFilterString('');
    setStatusFilterString('');
    setCreatedByFilterString('');
    onSearchChange('');
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
      onFiltersDialogSearch={function fQ() {}}
      onFiltersDialogSelectionChange={function fQ() {}}
      onGo={handleOnGo}
      onReorder={function fQ() {}}
      onRestore={onClear}
      onToggleFilters={function fQ() {}}
      search={<Input className="h-6.5" placeholder="Search business objects" onChange={(e) => onSearchChange(e.target.value)} />}
    >
      <FilterGroupItem filterKey="BoId" label="BO ID" hiddenInFilterBar={!filterKeys.includes('BoId')}>
        <SearchHelpDialog key={count} label="BO ID" field="BoId" options={['equal to']} afterFilterStringBuild={setBoIdFilterString} />
      </FilterGroupItem>
      <FilterGroupItem filterKey="BoType" label="Type" hiddenInFilterBar={!filterKeys.includes('BoType')}>
        <SearchHelpDialog key={count} label="Type" field="BoType" afterFilterStringBuild={setBoTypeFilterString} />
      </FilterGroupItem>
      <FilterGroupItem filterKey="BoTitle" label="Title" hiddenInFilterBar={!filterKeys.includes('BoTitle')}>
        <SearchHelpDialog key={count} label="Title" field="BoTitle" afterFilterStringBuild={setBoTitleFilterString} />
      </FilterGroupItem>
       <FilterGroupItem filterKey="Status" label="Status" hiddenInFilterBar={!filterKeys.includes('Status')}>
        <SearchHelpDialog key={count} label="Status" field="Status" afterFilterStringBuild={setStatusFilterString} />
      </FilterGroupItem>
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
