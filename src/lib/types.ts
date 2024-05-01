export type Order = "asc" | "desc";
export type SortBy = "none" | "time";
export type LetterSpacing = "tighter" | "tight" | "normal" | "wide" | "wider";
export type LineHeight = "tight" | "snug" | "normal" | "relaxed" | "loose";

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
  titles: boolean;
  metadata: {
    visible: boolean;
    options: { size: boolean; lastModified: boolean; characterCount: boolean };
  };
  actions: { visible: boolean; options: { remove: boolean; copy: boolean } };
  content: { letterSpacing: LetterSpacing; lineHeight: LineHeight };
  sort: { sortBy: SortBy; order: Order };
};
