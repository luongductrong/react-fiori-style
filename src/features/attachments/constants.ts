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
  rollbackVersion: (fileId: string) => `/Attachments(${fileId})?sap-client=324`,
};
