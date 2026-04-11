import type { LinkedAttachment } from '@/features/attachments/types';

export type BizObjectItem = {
  BoId: string;
  BoType: string;
  BoTitle: string;
  Status: string;
  Erdat: string | null;
  Erzet: string | null;
  Ernam: string;
  Aedat: string | null;
  Aezet: string | null;
  Aenam: string;
  __EntityControl: {
    Deletable: boolean;
    Updatable: boolean;
  };
  __OperationControl: {
    link_attachment: boolean;
  };
};

export type BizObjectListParams = {
  'sap-client': number;
  $count?: boolean;
  $select?: string;
  $skip?: number;
  $top?: number;
  $filter?: string;
  $search?: string;
};

export type BizObjectListResponse = {
  '@odata.count': string;
  value: BizObjectItem[];
};

export type BizObjectDetailParams = {
  'sap-client': number;
  $select?: string;
  $expand?: string;
};

export type BizObjectLinkedAttachmentParams = {
  'sap-client': number;
  $count?: boolean;
  $select?: string;
  $skip?: number;
  $top?: number;
  $expand?: string;
};

export type BizObjectLinkedAttachmentItem = {
  BoId: string;
  FileId: string;
  Erdat: string | null;
  Erzet: string | null;
  Ernam: string;
  __EntityControl: {
    Deletable: boolean;
    Updatable: boolean;
  };
  _Attach: LinkedAttachment;
};

export type BizObjectLinkedAttachmentsResponse = {
  '@odata.count': string;
  value: BizObjectLinkedAttachmentItem[];
};

export type CreateBizObjectPayload = {
  BoType: string;
  BoTitle: string;
  Status: string;
};

export type CreateBizObjectResponse = BizObjectItem;

export type UpdateBizObjectPayload = CreateBizObjectPayload;

export type LinkAttachmentPayload = {
  file_id: string;
  // TODO: change "file_id" to "FileId" PascalCase
};

export type UnlinkAttachmentPayload = {
  file_id: string;
  // TODO: change "file_id" to "FileId" PascalCase
};
