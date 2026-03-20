const IS_PROD = import.meta.env.PROD;

export const ODATA_HOST = IS_PROD ? "https://s40lp1.ucc.cit.tum.de" : "/api";
export const ODATA_SERVICE = {
  ATTACHMENT: `${ODATA_HOST}/sap/opu/odata4/sap/zui_attach_bind/srvd/sap/zui_attach_srv/0001`,
  AUTH: `${ODATA_HOST}/sap/opu/odata4/sap/zui_att_auth_bind/srvd/sap/zui_att_auth_srv/0001`,
  BIZ: `${ODATA_HOST}/sap/opu/odata4/sap/zui_bizobj_bind/srvd/sap/zui_bizobj_srv/0001`,
};
