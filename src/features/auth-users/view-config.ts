import type { AuthUserItem } from './types';

type AuthUserListFieldKey = keyof Pick<AuthUserItem, 'Uname' | 'Role' | 'Erdat' | 'Ernam'>;

export type AuthUserListFieldOption = {
  id: AuthUserListFieldKey;
  label: string;
};

export const AUTH_USER_LIST_FIELDS = [
  { id: 'Uname', label: 'User Name' },
  { id: 'Role', label: 'Role' },
  { id: 'Erdat', label: 'Created On' },
  { id: 'Ernam', label: 'Created By' },
] as const satisfies readonly AuthUserListFieldOption[];

export type AuthUserListFieldId = (typeof AUTH_USER_LIST_FIELDS)[number]['id'];

export const USER_LIST_SELECTED_FIELD_IDS: AuthUserListFieldId[] = ['Uname', 'Role', 'Erdat', 'Ernam'];
