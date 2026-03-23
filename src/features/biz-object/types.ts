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
  SAP__Messages: Array<{
    code: string;
    message: string;
    target?: string;
  }>;
  "#com.sap.gateway.srvd.zui_bizobj_srv.v0001.link_attachment(file_id)": Record<string, never>;
};

export type BizObjectListResponse = {
  "@odata.context": string;
  "@odata.metadataEtag"?: string;
  value: BizObjectItem[];
};

export type BizObjectListParams = {
  "sap-client": number;
  $count?: boolean;
  $select?: string;
  $skip?: number;
  $top?: number;
  $filter?: string;
  $orderby?: string;
};

export type CreateBizObjectPayload = {
  BoType: string;
  BoTitle: string;
  Status: string;
};

export type CreateBizObjectResponse = BizObjectItem;

export type UpdateBizObjectPayload = {
  BoType: string;
  BoTitle: string;
  Status: string;
};

export type DeleteBizObjectResponse = unknown;