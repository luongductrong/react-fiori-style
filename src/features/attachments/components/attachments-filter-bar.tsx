import * as React from 'react';
import { Input } from '@ui5/webcomponents-react/Input';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { FilterBar } from '@ui5/webcomponents-react/FilterBar';
import { SearchHelpDialog } from '@/components/search-help-dialog';
import { DateRangeSearchHelp } from '@/components/date-range-search-help';
import { FilterGroupItem } from '@ui5/webcomponents-react/FilterGroupItem';

interface AttachmentsFilterBarProps {
  onFilterChange: (filter: string) => void;
  onSearchChange?: (search: string) => void;
}

const DEFAULT_FILTER_KEYS = ['FileId', 'Title', 'CurrentVersion', 'Erdat', 'Ernam'];

export function AttachmentsFilterBar({ onFilterChange, onSearchChange }: AttachmentsFilterBarProps) {
  const [count, setCount] = React.useState<number>(0);
  const [filterKeys, setFilterKeys] = React.useState<string[]>(DEFAULT_FILTER_KEYS);
  const [editLock, setEditLock] = React.useState<string>('');
  const [idFilterString, setIdFilterString] = React.useState<string>('');
  const [titleFilterString, setTitleFilterString] = React.useState<string>('');
  const [currentVersionFilterString, setCurrentVersionFilterString] = React.useState<string>('');
  const [createdOnFilterString, setCreatedOnFilterString] = React.useState<string>('');
  const [createdByFilterString, setCreatedByFilterString] = React.useState<string>('');
  const [changedOnFilterString, setChangedOnFilterString] = React.useState<string>('');
  const [changedByFilterString, setChangedByFilterString] = React.useState<string>('');

  const handleOnGo = function () {
    const editLockFilter =
      editLock === 'enabled' ? 'EditLock eq true' : editLock === 'disabled' ? 'EditLock eq false' : '';
    const filter = [
      idFilterString,
      titleFilterString,
      currentVersionFilterString,
      createdOnFilterString,
      createdByFilterString,
      changedOnFilterString,
      changedByFilterString,
      editLockFilter,
    ]
      .filter(Boolean)
      .join(' and ');
    onFilterChange(filter);
  };

  const onClear = function () {
    setCount((prev) => prev + 1);
    setFilterKeys(DEFAULT_FILTER_KEYS);
    setEditLock('');
    setIdFilterString('');
    setTitleFilterString('');
    setCurrentVersionFilterString('');
    setCreatedOnFilterString('');
    setCreatedByFilterString('');
    setChangedOnFilterString('');
    setChangedByFilterString('');
    onSearchChange?.('');
    onFilterChange('');
  };

  return (
    <FilterBar
      hideToolbar={true}
      showGoOnFB={true}
      showResetButton={true}
      onClear={onClear}
      onFiltersDialogSave={(e) => setFilterKeys(e.detail.selectedFilterKeys)}
      onGo={handleOnGo}
      onRestore={onClear}
      search={<Input className="*:h-full h-6.5" onChange={(e) => onSearchChange?.(e.target.value)} />}
    >
      <FilterGroupItem
        filterKey="FileId"
        label="File ID"
        hiddenInFilterBar={!filterKeys.includes('FileId')}
        active={!!idFilterString}
      >
        <SearchHelpDialog
          key={count}
          label="File ID"
          field="FileId"
          options={['equal to']}
          useApostrophe={false}
          afterFilterStringBuild={setIdFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="Title"
        label="File Title"
        hiddenInFilterBar={!filterKeys.includes('Title')}
        active={!!titleFilterString}
      >
        <SearchHelpDialog key={count} label="File Title" field="Title" afterFilterStringBuild={setTitleFilterString} />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="CurrentVersion"
        label="Version"
        hiddenInFilterBar={!filterKeys.includes('CurrentVersion')}
        active={!!currentVersionFilterString}
      >
        <SearchHelpDialog
          key={count}
          label="Version"
          field="CurrentVersion"
          options={['equal to']}
          afterFilterStringBuild={setCurrentVersionFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="Erdat"
        label="Created On"
        hiddenInFilterBar={!filterKeys.includes('Erdat')}
        active={!!createdOnFilterString}
      >
        <DateRangeSearchHelp field="Erdat" afterFilterStringBuild={setCreatedOnFilterString} />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="Ernam"
        label="Created By"
        hiddenInFilterBar={!filterKeys.includes('Ernam')}
        active={!!createdByFilterString}
      >
        <SearchHelpDialog
          key={count}
          label="Created By"
          field="Ernam"
          afterFilterStringBuild={setCreatedByFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="Aedat"
        label="Changed On"
        hiddenInFilterBar={!filterKeys.includes('Aedat')}
        active={!!changedOnFilterString}
      >
        <DateRangeSearchHelp field="Aedat" afterFilterStringBuild={setChangedOnFilterString} />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="Aenam"
        label="Changed By"
        hiddenInFilterBar={!filterKeys.includes('Aenam')}
        active={!!changedByFilterString}
      >
        <SearchHelpDialog
          key={count}
          label="Changed By"
          field="Aenam"
          afterFilterStringBuild={setChangedByFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="EditLock"
        label="Edit Lock"
        hiddenInFilterBar={!filterKeys.includes('EditLock')}
        active={!!editLock}
      >
        <Select value={editLock} onChange={(event) => setEditLock(event.target.value)} className="h-6.5">
          <Option value="">All</Option>
          <Option value="enabled">Enabled</Option>
          <Option value="disabled">Disabled</Option>
        </Select>
      </FilterGroupItem>
    </FilterBar>
  );
}
