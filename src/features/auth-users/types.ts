export type CurrentAuthUserItem = {
  Uname: string;
  Role: string;
};

export type CurrentAuthUserResponse = {
  value: CurrentAuthUserItem[];
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

export type AuthUsersResponse = {
  '@odata.count'?: number | string;
  value: AuthUserItem[];
};

export type AuthUsersQueryParams = {
  'sap-client': number;
  $count?: boolean;
  $select?: string;
  $filter?: string;
  $search?: string;
  $orderby?: string;
};

export type CreateAuthUserPayload = {
  Uname: string;
  Role: 'ADMIN';
};

export type CreateAuthUserResponse = AuthUserItem;

export type DeleteAuthUserParams = {
  Uname: string;
};

export type DeleteAuthUserResponse = unknown;
