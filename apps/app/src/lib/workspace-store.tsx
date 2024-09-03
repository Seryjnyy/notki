import { create } from "zustand";
import { createSelectors } from "@repo/lib/create-zustand-selectors";
import { Vault } from "./backend-types";

// export type WorkspaceConfig = {
//     currentWorkspace: Vault;
// };

interface WorkspaceStore {
    currentWorkspace: Vault | null;
    setCurrentWorkspace: (val: Vault) => void;
}

const useWorkspaceConfigBase = create<WorkspaceStore>()((set) => ({
    currentWorkspace: null,
    setCurrentWorkspace: (val) =>
        set(() => {
            console.log(val);
            return { currentWorkspace: val };
        }),
}));

const useWorkspaceConfig = createSelectors(useWorkspaceConfigBase);

export { useWorkspaceConfig };
