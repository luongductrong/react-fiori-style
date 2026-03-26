export type AttachmentListItem = {
  FileId: string;
  Title: string;
  CurrentVersion: string;
  IsActive: boolean;
  Erdat: string;
  Ernam: string;
  __EntityControl: {
    Deletable: boolean;
    Updatable: boolean;
  };
};

export type AttachmentListResponse = {
  value: AttachmentListItem[];
  '@odata.count': string;
};

export type AttachmentListParams = {
  'sap-client': number;
  $count: boolean;
  $select: string;
  $skip: number;
  $top: number;
  $filter?: string;
  $search?: string;
};

export type AttachmentDetailParams = {
  'sap-client': number;
  $select: string;
  $expand?: string;
};

export type AttachmentDetailResponse = {
  FileId: string;
  Title: string;
  CurrentVersion: string;
  IsActive: boolean;
  Erdat: string;
  Ernam: string;
  __EntityControl: {
    Deletable: boolean;
    Updatable: boolean;
  };
  _CurrentVersion?: {
    FileName: string;
    MimeType: string;
    FileContent: string;
  };
};

export type AttachmentVersionItem = {
  FileId: string;
  VersionNo: string;
  FileName: string;
  Erdat: string;
  Ernam: string;
  __EntityControl: {
    Deletable: boolean;
    Updatable: boolean;
  };
};

export type AttachmentVersionsResponse = {
  value: AttachmentVersionItem[];
  '@odata.count': string;
};

export type AttachmentVersionsParams = {
  'sap-client': number;
  $count: boolean;
  $select: string;
  $skip: number;
  $top: number;
};

export type AttachmentAuditItem = {
  FileId: string;
  Erdat: string;
  Erzet: string;
  Uname: string;
  Action: string;
  Note: string;
  Ernam: string;
};

export type AttachmentAuditsResponse = {
  '@odata.count': string;
  value: AttachmentAuditItem[];
};

export type AttachmentAuditsParams = {
  'sap-client': number;
  $count: boolean;
  $select: string;
  $skip: number;
  $top: number;
};

export type VersionDetail = {
  FileId: string;
  VersionNo: string;
  FileName: string;
  FileExtension: string;
  MimeType: string;
  FileSize: number;
  FileContent: string;
  Ernam: string;
  __EntityControl: {
    Deletable: boolean;
    Updatable: boolean;
  };
};

export type VersionDetailParams = {
  'sap-client': number;
  $select: string;
};

export type AttachmentTitleResponse = {
  value: string;
};

export type AttachmentTitleParams = {
  'sap-client': number;
};

export type RollbackVersionPayload = {
  CurrentVersion: string;
};

export type UploadedFileData = {
  FileName: string;
  FileExtension: string;
  MimeType: string;
  FileSize: number; // bytes
  FileContent: string; // base64
};

export type UploadVersionPayload = UploadedFileData & {
  FileId: string;
};

export type UploadVersionResponse = {
  FileId: string;
  VersionNo: string;
  FileName: string;
  FileExtension: string;
  MimeType: string;
  FileSize: number;
  Erdat: string;
  Erzet: string;
  Ernam: string;
};

export type CreateAttachmentPayload = {
  Title: string;
  EditLock: boolean;
};

export type CreateAttachmentResponse = {
  FileId: string;
  Title: string;
  EditLock: boolean;
};
