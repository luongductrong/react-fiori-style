import * as React from 'react';
import { Input } from '@ui5/webcomponents-react/Input';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { FilterBar } from '@ui5/webcomponents-react/FilterBar';
import { SearchHelpDialog } from '@/components/search-help-dialog';
import { FilterGroupItem } from '@ui5/webcomponents-react/FilterGroupItem';

interface ConfigFilesFilterBarProps {
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
}

const DEFAULT_FILTER_KEYS = ['FileExt', 'Type', 'Description', 'IsActive'];

export function ConfigFilesFilterBar({ onFilterChange, onSearchChange }: ConfigFilesFilterBarProps) {
  const [count, setCount] = React.useState(0);
  const [type, setType] = React.useState('');
  const [isActive, setIsActive] = React.useState('');
  const [filterKeys, setFilterKeys] = React.useState<string[]>(DEFAULT_FILTER_KEYS);
  const [fileExtFilterString, setFileExtFilterString] = React.useState('');
  const [mimeTypeFilterString, setMimeTypeFilterString] = React.useState('');
  const [descriptionFilterString, setDescriptionFilterString] = React.useState('');
  const [maxBytesFilterString, setMaxBytesFilterString] = React.useState('');

  const handleOnGo = function () {
    const typeFilter = type ? `Type eq '${type}'` : '';
    const isActiveFilter =
      isActive === 'active' ? 'IsActive eq true' : isActive === 'inactive' ? 'IsActive eq false' : '';
    const filter = [
      fileExtFilterString,
      mimeTypeFilterString,
      typeFilter,
      descriptionFilterString,
      maxBytesFilterString,
      isActiveFilter,
    ]
      .filter(Boolean)
      .join(' and ');
    onFilterChange(filter);
  };

  const handleClear = function () {
    setCount((prev) => prev + 1);
    setType('');
    setIsActive('');
    setFilterKeys(DEFAULT_FILTER_KEYS);
    setFileExtFilterString('');
    setMimeTypeFilterString('');
    setDescriptionFilterString('');
    setMaxBytesFilterString('');
    onSearchChange('');
    onFilterChange('');
  };

  return (
    <FilterBar
      hideToolbar={true}
      showGoOnFB={true}
      showResetButton={true}
      onFiltersDialogSave={(event) => setFilterKeys(event.detail.selectedFilterKeys)}
      onGo={handleOnGo}
      onClear={handleClear}
      onRestore={handleClear}
      search={<Input className="*:h-full h-6.5" onChange={(e) => onSearchChange(e.target.value)} />}
    >
      <FilterGroupItem
        filterKey="FileExt"
        label="File Ext"
        hiddenInFilterBar={!filterKeys.includes('FileExt')}
        active={!!fileExtFilterString}
      >
        <SearchHelpDialog
          key={count}
          label="File Ext"
          field="FileExt"
          options={['equal to']}
          afterFilterStringBuild={setFileExtFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="MimeType"
        label="Mime Type"
        hiddenInFilterBar={!filterKeys.includes('MimeType')}
        active={!!mimeTypeFilterString}
      >
        <SearchHelpDialog
          key={count}
          label="Mime Type"
          field="MimeType"
          options={['contains']}
          afterFilterStringBuild={setMimeTypeFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="Description"
        label="Description"
        hiddenInFilterBar={!filterKeys.includes('Description')}
        active={!!descriptionFilterString}
      >
        <SearchHelpDialog
          key={count}
          label="Description"
          field="Description"
          afterFilterStringBuild={setDescriptionFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem filterKey="Type" label="Type" hiddenInFilterBar={!filterKeys.includes('Type')} active={!!type}>
        <Select value={type} onChange={(event) => setType(event.target.value)} className="h-6.5">
          <Option value="">All</Option>
          <Option value="DOCUMENT">Document</Option>
          <Option value="IMAGE">Image</Option>
        </Select>
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="MaxBytes"
        label="Max Size"
        hiddenInFilterBar={!filterKeys.includes('MaxBytes')}
        active={!!maxBytesFilterString}
      >
        <SearchHelpDialog
          key={count}
          label="Max Size"
          field="MaxBytes"
          options={['equal to']}
          useApostrophe={false}
          afterFilterStringBuild={setMaxBytesFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="IsActive"
        label="Active"
        hiddenInFilterBar={!filterKeys.includes('IsActive')}
        active={!!isActive}
      >
        <Select value={isActive} onChange={(event) => setIsActive(event.target.value)} className="h-6.5">
          <Option value="">All</Option>
          <Option value="active">Yes</Option>
          <Option value="inactive">No</Option>
        </Select>
      </FilterGroupItem>
    </FilterBar>
  );
}
