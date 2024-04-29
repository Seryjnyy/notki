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
  lineHeight: "tight" | "snug" | "normal" | "relaxed" | "loose";
};
