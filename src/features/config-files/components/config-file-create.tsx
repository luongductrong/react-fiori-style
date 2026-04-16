import * as React from 'react';
import { toast } from '@/libs/toast';
import { formatFileSize } from '@/libs/utils';
import type { ConfigFileItem } from '../types';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Input } from '@ui5/webcomponents-react/Input';
import { Text } from '@ui5/webcomponents-react/Text';
import { Label } from '@ui5/webcomponents-react/Label';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { Select } from '@ui5/webcomponents-react/Select';
import { Option } from '@ui5/webcomponents-react/Option';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';
import { BusyIndicator } from '@/components/busy-indicator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createConfigFileMutationOptions } from '../options/mutation';
import { ToolbarButton } from '@ui5/webcomponents-react/ToolbarButton';

function getInitialValues() {
  return {
    fileExt: '',
    mimeType: '',
    maxBytes: '',
    description: '',
    type: 'DOCUMENT' as ConfigFileItem['Type'],
  };
}

export function ConfigFileCreate() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState(getInitialValues);

  const { mutate: createConfigFile, isPending } = useMutation(
    createConfigFileMutationOptions({
      onSuccess: () => {
        toast('Configuration file created successfully');
        queryClient.invalidateQueries({ queryKey: ['config-files'] });
        setOpen(false);
        setValues(getInitialValues());
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
    setValues(getInitialValues());
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
        <div className="grid gap-4 p-2 md:grid-cols-2">
          <FlexBox direction="Column" className="gap-1">
            <Label showColon required>
              File Extension
            </Label>
            <Input
              value={values.fileExt}
              placeholder="Enter file extension, e.g. pdf"
              onInput={(event) => {
                setValues((prev) => ({
                  ...prev,
                  fileExt: event.target.value,
                }));
              }}
            />
          </FlexBox>
          <FlexBox direction="Column" className="gap-1">
            <Label showColon required>
              Type
            </Label>
            <Select
              value={values.type}
              onChange={(event) => {
                setValues((prev) => ({
                  ...prev,
                  type: event.target.value as ConfigFileItem['Type'],
                }));
              }}
            >
              <Option value="DOCUMENT">Document</Option>
              <Option value="IMAGE">Image</Option>
            </Select>
          </FlexBox>
          <FlexBox direction="Column" className="gap-1">
            <Label showColon required>
              Max Bytes
            </Label>
            <FlexBox alignItems="Center" className="gap-2">
              <Input
                type="Number"
                value={values.maxBytes}
                placeholder="Enter max bytes"
                onInput={(event) => {
                  setValues((prev) => ({
                    ...prev,
                    maxBytes: event.target.value,
                  }));
                }}
              />
              <Text>{values.maxBytes.trim() ? formatFileSize(values.maxBytes) : '-'}</Text>
            </FlexBox>
          </FlexBox>
          <FlexBox direction="Column" className="gap-1 md:col-span-2">
            <Label showColon required>
              Mime Type
            </Label>
            <Input
              className="w-full"
              value={values.mimeType}
              placeholder="Enter MIME type"
              onInput={(event) => {
                setValues((prev) => ({
                  ...prev,
                  mimeType: event.target.value,
                }));
              }}
            />
          </FlexBox>
          <FlexBox direction="Column" className="gap-1 md:col-span-2">
            <Label showColon required>
              Description
            </Label>
            <Input
              value={values.description}
              className="w-full"
              placeholder="Enter description"
              onInput={(event) => {
                setValues((prev) => ({
                  ...prev,
                  description: event.target.value,
                }));
              }}
            />
          </FlexBox>
        </div>
        <BusyIndicator type="pending" show={isPending} />
      </Dialog>
    </React.Fragment>
  );
}
