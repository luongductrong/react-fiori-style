export type CurrentUser = {
  value: {
    Uname: string;
    Role: string;
  }[];
};

export type AuthUserItem = {
  Uname: string;
  Role: string;
  Erdat: string | null;
  Ernam: string;
  __EntityControl: {
    Deletable: boolean;
    Updatable: boolean;
  };
};

export type AuthUserListResponse = {
  '@odata.count'?: string;
  value: AuthUserItem[];
};

export type AuthUserListParams = {
  'sap-client': number;
  $count?: boolean;
  $select?: string;
  $skip?: number;
  $top?: number;
  $filter?: string;
  $orderby?: string;
};

export type CreateAuthUserPayload = {
  Uname: string;
  Role: string;
};

export type CreateAuthUserResponse = AuthUserItem;

export type UpdateAuthUserPayload = {
  Role: string;
};

export type UpdateAuthUserResponse = AuthUserItem;

export type DeleteAuthUserResponse = unknown;
