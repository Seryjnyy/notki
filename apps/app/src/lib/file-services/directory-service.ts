import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";
import { Metadata, metadata } from "tauri-plugin-fs-extra-api";

export interface FileEntryWithMetadata {
  metadata: Metadata;
  path: string;
  name?: string | undefined;
  children?: FileEntryWithMetadata[] | undefined;
}
// TODO : This has expensive operations and should cache the values somehow

export const showAllFiles = async () => {
  const entries = await readDir("C:\\Users\\jakub\\Documents\\test", {
    recursive: true,
  });

  processEntries(entries);
};

export const getAllFilesInFolder = async (folderPath: string) => {
  const entries = await readDir(folderPath, {
    recursive: true,
  });

  return entries;
};

const getMetadataForFile = async (
  file: FileEntry
): Promise<FileEntryWithMetadata> => {
  const meta = await metadata(file.path);
  const childrenWithMeta = [];
  if (file.children) {
    for (const child of file.children) {
      const metaForChild = await getMetadataForFile(child);
      childrenWithMeta.push(metaForChild);
    }
  }

  const fileChildren = file.children ? childrenWithMeta : file.children;
  return { ...file, children: fileChildren, metadata: meta };
};

export const getAllFilesInFolderWithMetadata = async (folderPath: string) => {
  const entries = await getAllFilesInFolder(folderPath);

  const temp = [];
  for (const entry of entries) {
    temp.push(await getMetadataForFile(entry));
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
