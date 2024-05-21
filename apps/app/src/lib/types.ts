export type UiState = {
  sidebar: boolean;
  titlebar: boolean;
  section: "note-manager" | "note-viewer";
};

export type Vault = { id: string; path: string; name: string };
