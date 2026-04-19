export const API = {
  endpoint: '/AttachmentConfigurations',
};

export const MUTATION_API = {
  create: '/AttachmentConfigurations',
  update: (fileExt: string) => `/AttachmentConfigurations(FileExt='${fileExt}')`,
  enable: (fileExt: string) =>
    `/AttachmentConfigurations(FileExt='${fileExt}')/com.sap.gateway.srvd.zsd_att_cfg.v0001.enable`,
  disable: (fileExt: string) =>
    `/AttachmentConfigurations(FileExt='${fileExt}')/com.sap.gateway.srvd.zsd_att_cfg.v0001.disable`,
};
