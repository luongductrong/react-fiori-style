export const API = {
  endpoint: '/Auth',
  currentUserEndpoint: '/CurrentUserRole',
};

export const DEFAULT_AUTH_USER_ROLE = 'ADMIN' as const;

export const QUERY_KEYS = {
  authUserList: () => ['auth-users', 'list'],
  authUserListWithParams: (params: unknown) => ['auth-users', 'list', params],
  currentAuthUser: () => ['auth-users', 'current-user'],
  currentPublicAuthUser: () => ['auth-users', 'current-public-user'],
};
