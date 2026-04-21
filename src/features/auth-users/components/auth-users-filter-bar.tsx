import * as React from 'react';
import { Input } from '@ui5/webcomponents-react/Input';
import { FilterBar } from '@ui5/webcomponents-react/FilterBar';
import { SearchHelpDialog } from '@/components/search-help-dialog';
import { FilterGroupItem } from '@ui5/webcomponents-react/FilterGroupItem';

interface AuthUsersFilterBarProps {
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
}

const DEFAULT_FILTER_KEYS = ['Uname', 'Erdat', 'Ernam'];

export function AuthUsersFilterBar({ onFilterChange, onSearchChange }: AuthUsersFilterBarProps) {
  const [count, setCount] = React.useState(0);
  const [filterKeys, setFilterKeys] = React.useState<string[]>(DEFAULT_FILTER_KEYS);
  const [userNameFilterString, setUserNameFilterString] = React.useState('');
  const [createdOnFilterString, setCreatedOnFilterString] = React.useState('');
  const [createdByFilterString, setCreatedByFilterString] = React.useState('');

  const handleOnGo = function () {
    const filter = [userNameFilterString, createdOnFilterString, createdByFilterString].filter(Boolean).join(' and ');
    onFilterChange(filter);
  };

  const handleClear = function () {
    setCount((prev) => prev + 1);
    onSearchChange('');
    setFilterKeys(DEFAULT_FILTER_KEYS);
    setUserNameFilterString('');
    setCreatedOnFilterString('');
    setCreatedByFilterString('');
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
        filterKey="Uname"
        label="User Name"
        hiddenInFilterBar={!filterKeys.includes('Uname')}
        active={!!userNameFilterString}
      >
        <SearchHelpDialog
          key={count}
          label="User Name"
          field="Uname"
          options={['equal to']}
          afterFilterStringBuild={setUserNameFilterString}
        />
      </FilterGroupItem>
      <FilterGroupItem
        filterKey="Erdat"
        label="Created On"
        hiddenInFilterBar={!filterKeys.includes('Erdat')}
        active={!!createdOnFilterString}
      >
        <SearchHelpDialog
          key={count}
          label="Created On"
          field="Erdat"
          options={['equal to']}
          useApostrophe={false}
          afterFilterStringBuild={setCreatedOnFilterString}
        />
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
          options={['equal to']}
          afterFilterStringBuild={setCreatedByFilterString}
        />
      </FilterGroupItem>
    </FilterBar>
  );
}
