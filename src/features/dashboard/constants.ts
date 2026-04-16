export const API = {
  adminDashboardStats: '/AdminDashboardStats',
  attachmentOverview: '/AttachmentOverview',
  attachmentStatsByType: '/AttachmentStatsByType',
  authOverview: '/AuthOverview',
  businessObjectOverview: '/BusinessObjectOverview',
  configOverview: '/ConfigOverview',
  fileConfigList: '/FileConfigList',
  linkOverview: '/LinkOverview',
  recentAuditLogs: '/RecentAuditLogs',
};

export const DEFAULT_DASHBOARD_PARAMS = {
  'sap-client': 324,
} as const;

export const DASHBOARD_QUERY_PARAMS = {
  adminDashboardStats: {
    ...DEFAULT_DASHBOARD_PARAMS,
    $top: 1,
  },
  attachmentOverview: {
    ...DEFAULT_DASHBOARD_PARAMS,
    $top: 1,
  },
  attachmentStatsByType: {
    ...DEFAULT_DASHBOARD_PARAMS,
    $orderby: 'TotalSize desc,VersionCount desc,FileExt asc',
  },
  authOverview: {
    ...DEFAULT_DASHBOARD_PARAMS,
    $top: 1,
  },
  businessObjectOverview: {
    ...DEFAULT_DASHBOARD_PARAMS,
    $top: 1,
  },
  configOverview: {
    ...DEFAULT_DASHBOARD_PARAMS,
    $top: 1,
  },
  fileConfigList: {
    ...DEFAULT_DASHBOARD_PARAMS,
    $orderby: 'IsActive desc,FileExt asc',
  },
  linkOverview: {
    ...DEFAULT_DASHBOARD_PARAMS,
    $top: 1,
  },
  recentAuditLogs: {
    ...DEFAULT_DASHBOARD_PARAMS,
    $top: 8,
    $orderby: 'Erdat desc,Erzet desc',
  },
} as const;
