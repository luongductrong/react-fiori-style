export type ConfigFileItem = {
  FileExt: string;
  MimeType: string;
  MaxBytes: number;
  IsActive: string | boolean;
  Description: string;
  Type: 'DOCUMENT' | 'IMAGE';
  __EntityControl: {
    Updatable: boolean;
  };
  __OperationControl: {
    disable: boolean;
    enable: boolean;
  };
};

export type ConfigFileListResponse = {
  '@odata.count': number;
  value: ConfigFileItem[];
};

export type ConfigFileListParams = {
  'sap-client': number;
  $count?: boolean;
};

export type EnableConfigFileParams = {
  FileExt: string;
};

export type EnableConfigFileResponse = unknown;

export type DisableConfigFileParams = {
  FileExt: string;
};

export type DisableConfigFileResponse = unknown;
