// TODO : Move to ui-store.tsx
export type UiState = {
    sidebar: boolean;
    sideSection: "none" | "file-explorer";
    titlebar: boolean;
    section: "note-manager" | "note-viewer" | "vault-manager";
    settings: boolean;
};

export type Vault = { id: string; path: string; name: string };
