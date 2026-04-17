export const API = {
  endpoint: '/Attachments',
  select:
    'CurrentVersion,Erdat,Ernam,FileId,IsActive,Title,__EntityControl/Deletable,__EntityControl/Updatable,__OperationControl/Reactivate',
  detailExpand: '_CurrentVersion($select=FileContent,FileId,FileName,FileExtension,MimeType,VersionNo)',
  versionDetailSelect: 'Erdat,Ernam,Erzet,FileContent,FileExtension,FileId,FileName,FileSize,MimeType,VersionNo',
  versionsEndpoint: (fileId: string) => `/Attachments(${fileId})/_Versions`,
  versionDetailEndpoint: (fileId: string, versionNo: string) =>
    `/Attachments(${fileId})/_Versions(FileId=${fileId},VersionNo='${versionNo}')`,
  auditEndpoint: (fileId: string) => `/Attachments(${fileId})/_Audit`,
  attachmentTitleEndpoint: (fileId: string) => `/Attachments(${fileId})/Title`,
  attachmentCurrentVersionEndpoint: (fileId: string) => `/Attachments(${fileId})/CurrentVersion`,
  linkBoEndpoint: (fileId: string) => `/Attachments(FileId=${fileId})/_Links`,
};

export const MUTATION_API = {
  deleteAttachment: (fileId: string) => `/Attachments(FileId=${fileId})?sap-client=324`,
  restoreAttachment: (fileId: string) =>
    `/Attachments(FileId=${fileId})/com.sap.gateway.srvd.zui_attach_srv.v0001.Reactivate?sap-client=324`,
  rollbackVersion: (fileId: string) => `/Attachments(${fileId})?sap-client=324`,
  updateAttachmentTitle: (fileId: string) => `/Attachments(${fileId})?sap-client=324`,
  createAttachment: '/Attachments?sap-client=324',
  uploadVersion: '/AttachmentVersions?sap-client=324',
  linkBo: () => `/BizObjectAttachmentLink?sap-client=324`,
  unlinkBo: (boId: string, fileId: string) => `/BizObjectAttachmentLink(BoId=${boId},FileId=${fileId})?sap-client=324`,
};
