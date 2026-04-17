import * as React from 'react';
import { formatFileSize } from '@/libs/utils';
import type { ConfigFileItem } from '../types';
import { Bar } from '@ui5/webcomponents-react/Bar';
import { Text } from '@ui5/webcomponents-react/Text';
import { splitMimeTypes } from '../helpers/mime-types';
import { Label } from '@ui5/webcomponents-react/Label';
import { Dialog } from '@ui5/webcomponents-react/Dialog';
import { Button } from '@ui5/webcomponents-react/Button';
import { FlexBox } from '@ui5/webcomponents-react/FlexBox';

interface ConfigFileViewProps {
  configFile: ConfigFileItem | null;
  open: boolean;
  onClose: () => void;
}

function displayConfigType(type: ConfigFileItem['Type']) {
  return type === 'IMAGE' ? 'Image' : type === 'DOCUMENT' ? 'Document' : `"${type}"`;
}

export function ConfigFileView({ configFile, open, onClose }: ConfigFileViewProps) {
  const mimeTypes = React.useMemo(() => splitMimeTypes(configFile?.MimeType), [configFile?.MimeType]);

  return (
    <Dialog
      open={open && !!configFile}
      resizable
      draggable
      headerText="Configuration File Details"
      className="md:min-w-2xl"
      footer={
        <Bar
          design="Footer"
          endContent={
            <Button design="Transparent" onClick={onClose}>
              Close
            </Button>
          }
        />
      }
      onClose={onClose}
    >
      {configFile ? (
        <div className="grid gap-4 p-2 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label showColon>File Extension</Label>
            <Text>.{configFile.FileExt}</Text>
          </div>
          <div className="flex flex-col gap-1">
            <Label showColon>Type</Label>
            <Text>{displayConfigType(configFile.Type)}</Text>
          </div>
          <div className="flex flex-col gap-1">
            <Label showColon>Max Size</Label>
            <Text>{formatFileSize(configFile.MaxBytes)}</Text>
          </div>
          <div className="flex flex-col gap-1">
            <Label showColon>Is Active</Label>
            <Text>{configFile.IsActive ? 'Yes' : 'No'}</Text>
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label showColon>Description</Label>
            <Text>{configFile.Description || '-'}</Text>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label showColon>Mime Types</Label>
            {mimeTypes.length > 0 ? (
              <FlexBox direction="Column" className="gap-2">
                {mimeTypes.map((mimeType) => (
                  <div key={mimeType} className="rounded-md border px-3 py-2">
                    <Text>{mimeType}</Text>
                  </div>
                ))}
              </FlexBox>
            ) : (
              <Text>-</Text>
            )}
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
