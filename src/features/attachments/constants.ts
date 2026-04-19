export const API = {
  endpoint: '/Attachments',
  select:
    'CurrentVersion,Erdat,Erzet,Ernam,FileId,IsActive,Title,__EntityControl/Deletable,__EntityControl/Updatable,__OperationControl/Reactivate',
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
  deleteAttachment: (fileId: string) => `/Attachments(FileId=${fileId})`,
  restoreAttachment: (fileId: string) =>
    `/Attachments(FileId=${fileId})/com.sap.gateway.srvd.zsd_attach.v0001.Reactivate`,
  rollbackVersion: (fileId: string) => `/Attachments(${fileId})`,
  updateAttachmentTitle: (fileId: string) => `/Attachments(${fileId})`,
  createAttachment: '/Attachments',
  uploadVersion: '/AttachmentVersions',
  linkBo: () => `/BusinessObjectAttachmentLinks`,
  unlinkBo: (boId: string, fileId: string) => `/BusinessObjectAttachmentLinks(BoId=${boId},FileId=${fileId})`,
};
