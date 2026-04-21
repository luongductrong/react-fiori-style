import type { AttachmentItem } from './types';

type AttachmentListFieldKey = keyof Pick<
  AttachmentItem,
  'FileId' | 'Title' | 'CurrentVersion' | 'Erdat' | 'Erzet' | 'Ernam' | 'Aedat' | 'Aezet' | 'Aenam' | 'EditLock'
>;

export type AttachmentListFieldOption = {
  id: AttachmentListFieldKey;
  label: string;
};

export const ATTACHMENT_LIST_FIELDS = [
  { id: 'FileId', label: 'File ID' },
  { id: 'Title', label: 'Title' },
  { id: 'CurrentVersion', label: 'Version' },
  { id: 'Erdat', label: 'Created On' },
  { id: 'Erzet', label: 'Created At' },
  { id: 'Ernam', label: 'Created By' },
  { id: 'Aedat', label: 'Changed On' },
  { id: 'Aezet', label: 'Changed At' },
  { id: 'Aenam', label: 'Changed By' },
  { id: 'EditLock', label: 'Edit Lock' },
] as const satisfies readonly AttachmentListFieldOption[];

export type AttachmentListFieldId = (typeof ATTACHMENT_LIST_FIELDS)[number]['id'];

export const ATT_LIST_SELECTED_FIELD_IDS: AttachmentListFieldId[] = [
  'FileId',
  'Title',
  'CurrentVersion',
  'Erdat',
  'Ernam',
];
