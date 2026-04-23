import * as React from 'react';
import { BO_STATUS, BO_TYPES } from '../constants';
import { Input } from '@ui5/webcomponents-react/Input';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { FilterBar } from '@ui5/webcomponents-react/FilterBar';
import { SearchHelpDialog } from '@/components/search-help-dialog';
import { displayBoStatus, displayBoType } from '../helpers/formatter';
import { DateRangeSearchHelp } from '@/components/date-range-search-help';
import { FilterGroupItem } from '@ui5/webcomponents-react/FilterGroupItem';

interface BizObjectsFilterBarProps {
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
}

const DEFAULT_FILTER_KEYS = ['BoId', 'BoType', 'BoTitle', 'Status', 'Erdat', 'Ernam'];

export function BizObjectsFilterBar({ onFilterChange, onSearchChange }: BizObjectsFilterBarProps) {
  const [count, setCount] = React.useState(0);
  const [boType, setBoType] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [filterKeys, setFilterKeys] = React.useState<string[]>(DEFAULT_FILTER_KEYS);
  const [boIdFilterString, setBoIdFilterString] = React.useState('');
  const [boTitleFilterString, setBoTitleFilterString] = React.useState('');
  const [createdOnFilterString, setCreatedOnFilterString] = React.useState('');
  const [createdByFilterString, setCreatedByFilterString] = React.useState('');
  const [changedOnFilterString, setChangedOnFilterString] = React.useState('');
  const [changedByFilterString, setChangedByFilterString] = React.useState('');

  const handleOnGo = function () {
    const boTypeFilter = boType ? `BoType eq '${boType}'` : '';
    const statusFilter = status ? `Status eq '${status}'` : '';
    const filter = [
      boIdFilterString,
      boTitleFilterString,
      boTypeFilter,
      statusFilter,
      createdOnFilterString,
      createdByFilterString,
      changedOnFilterString,
      changedByFilterString,
    ]
      .filter(Boolean)
      .join(' and ');
    onFilterChange(filter);
  };

  const onClear = function () {
    setCount((prev) => prev + 1);
    setFilterKeys(DEFAULT_FILTER_KEYS);
    setBoIdFilterString('');
    setBoTitleFilterString('');
    setCreatedOnFilterString('');
    setCreatedByFilterString('');
    setChangedOnFilterString('');
    setChangedByFilterString('');
    setBoType('');
    setStatus('');
    onSearchChange('');
    onFilterChange('');
  };

  return (
    <FilterBar
      hideToolbar={true}
      showGoOnFB={true}
      showResetButton={true}
      onFiltersDialogSave={(e) => setFilterKeys(e.detail.selectedFilterKeys)}
      onGo={handleOnGo}
      onClear={onClear}
      onRestore={onClear}
      search={<Input className="*:h-full h-6.5" onChange={(e) => onSearchChange(e.target.value)} />}
    >
      <FilterGroupItem
        filterKey="BoId"
        label="BO ID"
        hiddenInFilterBar={!filterKeys.includes('BoId')}
        active={!!boIdFilterString}
      >
        <SearchHelpDialog
          key={count}
          label="BO ID"
          field="BoId"
          options={['equal to']}
          useApostrophe={false}
          afterFilterStringBuild={setBoIdFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="BoTitle"
        label="Title"
        hiddenInFilterBar={!filterKeys.includes('BoTitle')}
        active={!!boTitleFilterString}
      >
        <SearchHelpDialog key={count} label="Title" field="BoTitle" afterFilterStringBuild={setBoTitleFilterString} />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="BoType"
        label="Type"
        hiddenInFilterBar={!filterKeys.includes('BoType')}
        active={!!boType}
      >
        <Select value={boType} onChange={(event) => setBoType(event.target.value)} className="h-6.5">
          <Option value="">All</Option>
          {BO_TYPES.map((type) => (
            <Option key={type} value={type}>
              {displayBoType(type)}
            </Option>
          ))}
        </Select>
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="Status"
        label="Status"
        hiddenInFilterBar={!filterKeys.includes('Status')}
        active={!!status}
      >
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="h-6.5">
          <Option value="">All</Option>
          {BO_STATUS.map((item) => (
            <Option key={item} value={item}>
              {displayBoStatus(item)}
            </Option>
          ))}
        </Select>
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
    </FilterBar>
  );
}
