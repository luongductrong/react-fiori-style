export const API = {
  endpoint: '/AttCfg',
};

export const MUTATION_API = {
  create: '/AttCfg?sap-client=324',
  update: (fileExt: string) => `/AttCfg(FileExt='${fileExt}')?sap-client=324`,
  enable: (fileExt: string) =>
    `/AttCfg(FileExt='${fileExt}')/com.sap.gateway.srvd.zui_att_cfg.v0001.enable?sap-client=324`,
  disable: (fileExt: string) =>
    `/AttCfg(FileExt='${fileExt}')/com.sap.gateway.srvd.zui_att_cfg.v0001.disable?sap-client=324`,
};
