import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AppState = {
  exampleState: string | null;
};

export type AppAction = {
  setExampleState: (_exampleState: AppState["exampleState"]) => void;
};

export type AppStore = AppState & AppAction;

export const useAppStore = create<AppStore>()(
  devtools((set) => ({
    exampleState: null,
    setExampleState: (exampleState) => set({ exampleState }),
  })),
);
