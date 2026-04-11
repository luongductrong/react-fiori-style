import * as React from 'react';
import { BO_STATUS, BO_TYPES } from '../constants';
import { Input } from '@ui5/webcomponents-react/Input';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { displayBoStatus, displayBoType } from '../helpers';
import { FilterBar } from '@ui5/webcomponents-react/FilterBar';
import { SearchHelpDialog } from '@/components/search-help-dialog';
import { FilterGroupItem } from '@ui5/webcomponents-react/FilterGroupItem';

interface BizObjectsFilterBarProps {
  onFilterChange: (_filter: string) => void;
  onSearchChange: (_search: string) => void;
}

export function BizObjectsFilterBar({ onFilterChange, onSearchChange }: BizObjectsFilterBarProps) {
  const [count, setCount] = React.useState(0);
  const [boType, setBoType] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [filterKeys, setFilterKeys] = React.useState<string[]>(['BoId', 'BoType', 'BoTitle', 'Status', 'Ernam']);
  const [boIdFilterString, setBoIdFilterString] = React.useState('');
  const [boTitleFilterString, setBoTitleFilterString] = React.useState('');
  const [createdByFilterString, setCreatedByFilterString] = React.useState('');

  const handleOnGo = function () {
    const boTypeFilter = boType ? `BoType eq '${boType}'` : '';
    const statusFilter = status ? `Status eq '${status}'` : '';
    const filter = [boIdFilterString, boTitleFilterString, boTypeFilter, statusFilter, createdByFilterString]
      .filter(Boolean)
      .join(' and ');
    onFilterChange(filter);
  };

  const onClear = function () {
    setCount((prev) => prev + 1);
    setFilterKeys(['BoId', 'BoType', 'BoTitle', 'Status', 'Ernam']);
    setBoIdFilterString('');
    setBoTitleFilterString('');
    setCreatedByFilterString('');
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
      <FilterGroupItem filterKey="BoId" label="BO ID" hiddenInFilterBar={!filterKeys.includes('BoId')}>
        <SearchHelpDialog
          key={count}
          label="BO ID"
          field="BoId"
          options={['equal to']}
          useApostrophe={false}
          afterFilterStringBuild={setBoIdFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem filterKey="BoTitle" label="Title" hiddenInFilterBar={!filterKeys.includes('BoTitle')}>
        <SearchHelpDialog key={count} label="Title" field="BoTitle" afterFilterStringBuild={setBoTitleFilterString} />
      </FilterGroupItem>
      <FilterGroupItem filterKey="BoType" label="Type" hiddenInFilterBar={!filterKeys.includes('BoType')}>
        <Select value={boType} onChange={(event) => setBoType(event.target.value)} className="h-6.5">
          <Option value="">All</Option>
          {BO_TYPES.map((type) => (
            <Option key={type} value={type}>
              {displayBoType(type)}
            </Option>
          ))}
        </Select>
      </FilterGroupItem>
      <FilterGroupItem filterKey="Status" label="Status" hiddenInFilterBar={!filterKeys.includes('Status')}>
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="h-6.5">
          <Option value="">All</Option>
          {BO_STATUS.map((item) => (
            <Option key={item} value={item}>
              {displayBoStatus(item)}
            </Option>
          ))}
        </Select>
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
