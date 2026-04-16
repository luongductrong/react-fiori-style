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

export type CreateConfigFilePayload = {
  FileExt: string;
  MimeType: string;
  MaxBytes: number;
  IsActive: 'X';
  Description: string;
  Type: ConfigFileItem['Type'];
};

export type CreateConfigFileResponse = ConfigFileItem;

export type UpdateConfigFilePayload = {
  MimeType: string;
  MaxBytes: number;
  Description: string;
  Type: ConfigFileItem['Type'];
  IsActive: 'X';
};

export type UpdateConfigFileResponse = unknown;

export type EnableConfigFileParams = {
  FileExt: string;
};

export type EnableConfigFileResponse = unknown;

export type DisableConfigFileParams = {
  FileExt: string;
};

export type DisableConfigFileResponse = unknown;
