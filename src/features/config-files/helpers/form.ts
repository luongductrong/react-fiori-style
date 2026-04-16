import type { ConfigFileItem } from '../types';
import type { ConfigFileFormValues } from '../components/config-file-form';

export function getInitialConfigFileFormValues(configFile?: ConfigFileItem | null): ConfigFileFormValues {
  return {
    fileExt: configFile?.FileExt ?? '',
    mimeType: configFile?.MimeType ?? '',
    maxBytes: configFile?.MaxBytes ? String(configFile.MaxBytes) : '',
    description: configFile?.Description ?? '',
    type: configFile?.Type ?? 'DOCUMENT',
  };
}
