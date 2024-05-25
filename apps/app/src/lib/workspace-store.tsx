import { create } from "zustand";

export type WorkspaceConfig = {
  currentWorkspace: string;
};

interface WorkspaceStore {
  currentWorkspace: string;
  setCurrentWorkspace: (newPath: string) => void;
}

const useWorkspaceConfig = create<WorkspaceStore>()((set) => ({
  currentWorkspace: "",
  setCurrentWorkspace: (newPath) =>
    set(() => {
      return { currentWorkspace: newPath };
    }),
}));

export { useWorkspaceConfig };
