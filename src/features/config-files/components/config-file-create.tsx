import * as React from 'react';
import { toast } from '@/libs/toast';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { ConfigFileForm } from './config-file-form';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { BusyIndicator } from '@/components/busy-indicator';
import { getInitialConfigFileFormValues } from '../helpers/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createConfigFileMutationOptions } from '../options/mutation';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';

export function ConfigFileCreate() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState(getInitialConfigFileFormValues);

  const { mutate: createConfigFile, isPending } = useMutation(
    createConfigFileMutationOptions({
      onSuccess: () => {
        toast('Configuration file created successfully');
        queryClient.invalidateQueries({ queryKey: ['config-files'] });
        setOpen(false);
        setValues(getInitialConfigFileFormValues());
      },
    }),
  );

  const normalizedFileExt = values.fileExt.trim().replace(/^\./, '').toLowerCase();
  const normalizedMimeType = values.mimeType.trim();
  const normalizedDescription = values.description.trim();
  const maxBytes = Number(values.maxBytes);
  const isSaveDisabled =
    !normalizedFileExt || !normalizedMimeType || !normalizedDescription || !Number.isFinite(maxBytes) || maxBytes <= 0;

  const handleClose = function () {
    if (isPending) {
      return;
    }

    setOpen(false);
    setValues(getInitialConfigFileFormValues());
  };

  // TODO: limit file size
  const handleSubmit = function () {
    createConfigFile({
      FileExt: normalizedFileExt,
      MimeType: normalizedMimeType,
      MaxBytes: maxBytes,
      IsActive: 'X',
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
        <ConfigFileForm value={values} onChange={setValues} />
        <BusyIndicator type="pending" show={isPending} />
      </Dialog>
    </React.Fragment>
  );
}
