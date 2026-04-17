export { ODATA_BASE_URL } from '@/app-env';

export const DEFAULT_VIEW_MODE: 'table' | 'grid' = 'table';

export const ODATA_SERVICE = {
  ATTACHMENT: '/sap/opu/odata4/sap/zui_attach_bind/srvd/sap/zui_attach_srv/0001',
  AUTH: '/sap/opu/odata4/sap/zui_att_auth_bind/srvd/sap/zui_att_auth_srv/0001',
  BIZ: '/sap/opu/odata4/sap/zui_bizobj_bind/srvd/sap/zui_bizobj_srv/0001',
  CONFIG_FILE: '/sap/opu/odata4/sap/zui_att_cfg_ui/srvd/sap/zui_att_cfg/0001',
  DASHBOARD: '/sap/opu/odata4/sap/zui_att_admin_dash/srvd/sap/zui_att_admin_dash/0001',
};

export const ODATA_PUBLIC_SERVICE = {
  LOG_OUT_ACTION: '/sap/public/bc/icf/logoff',
  USER: "/sap/opu/odata/sap/ESH_SEARCH_SRV/Users('<current>')",
  SAP_CLIENT: '324',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB = 10,485,760 bytes

export const MIME_BY_EXTENSION = {
  pdf: ['application/pdf'],
  doc: ['application/msword', 'application/vnd.ms-word', 'application/doc'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  xls: ['application/vnd.ms-excel', 'application/msexcel', 'application/x-msexcel'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ppt: ['application/vnd.ms-powerpoint', 'application/mspowerpoint'],
  pptx: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  csv: ['text/csv', 'application/csv', 'text/plain', 'application/vnd.ms-excel'],
  xml: ['text/xml', 'application/xml', 'application/xhtml+xml'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  gif: ['image/gif'],
  txt: ['text/plain', 'text/x-text'],
  json: ['application/json'],
} as const; // 15 extensions

// ['pdf', 'doc', 'docx', 'xls']...
export const EXTENSIONS = Object.keys(MIME_BY_EXTENSION) as (keyof typeof MIME_BY_EXTENSION)[];

// ['application/pdf', 'application/msword', 'application/vnd.ms-word']...
export const MIME_TYPES = Object.values(MIME_BY_EXTENSION).flat();

export const FALLBACK_MIME_TYPE = 'application/octet-stream' as const;

export const FALLBACK_EXTENSION = 'bin' as const;

export const MIME_TYPE_SEPARATOR = ';' as const;

export const EXTENSION_GROUPS = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif'],
  DOCUMENT: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'json', 'xml', 'csv'],
} as const satisfies Record<'IMAGE' | 'DOCUMENT', readonly Extension[]>; // 2 groups, 15 extensions

type Extension = (typeof EXTENSIONS)[number];
type MimeType = (typeof MIME_TYPES)[number];

// TODO: Double check the white list of extensions and mime types with backend,
// implement the logic to get the white list from backend and use it in the frontend

export const GOOGLE_WORKSPACE_EXPORTS = {
  'application/vnd.google-apps.document': {
    extension: 'docx',
    exportMimeType: MIME_BY_EXTENSION.docx[0],
  },
  'application/vnd.google-apps.spreadsheet': {
    extension: 'xlsx',
    exportMimeType: MIME_BY_EXTENSION.xlsx[0],
  },
  'application/vnd.google-apps.presentation': {
    extension: 'pptx',
    exportMimeType: MIME_BY_EXTENSION.pptx[0],
  },
  'application/vnd.google-apps.drawing': {
    extension: 'pdf',
    exportMimeType: MIME_BY_EXTENSION.pdf[0],
  },
} as const;

type GoogleWorkspaceMimeType = keyof typeof GOOGLE_WORKSPACE_EXPORTS;

export type { Extension, MimeType, GoogleWorkspaceMimeType };
