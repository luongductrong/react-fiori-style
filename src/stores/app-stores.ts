import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AppState = {
  viewMode: "table" | "grid";
};

export type AppAction = {
  setViewMode: (_viewMode: AppState["viewMode"]) => void;
};

export type AppStore = AppState & AppAction;

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    viewMode: "table",
    setViewMode: (viewMode) => set({ viewMode }),
  })),
);
