import { invoke } from "@tauri-apps/api";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import { FileEntryWithMetadata, getMetadataForFileEntry } from "./file-service";

export const getAllFilesFolders = async (
    folderPath: string,
    recursive: boolean
) => {
    const entries = await readDir(folderPath, {
        recursive: recursive,
    });

    return entries;
};

export const getAllFilesFoldersWithMetadata = async (
    folderPath: string,
    recursive: boolean
) => {
    const entries = await getAllFilesFolders(folderPath, recursive);

    const temp = [];
    for (const entry of entries) {
        temp.push(await getMetadataForFileEntry(entry));
    }

    return temp;
};

// new
export const getTxtFilesWithAllDetail = async (
    folderpath: string,
    recursive: boolean
) => {
    let validFiles: FileEntryWithMetadata[] =
        await getAllFilesFoldersWithMetadata(folderpath, recursive);

    const txtFiles: (FileEntryWithMetadata & { content: string })[] = [];

    const processEntries = async (entries: FileEntryWithMetadata[]) => {
        for (const entry of entries) {
            if (
                entry.metadata.isFile &&
                entry.name &&
                entry.name.endsWith(".txt")
            ) {
                const content = await readTextFile(entry.path);
                txtFiles.push({ ...entry, content });
            }
            if (entry.metadata.isDir && recursive && entry.children) {
                await processEntries(entry.children);
            }
        }
    };

    await processEntries(validFiles);

    return txtFiles;
};

export const showInFileExplorer = (path: string) => {
    invoke("show_in_explorer", { path });
};
