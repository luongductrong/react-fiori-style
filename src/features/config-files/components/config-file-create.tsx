import * as React from 'react';
import { toast } from '@/libs/toast';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { ConfigFileForm } from './config-file-form';
import { validateConfigFileForm } from '../validate';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { BusyIndicator } from '@/components/busy-indicator';
import { getInitialConfigFileFormValues } from '../helpers/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { normalizeMimeTypesForStorage } from '../helpers/mime-types';
import { createConfigFileMutationOptions } from '../options/mutation';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';
import type { ConfigFileFormTouchedFields } from './config-file-form';

const INITIAL_TOUCHED_FIELDS: ConfigFileFormTouchedFields = {
  fileExt: false,
  mimeTypes: false,
  maxBytes: false,
  description: false,
};

export function ConfigFileCreate() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState(getInitialConfigFileFormValues);
  const [touchedFields, setTouchedFields] = React.useState(INITIAL_TOUCHED_FIELDS);
  const [showAllValidation, setShowAllValidation] = React.useState(false);

  const { mutate: createConfigFile, isPending } = useMutation(
    createConfigFileMutationOptions({
      onSuccess: () => {
        toast('Configuration file created successfully');
        queryClient.invalidateQueries({ queryKey: ['config-files'] });
        setOpen(false);
        setValues(getInitialConfigFileFormValues());
        setTouchedFields(INITIAL_TOUCHED_FIELDS);
        setShowAllValidation(false);
      },
    }),
  );

  const normalizedFileExt = values.fileExt.trim().replace(/^\./, '').toLowerCase();
  const normalizedMimeType = normalizeMimeTypesForStorage(values.mimeTypes);
  const normalizedDescription = values.description.trim();
  const maxBytes = Number(values.maxBytes);
  const validation = React.useMemo(() => validateConfigFileForm(values), [values]);
  const isSaveDisabled = Boolean(
    validation.fileExt || validation.mimeTypes.error || validation.maxBytes || validation.description,
  );

  const handleFieldTouch = function (field: keyof ConfigFileFormTouchedFields) {
    setTouchedFields((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  const handleClose = function () {
    if (isPending) {
      return;
    }

    setOpen(false);
    setValues(getInitialConfigFileFormValues());
    setTouchedFields(INITIAL_TOUCHED_FIELDS);
    setShowAllValidation(false);
  };

  // TODO: limit file size
  const handleSubmit = function () {
    setShowAllValidation(true);

    if (isSaveDisabled) {
      return;
    }

    createConfigFile({
      FileExt: normalizedFileExt,
      MimeType: normalizedMimeType,
      MaxBytes: maxBytes,
      IsActive: true,
      Description: normalizedDescription,
      Type: values.type,
    });
  };

  return (
    <React.Fragment>
      <ToolbarButton design="Transparent" text="Create" onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        resizable
        draggable
        headerText="Create Configuration File"
        className="md:min-w-2xl relative"
        footer={
          <Bar
            design="Footer"
            endContent={
              <React.Fragment>
                <Button design="Emphasized" onClick={handleSubmit} disabled={isSaveDisabled || isPending}>
                  Save
                </Button>
                <Button design="Transparent" onClick={handleClose} disabled={isPending}>
                  Cancel
                </Button>
              </React.Fragment>
            }
          />
        }
        onClose={handleClose}
      >
        <ConfigFileForm
          value={values}
          validation={validation}
          touchedFields={touchedFields}
          showAllValidation={showAllValidation}
          onFieldTouch={handleFieldTouch}
          onChange={setValues}
        />
        <BusyIndicator type="pending" show={isPending} />
      </Dialog>
    </React.Fragment>
  );
}
