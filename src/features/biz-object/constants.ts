export const API = {
  endpoint: "/BizObject",
  select:
    "BoId,BoType,BoTitle,Status,Erdat,Erzet,Ernam,Aedat,Aezet,Aenam,__EntityControl/Deletable,__EntityControl/Updatable,__OperationControl/link_attachment",
};

export const LINK_ATTACHMENT_API = {
  linkToBo: (fileId: string) => `/Attachment(FileId=${fileId})/SAP__self.link_to_bo?sap-client=324`,
};