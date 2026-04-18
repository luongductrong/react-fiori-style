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
};

export type BizObjectListParams = {
  'sap-client': number;
  $count?: boolean;
  $select?: string;
  $skip?: number;
  $top?: number;
  $filter?: string;
  $search?: string;
  $orderby?: string;
};

export type BizObjectListResponse = {
  '@odata.count': number;
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
  $orderby?: string;
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
  '@odata.count': number;
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
  BoId: string;
  FileId: string;
};

export type UnlinkAttachmentParams = {
  BoId: string;
  FileId: string;
};
