export const API = {
  endpoint: '/BizObject',
  linkAttachmentEndpoint: (boId: string) => `/BizObject(BoId=${boId})/_Links`,
  select:
    'BoId,BoType,BoTitle,Status,Erdat,Erzet,Ernam,Aedat,Aezet,Aenam,__EntityControl/Deletable,__EntityControl/Updatable,__OperationControl/link_attachment',
};

export const MUTATION_API = {
  linkAttachment: (boId: string) =>
    `/BizObject(BoId=${boId})/com.sap.gateway.srvd.zui_bizobj_srv.v0001.link_attachment?sap-client=324`,
  // TODO: change "link_attachment" to PascalCase "LinkAttachment"
  unlinkAttachment: (boId: string, fileId: string) =>
    `/BizObjectAttachmentLink(BoId=${boId},FileId=${fileId})?sap-client=324`,
};

export const BO_TYPES = ['PORDER', 'SORDER', 'INVOICE'] as const;
export const BO_STATUS = ['NEW', 'INPR', 'COMP'] as const;

export type BoType = (typeof BO_TYPES)[number];
export type BoStatus = (typeof BO_STATUS)[number];
