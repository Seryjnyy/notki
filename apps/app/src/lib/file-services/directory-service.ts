import { readDir, readTextFile } from "@tauri-apps/api/fs";
import { getMetadataForFileEntry } from "./file-service";

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

export const getTxtFilesWithAllDetail = async (
    folderpath: string,
    recursive: boolean
) => {
    let validFiles = await getAllFilesFoldersWithMetadata(
        folderpath,
        recursive
    );

    // Remove folders
    validFiles = validFiles.filter((file) => file.children == undefined);

    // Remove files that don't fit the extension type
    validFiles = validFiles.filter(
        (file) => file.name!.substring(file.name!.lastIndexOf(".") + 1) == "txt"
    );

    const res = [];

    // Fetch text for each file
    for (const file of validFiles) {
        const content = await readTextFile(file.path);
        res.push({ ...file, content: content });
    }

    return res;
};
