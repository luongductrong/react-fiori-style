import * as React from 'react';
import { toast } from '@/libs/toast';
import type { ConfigFileItem } from '../types';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { ConfigFileForm } from './config-file-form';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { BusyIndicator } from '@/components/busy-indicator';
import { getInitialConfigFileFormValues } from '../helpers/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateConfigFileMutationOptions } from '../options/mutation';

interface ConfigFileEditProps {
  configFile: ConfigFileItem | null;
  open: boolean;
  onClose: () => void;
}

export function ConfigFileEdit({ configFile, open, onClose }: ConfigFileEditProps) {
  const queryClient = useQueryClient();
  const [values, setValues] = React.useState(() => getInitialConfigFileFormValues(configFile));

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
  }, [configFile, open]);

  const normalizedMimeType = values.mimeType.trim();
  const normalizedDescription = values.description.trim();
  const maxBytes = Number(values.maxBytes);
  const isSaveDisabled = !normalizedMimeType || !normalizedDescription || !Number.isFinite(maxBytes) || maxBytes <= 0;

  const handleClose = function () {
    if (isPending) {
      return;
    }

    onClose();
  };

  const handleSubmit = function () {
    if (!configFile) {
      return;
    }

    updateConfigFile({
      MimeType: normalizedMimeType,
      MaxBytes: maxBytes,
      Description: normalizedDescription,
      Type: values.type,
      IsActive: 'X', // TODO: check this
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
      <ConfigFileForm value={values} onChange={setValues} disableFileExt />
      <BusyIndicator type="pending" show={isPending} />
    </Dialog>
  );
}
