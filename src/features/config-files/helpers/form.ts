import type { ConfigFileItem } from '../types';
import { getMimeTypeInputValues } from './mime-types';
import type { ConfigFileFormValues } from '../components/config-file-form';

export function getInitialConfigFileFormValues(configFile?: ConfigFileItem | null): ConfigFileFormValues {
  return {
    fileExt: configFile?.FileExt ?? '',
    mimeTypes: getMimeTypeInputValues(configFile?.MimeType),
    maxBytes: configFile?.MaxBytes ? String(configFile.MaxBytes) : '',
    description: configFile?.Description ?? '',
    type: configFile?.Type ?? 'DOCUMENT',
  };
}
