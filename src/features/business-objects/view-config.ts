import type { BizObjectItem } from './types';

type BoListFieldKey = keyof Pick<
  BizObjectItem,
  'BoId' | 'BoTitle' | 'BoType' | 'Status' | 'Erdat' | 'Erzet' | 'Ernam' | 'Aedat' | 'Aezet' | 'Aenam'
>;

export type BoListFieldOption = {
  id: BoListFieldKey;
  label: string;
};

export const BO_LIST_FIELDS = [
  { id: 'BoId', label: 'ID' },
  { id: 'BoTitle', label: 'Title' },
  { id: 'BoType', label: 'Type' },
  { id: 'Status', label: 'Status' },
  { id: 'Erdat', label: 'Created On' },
  { id: 'Erzet', label: 'Created At' },
  { id: 'Ernam', label: 'Created By' },
  { id: 'Aedat', label: 'Changed On' },
  { id: 'Aezet', label: 'Changed At' },
  { id: 'Aenam', label: 'Changed By' },
] as const satisfies readonly BoListFieldOption[];

export type BoListFieldId = (typeof BO_LIST_FIELDS)[number]['id'];

export const BO_LIST_SELECTED_FIELD_IDS: BoListFieldId[] = ['BoId', 'BoTitle', 'BoType', 'Status', 'Erdat', 'Ernam'];
