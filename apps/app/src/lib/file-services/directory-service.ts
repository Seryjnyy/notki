import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";
import { Metadata, metadata } from "tauri-plugin-fs-extra-api";
import { getMetadataForFileEntry } from "./file-service";

// TODO : This has expensive operations and should cache the values somehow

export const showAllFiles = async () => {
  const entries = await readDir("C:\\Users\\jakub\\Documents\\test", {
    recursive: true,
  });

  processEntries(entries);
};

export const getAllFilesInFolder = async (
  folderPath: string,
  recursive: boolean
) => {
  const entries = await readDir(folderPath, {
    recursive: recursive,
  });

  return entries;
};

export const getAllFilesInFolderWithMetadata = async (folderPath: string) => {
  const entries = await getAllFilesInFolder(folderPath, true);

  const temp = [];
  for (const entry of entries) {
    temp.push(await getMetadataForFileEntry(entry));
  }

  return temp;
};

function processEntries(entries: FileEntry[]) {
  for (const entry of entries) {
    console.log(`Entry: ${entry.path}`);
    if (entry.children) {
      processEntries(entry.children);
    }
  }
}
