export type Order = "asc" | "desc";
export type SortBy = "none" | "time" | "size";
export type NoteView = "all" | "single";
export type SearchTarget = "content" | "title" | "all";

export type Note = {
  id: string;
  fileName: string;
  content: string;
  size: number;
  lastModified: number;
  characterCount: number;
};

export type NoteSettings = {
  metadata: {
    visible: boolean;
    options: { size: boolean; lastModified: boolean; characterCount: boolean };
  };
  header: {
    visible: boolean;
    options: {
      title: boolean;
      actions: {
        visible: boolean;
        options: { remove: boolean; copy: boolean };
      };
    };
  };
  content: { letterSpacing: number; lineHeight: number };
  sort: { sortBy: SortBy; order: Order };
  styling: {
    note: { paddingX: number; paddingBottom: number; paddingTop: number };
    list: { columns: number };
    content: { fontSize: number };
  };
  view: NoteView;
};
