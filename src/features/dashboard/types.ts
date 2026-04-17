export type DashboardCollection<T> = {
  '@odata.count'?: number;
  value: T[];
};

export type ConfigOverviewItem = {
  OverviewKey: string;
  TotalConfigs: number;
  ActiveConfigs: number;
};

export type BusinessObjectOverviewItem = {
  OverviewKey: string;
  TotalBusinessObjects: number;
};

export type AttachmentOverviewItem = {
  OverviewKey: string;
  TotalAttachments: number;
  ActiveAttachments: number;
  InactiveAttachments: number;
};

export type AdminDashboardStatsItem = {
  OverviewKey: string;
  AttachmentsCreatedDay: number;
  AttachmentsCreatedWeek: number;
  AttachmentsCreatedMonth: number;
  AttachmentsCreatedYear: number;
  BoCreatedDay: number;
  BoCreatedWeek: number;
  BoCreatedMonth: number;
  BoCreatedYear: number;
  LinksCreatedDay: number;
  LinksCreatedWeek: number;
  LinksCreatedMonth: number;
  LinksCreatedYear: number;
  DeletedAttachmentsDay: number;
  DeletedAttachmentsWeek: number;
  DeletedAttachmentsMonth: number;
  DeletedAttachmentsYear: number;
  ReactivatedAttachmentsDay: number;
  ReactivatedAttachmentsWeek: number;
  ReactivatedAttachmentsMonth: number;
  ReactivatedAttachmentsYear: number;
  UnlinkedAttachments: number;
  BoWithoutAttachments: number;
};

export type RecentAuditLogItem = {
  FileId: string;
  Erdat: string;
  Erzet: string;
  Uname: string;
  Action: string;
  Note: string;
  Ernam: string;
};

export type AuthOverviewItem = {
  OverviewKey: string;
  AdminCount: number;
  UserCount: number;
};

export type FileConfigOverviewItem = {
  FileExt: string;
  MimeType: string;
  MaxBytes: number;
  IsActive: boolean;
  Description: string;
};

export type LinkOverviewItem = {
  OverviewKey: string;
  TotalLinks: number;
};

export type AttachmentStatsByTypeItem = {
  FileExt: string;
  VersionCount: number;
  TotalSize: number;
};
