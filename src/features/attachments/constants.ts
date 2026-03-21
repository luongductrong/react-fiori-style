export const API = {
  endpoint: "/Attachments",
  select:
    "CurrentVersion,Erdat,Ernam,FileId,IsActive,Title,__EntityControl/Deletable,__EntityControl/Updatable",
  versionsEndpoint: (fileId: string) => `/Attachments(${fileId})/_Versions`,
  versionDetailEndpoint: (fileId: string, versionNo: string) =>
    `/Attachments(${fileId})/_Versions(FileId=${fileId},VersionNo='${versionNo}')`,
  auditEndpoint: (fileId: string) => `/Attachments(${fileId})/_Audit`,
  attachmentTitleEndpoint: (fileId: string) => `/Attachments(${fileId})/Title`,
};

export const MUTATION_API = {
  deleteAttachment: (fileId: string) =>
    `/Attachments(FileId=${fileId})?sap-client=324`,
  rollbackVersion: (fileId: string) => `/Attachments(${fileId})?sap-client=324`,
  updateAttachmentTitle: (fileId: string) =>
    `/Attachments(${fileId})?sap-client=324`,
  createAttachment: "/Attachments?sap-client=324",
  uploadVersion: "/AttachmentVersions?sap-client=324",
};
