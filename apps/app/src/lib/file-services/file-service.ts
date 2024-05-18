import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";

export const getFileContent = async (filepath: string) => {
  const res = await readTextFile(filepath);

  return res;
};

export const newFile = async () => {
  await writeTextFile(
    "C:\\Users\\jakub\\Documents\\test\\test-creation-note.txt",
    "nothing so far"
  );
};
