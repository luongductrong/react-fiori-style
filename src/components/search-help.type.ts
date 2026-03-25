import type { SearchHelpKey, SearchHelpSign } from '@/types/common';

export type SearchHelpToken = {
  id: string;
  key: SearchHelpKey;
  text: string;
  sign: SearchHelpSign;
};
