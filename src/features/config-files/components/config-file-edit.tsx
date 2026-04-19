import * as React from 'react';
import { toast } from '@/libs/helpers/toast';
import type { ConfigFileItem } from '../types';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { ConfigFileForm } from './config-file-form';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { BusyIndicator } from '@/components/busy-indicator';
import { getInitialConfigFileFormValues } from '../helpers/form';
import { validateConfigFileForm } from '../helpers/input-validate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateConfigFileMutationOptions } from '../options/mutation';
import { normalizeMimeTypesForStorage } from '../helpers/mime-types';
import type { ConfigFileFormTouchedFields } from './config-file-form';

const INITIAL_TOUCHED_FIELDS: ConfigFileFormTouchedFields = {
  fileExt: false,
  mimeTypes: false,
  maxBytes: false,
  description: false,
};

interface ConfigFileEditProps {
  configFile: ConfigFileItem | null;
  open: boolean;
  onClose: () => void;
}

export function ConfigFileEdit({ configFile, open, onClose }: ConfigFileEditProps) {
  const queryClient = useQueryClient();
  const [values, setValues] = React.useState(() => getInitialConfigFileFormValues(configFile));
  const [touchedFields, setTouchedFields] = React.useState(INITIAL_TOUCHED_FIELDS);
  const [showAllValidation, setShowAllValidation] = React.useState(false);

  const { mutate: updateConfigFile, isPending } = useMutation(
    updateConfigFileMutationOptions({
      fileExt: configFile?.FileExt ?? '',
      onSuccess: () => {
        toast('Configuration file updated successfully');
        queryClient.invalidateQueries({ queryKey: ['config-files'] });
        onClose();
      },
    }),
  );

  React.useEffect(() => {
    if (configFile) {
      setValues(getInitialConfigFileFormValues(configFile));
    }
    setTouchedFields(INITIAL_TOUCHED_FIELDS);
    setShowAllValidation(false);
  }, [configFile, open]);

  const normalizedMimeType = normalizeMimeTypesForStorage(values.mimeTypes);
  const normalizedDescription = values.description.trim();
  const maxBytes = Number(values.maxBytes);
  const validation = React.useMemo(() => validateConfigFileForm(values), [values]);
  const isSaveDisabled = Boolean(validation.mimeTypes.error || validation.maxBytes || validation.description);

  const handleFieldTouch = function (field: keyof ConfigFileFormTouchedFields) {
    setTouchedFields((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  const handleClose = function () {
    if (isPending) {
      return;
    }

    setTouchedFields(INITIAL_TOUCHED_FIELDS);
    setShowAllValidation(false);
    onClose();
  };

  const handleSubmit = function () {
    setShowAllValidation(true);

    if (!configFile || isSaveDisabled) {
      return;
    }

    updateConfigFile({
      MimeType: normalizedMimeType,
      MaxBytes: maxBytes,
      Description: normalizedDescription,
      Type: values.type,
      IsActive: configFile.IsActive,
    });
  };

  return (
    <Dialog
      open={open && !!configFile}
      resizable
      draggable
      headerText="Edit Configuration File"
      className="md:min-w-2xl relative"
      footer={
        <Bar
          design="Footer"
          endContent={
            <React.Fragment>
              <Button design="Emphasized" onClick={handleSubmit} disabled={isSaveDisabled || isPending || !configFile}>
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
        disableFileExt
      />
      <BusyIndicator type="pending" show={isPending} />
    </Dialog>
  );
}
