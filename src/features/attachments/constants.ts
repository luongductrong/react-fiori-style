export const API = {
  endpoint: '/Attachments',
  detailExpand: '_CurrentVersion',
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

export const QUERY_KEYS = {
  attachmentList: () => ['attachments', 'list'],
  attachmentListWithParams: (params: unknown) => ['attachments', 'list', params],
  attachmentDetail: (fileId: string) => ['attachments', fileId, 'detail'],
  attachmentDetailWithParams: (fileId: string, params: unknown) => ['attachments', fileId, 'detail', params],
  attachmentVersions: (fileId: string) => ['attachments', fileId, 'versions'],
  attachmentVersionsWithParams: (fileId: string, params: unknown) => ['attachments', fileId, 'versions', params],
  attachmentAudit: (fileId: string) => ['attachments', fileId, 'audit'],
  attachmentAuditWithParams: (fileId: string, params: unknown) => ['attachments', fileId, 'audit', params],
  // prettier-ignore
  attachmentVersionDetail: (fileId: string, versionNo: string) => ['attachments', fileId, 'versions', versionNo, 'detail'],
  attachmentTitle: (fileId: string) => ['attachments', fileId, 'title'],
  attachmentCurrentVersion: (fileId: string) => ['attachments', fileId, 'current-version'],
  attachmentBoLinks: (fileId: string) => ['attachments', fileId, 'biz-objects'],
  attachmentBoLinksWithParams: (fileId: string, params: unknown) => ['attachments', fileId, 'biz-objects', params],
};
