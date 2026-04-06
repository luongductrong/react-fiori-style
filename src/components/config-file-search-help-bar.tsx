import * as React from 'react';
import { Button } from '@ui5/webcomponents-react/Button';
import { SearchHelpDialog } from './search-help-dialog';

interface ConfigFileSearchHelpBarProps {
  onFilterChange: (filter: string) => void;
}

export function ConfigFileSearchHelpBar({ onFilterChange }: ConfigFileSearchHelpBarProps) {
  const [resetKey, setResetKey] = React.useState(0);
  const [fileExtFilterString, setFileExtFilterString] = React.useState('');
  const [mimeTypeFilterString, setMimeTypeFilterString] = React.useState('');
  const [descriptionFilterString, setDescriptionFilterString] = React.useState('');

  const combinedFilter = React.useMemo(() => {
    return [fileExtFilterString, mimeTypeFilterString, descriptionFilterString].filter(Boolean).join(' and ');
  }, [descriptionFilterString, fileExtFilterString, mimeTypeFilterString]);

  React.useEffect(() => {
    onFilterChange(combinedFilter);
  }, [combinedFilter, onFilterChange]);

  const clearFilters = () => {
    setFileExtFilterString('');
    setMimeTypeFilterString('');
    setDescriptionFilterString('');
    setResetKey((prev) => prev + 1);
    onFilterChange('');
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-700">Search Help</div>
        <Button design="Transparent" onClick={clearFilters}>
          Clear
        </Button>
      </div>
      <div className="grid gap-3 xl:grid-cols-3">
        <SearchHelpDialog
          key={`file-ext-${resetKey}`}
          label="File Ext"
          field="FileExt"
          options={['equal to', 'contains', 'starts with', 'ends with']}
          afterFilterStringBuild={setFileExtFilterString}
        />
        <SearchHelpDialog
          key={`mime-type-${resetKey}`}
          label="Mime Type"
          field="MimeType"
          afterFilterStringBuild={setMimeTypeFilterString}
        />
        <SearchHelpDialog
          key={`description-${resetKey}`}
          label="Description"
          field="Description"
          afterFilterStringBuild={setDescriptionFilterString}
        />
      </div>
    </div>
  );
}
