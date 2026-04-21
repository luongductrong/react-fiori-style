import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BO_LIST_SELECTED_FIELD_IDS, type BoListFieldId } from '@/features/business-objects/view-config';
import { USER_LIST_SELECTED_FIELD_IDS, type AuthUserListFieldId } from '@/features/auth-users/view-config';
import { ATT_LIST_SELECTED_FIELD_IDS, type AttachmentListFieldId } from '@/features/attachments/view-config';

export type ViewPreferencesState = {
  attachmentListVisibleFieldIds: AttachmentListFieldId[];
  boListVisibleFieldIds: BoListFieldId[];
  authUserListVisibleFieldIds: AuthUserListFieldId[];
};

export type ViewPreferencesAction = {
  setAttachmentListVisibleFieldIds: (fieldIds: AttachmentListFieldId[]) => void;
  resetAttachmentListVisibleFieldIds: () => void;
  setBoListVisibleFieldIds: (fieldIds: BoListFieldId[]) => void;
  resetBoListVisibleFieldIds: () => void;
  setAuthUserListVisibleFieldIds: (fieldIds: AuthUserListFieldId[]) => void;
  resetAuthUserListVisibleFieldIds: () => void;
};

export type ViewStore = ViewPreferencesState & ViewPreferencesAction;

export const useViewStore = create<ViewStore>()(
  devtools((set) => ({
    attachmentListVisibleFieldIds: ATT_LIST_SELECTED_FIELD_IDS,
    boListVisibleFieldIds: BO_LIST_SELECTED_FIELD_IDS,
    authUserListVisibleFieldIds: USER_LIST_SELECTED_FIELD_IDS,
    setAttachmentListVisibleFieldIds: (attachmentListVisibleFieldIds) => set({ attachmentListVisibleFieldIds }),
    resetAttachmentListVisibleFieldIds: () =>
      set({
        attachmentListVisibleFieldIds: ATT_LIST_SELECTED_FIELD_IDS,
      }),
    setBoListVisibleFieldIds: (boListVisibleFieldIds) => set({ boListVisibleFieldIds }),
    resetBoListVisibleFieldIds: () =>
      set({
        boListVisibleFieldIds: BO_LIST_SELECTED_FIELD_IDS,
      }),
    setAuthUserListVisibleFieldIds: (authUserListVisibleFieldIds) => set({ authUserListVisibleFieldIds }),
    resetAuthUserListVisibleFieldIds: () =>
      set({
        authUserListVisibleFieldIds: USER_LIST_SELECTED_FIELD_IDS,
      }),
  })),
);
