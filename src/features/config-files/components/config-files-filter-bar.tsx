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

export function ConfigFilesFilterBar({ onFilterChange, onSearchChange }: ConfigFilesFilterBarProps) {
  const [count, setCount] = React.useState(0);
  const [type, setType] = React.useState('');
  const [isActive, setIsActive] = React.useState('');
  const [filterKeys, setFilterKeys] = React.useState<string[]>([
    'FileExt',
    'MimeType',
    'Type',
    'IsActive',
    'Description',
  ]);
  const [fileExtFilterString, setFileExtFilterString] = React.useState('');
  const [mimeTypeFilterString, setMimeTypeFilterString] = React.useState('');
  const [descriptionFilterString, setDescriptionFilterString] = React.useState('');

  const handleOnGo = function () {
    const typeFilter = type ? `Type eq '${type}'` : '';
    const isActiveFilter = isActive === 'active' ? `IsActive eq 'X'` : isActive === 'inactive' ? `IsActive ne 'X'` : '';
    const filter = [fileExtFilterString, mimeTypeFilterString, typeFilter, isActiveFilter, descriptionFilterString]
      .filter(Boolean)
      .join(' and ');
    onFilterChange(filter);
  };

  const handleClear = function () {
    setCount((prev) => prev + 1);
    setType('');
    setIsActive('');
    setFilterKeys(['FileExt', 'MimeType', 'Type', 'IsActive', 'Description']);
    setFileExtFilterString('');
    setMimeTypeFilterString('');
    setDescriptionFilterString('');
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
      <FilterGroupItem filterKey="FileExt" label="File Ext" hiddenInFilterBar={!filterKeys.includes('FileExt')}>
        <SearchHelpDialog
          key={count}
          label="File Ext"
          field="FileExt"
          options={['equal to']}
          afterFilterStringBuild={setFileExtFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem filterKey="MimeType" label="Mime Type" hiddenInFilterBar={!filterKeys.includes('MimeType')}>
        <SearchHelpDialog
          key={count}
          label="Mime Type"
          field="MimeType"
          afterFilterStringBuild={setMimeTypeFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="Description"
        label="Description"
        hiddenInFilterBar={!filterKeys.includes('Description')}
      >
        <SearchHelpDialog
          key={count}
          label="Description"
          field="Description"
          options={['equal to']}
          afterFilterStringBuild={setDescriptionFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem filterKey="Type" label="Type" hiddenInFilterBar={!filterKeys.includes('Type')}>
        <Select value={type} onChange={(event) => setType(event.target.value)} className="h-6.5">
          <Option value="">All</Option>
          <Option value="DOCUMENT">Document</Option>
          <Option value="IMAGE">Image</Option>
        </Select>
      </FilterGroupItem>
      <FilterGroupItem filterKey="IsActive" label="Active" hiddenInFilterBar={!filterKeys.includes('IsActive')}>
        <Select value={isActive} onChange={(event) => setIsActive(event.target.value)} className="h-6.5">
          <Option value="">All</Option>
          <Option value="active">Yes</Option>
          <Option value="inactive">No</Option>
        </Select>
      </FilterGroupItem>
    </FilterBar>
  );
}
