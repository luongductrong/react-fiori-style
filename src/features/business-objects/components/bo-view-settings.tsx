import * as React from 'react';
import '@ui5/webcomponents-icons/search.js';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { useViewStore } from '@/stores/view-store';
import '@ui5/webcomponents-icons/action-settings.js';
import { Text } from '@ui5/webcomponents-react/Text';
import { Icon } from '@ui5/webcomponents-react/Icon';
import { Input } from '@ui5/webcomponents-react/Input';
import { Title } from '@ui5/webcomponents-react/Title';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { CheckBox } from '@ui5/webcomponents-react/CheckBox';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import { BO_LIST_FIELDS } from '@/features/business-objects/view-config';
import type { BoListFieldId, BoListFieldOption } from '@/features/business-objects/view-config';

function matchesSearch(field: BoListFieldOption, search: string) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }
  return field.label.toLowerCase().includes(normalizedSearch) || field.id.toLowerCase().includes(normalizedSearch);
}

interface BoViewSettingsProps {
  onSelectChange?: (selectedIds: BoListFieldId[]) => void;
}

export function BoViewSettings({ onSelectChange }: BoViewSettingsProps) {
  const selectedIds = useViewStore((state) => state.boListVisibleFieldIds);
  const setSelectedIds = useViewStore((state) => state.setBoListVisibleFieldIds);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [showSelectedOnly, setShowSelectedOnly] = React.useState(false);
  const [draftSelectedIds, setDraftSelectedIds] = React.useState<BoListFieldId[]>(selectedIds);

  const selectedFieldIds = React.useMemo(() => new Set(draftSelectedIds), [draftSelectedIds]);
  const visibleFields = React.useMemo(() => {
    return BO_LIST_FIELDS.filter((field) => matchesSearch(field, search)).filter(
      (field) => !showSelectedOnly || selectedFieldIds.has(field.id),
    );
  }, [search, selectedFieldIds, showSelectedOnly]);
  const visibleFieldIds = React.useMemo(() => visibleFields.map((field) => field.id), [visibleFields]);
  const selectedCount = draftSelectedIds.length;
  const totalCount = BO_LIST_FIELDS.length;
  const allVisibleSelected = visibleFields.length > 0 && visibleFields.every((field) => selectedFieldIds.has(field.id));

  const resetDialogUi = function () {
    setSearch('');
    setShowSelectedOnly(false);
  };

  const restoreSavedSelection = function () {
    setDraftSelectedIds(selectedIds);
  };

  const handleOpen = function () {
    restoreSavedSelection();
    resetDialogUi();
    setOpen(true);
  };

  const handleClose = function () {
    restoreSavedSelection();
    resetDialogUi();
    setOpen(false);
  };

  const handleReset = function () {
    restoreSavedSelection();
    resetDialogUi();
  };

  const handleConfirm = function () {
    setSelectedIds(draftSelectedIds);
    onSelectChange?.(draftSelectedIds);
    resetDialogUi();
    setOpen(false);
  };

  const handleFieldToggle = function (fieldId: BoListFieldId, checked: boolean) {
    setDraftSelectedIds((prev) => {
      if (checked) {
        return prev.includes(fieldId) ? prev : [...prev, fieldId];
      }

      return prev.filter((id) => id !== fieldId);
    });
  };

  const handleVisibleFieldsToggle = function (checked: boolean) {
    setDraftSelectedIds((prev) => {
      if (checked) {
        return BO_LIST_FIELDS.filter(
          (field) => prev.includes(field.id) || visibleFieldIds.includes(field.id),
        ).map((field) => field.id);
      }

      return prev.filter((id) => !visibleFieldIds.includes(id));
    });
  };

  return (
    <React.Fragment>
      <ToolbarButton
        design="Transparent"
        icon="action-settings"
        tooltip="View settings"
        accessibleName="View settings"
        className="h-8"
        onClick={handleOpen}
      />
      <Dialog
        open={open}
        resizable
        draggable
        accessibleName="View Settings"
        className="min-w-full md:min-w-lg lg:min-w-3xl min-h-[50vh]"
        header={
          <Bar
            startContent={<Title level="H4">View Settings</Title>}
            endContent={
              <Button design="Transparent" className="h-8" onClick={handleReset}>
                Reset
              </Button>
            }
          />
        }
        footer={
          <Bar
            design="Footer"
            endContent={
              <FlexBox className="gap-2" justifyContent="End">
                <Button design="Emphasized" className="h-8" onClick={handleConfirm}>
                  OK
                </Button>
                <Button design="Transparent" className="h-8" onClick={handleClose}>
                  Cancel
                </Button>
              </FlexBox>
            }
          />
        }
        onClose={handleClose}
      >
        <div className="flex items-center justify-between gap-3 border-b pb-3">
          <Input
            value={search}
            placeholder="Search"
            showClearIcon
            className="w-full max-w-sm h-6.5"
            icon={<Icon name="search" className="h-full" />}
            onInput={(event) => setSearch(event.target.value)}
          />
          <Button design="Transparent" className="h-8 shrink-0" onClick={() => setShowSelectedOnly((prev) => !prev)}>
            {showSelectedOnly ? 'Show All' : 'Show Selected'}
          </Button>
        </div>
        <div className="flex items-center gap-3 border-b py-2">
          <CheckBox
            checked={allVisibleSelected}
            onChange={(event) => handleVisibleFieldsToggle(event.target.checked ?? false)}
          />
          <Text className="font-semibold">
            Columns ({selectedCount}/{totalCount})
          </Text>
        </div>
        <div className="flex-1 overflow-auto">
          {visibleFields.length > 0 ? (
            visibleFields.map((field) => (
              <div key={field.id} className="flex items-center gap-2 border-b border-border/40">
                <CheckBox
                  checked={selectedFieldIds.has(field.id)}
                  onChange={(event) => handleFieldToggle(field.id, event.target.checked ?? false)}
                />
                <Text>{field.label}</Text>
              </div>
            ))
          ) : (
            <Text className="mt-4">{showSelectedOnly ? 'No selected fields found.' : 'No fields found.'}</Text>
          )}
        </div>
      </Dialog>
    </React.Fragment>
  );
}
