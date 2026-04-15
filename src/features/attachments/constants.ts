export const API = {
  endpoint: '/Attachments',
  select: 'CurrentVersion,Erdat,Ernam,FileId,IsActive,Title,__EntityControl/Deletable,__EntityControl/Updatable',
  detailSelect:
    'Aedat,Aenam,Aezet,CurrentVersion,EditLock,Erdat,Ernam,Erzet,FileId,IsActive,Title,__EntityControl/Deletable,__EntityControl/Updatable',
  detailExpand: '_CurrentVersion($select=FileContent,FileId,FileName,FileExtension,MimeType,VersionNo)',
  versionDetailSelect: 'Erdat,Ernam,Erzet,FileContent,FileExtension,FileId,FileName,FileSize,MimeType,VersionNo',
  versionsEndpoint: (fileId: string) => `/Attachments(${fileId})/_Versions`,
  versionDetailEndpoint: (fileId: string, versionNo: string) =>
    `/Attachments(${fileId})/_Versions(FileId=${fileId},VersionNo='${versionNo}')`,
  auditEndpoint: (fileId: string) => `/Attachments(${fileId})/_Audit`,
  attachmentTitleEndpoint: (fileId: string) => `/Attachments(${fileId})/Title`,
  attachmentCurrentVersionEndpoint: (fileId: string) => `/Attachments(${fileId})/CurrentVersion`,
};

export const MUTATION_API = {
  deleteAttachment: (fileId: string) => `/Attachments(FileId=${fileId})?sap-client=324`,
  rollbackVersion: (fileId: string) => `/Attachments(${fileId})?sap-client=324`,
  updateAttachmentTitle: (fileId: string) => `/Attachments(${fileId})?sap-client=324`,
  createAttachment: '/Attachments?sap-client=324',
  uploadVersion: '/AttachmentVersions?sap-client=324',
};
