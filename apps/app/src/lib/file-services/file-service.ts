import { guidGenerator } from "@repo/lib/utils/metadata-utils";
import {
    FileEntry,
    createDir,
    exists,
    readTextFile,
    removeFile,
    writeFile,
    writeTextFile,
} from "@tauri-apps/api/fs";
import { Metadata, metadata } from "tauri-plugin-fs-extra-api";
import { generateFileID } from "../file";
import { getAllFilesFolders } from "./directory-service";

export interface FileEntryWithMetadata {
    id: string;
    metadata: Metadata;
    path: string;
    name?: string | undefined;
    children?: FileEntryWithMetadata[] | undefined;
}

export const getFileContent = async (filepath: string) => {
    const res = await readTextFile(filepath);

    return res;
};

export const getMetadataForFileEntry = async (
    file: FileEntry
): Promise<FileEntryWithMetadata> => {
    const meta = await metadata(file.path);
    const childrenWithMeta = [];
    if (file.children) {
        for (const child of file.children) {
            const metaForChild = await getMetadataForFileEntry(child);
            childrenWithMeta.push(metaForChild);
        }
    }

    const fileChildren = file.children ? childrenWithMeta : file.children;
    return {
        ...file,
        children: fileChildren,
        metadata: meta,
        id: await generateFileID(file.path),
    };
};

// TODO : can metadata() fail?
export const getMetadataForFile = async (filepath: string) => {
    return await metadata(filepath);
};

// TODO : Only for folders, not sure if need to specify
// export const getFileWithMetadata = async (filepath: string) => {
// const metadata = await getMetadataForFile(filepath);
// const split = filepath.split("\\");
// const name = split.length > 0 ? split[split.length - 1] : "unknown";
// return {
//   name: name,
//   path: filepath,
//   children: undefined,
//   metadata: metadata,
// };
// };

// TODO : This is awful :/ but im tired
// TODO : maybe should tell the user they can't create file with the same name as something else
export const newFile = async (
    basepath: string,
    filename: string = "Untitled"
) => {
    const files = await getAllFilesFolders(basepath, false);

    // filter out folders
    // filter for files named "Untitled" in the same folder
    // Checking filepath because name doesn't add subfolder to the name
    const defaultFilepath = `${basepath}\\${filename}`;
    const untitledFiles = files
        .filter((file) => file.children == undefined)
        .filter((file) => {
            return file.path?.includes(defaultFilepath);
        });

    // Get length of file extension + "."
    // Get string between file name and the extension, so the suffix to untitled/new folder
    const suffixes = untitledFiles.map((file) => {
        const extLen = file.name!.length - file.name!.lastIndexOf(".");
        return file.name!.substring(
            filename.length,
            file.name!.length - extLen
        );
    });

    // search through found suffixes, check for availability of 1 2 3 4 5 ...
    let foundValid: string | null = null;

    // If doesn't include "", then Untitled.txt is available so use that
    if (!suffixes.includes("")) foundValid = "";

    // If not Untitled files then use no prefix
    if (suffixes.length == 0) {
        foundValid = "";
    } else {
        // check from 1 to n + 1, check each file to see if exists already, if not then use that as prefix
        let valid = null;
        for (let i = 1; i < suffixes.length + 2; i++) {
            const iAsString = i.toString();
            for (const prefix of suffixes) {
                if (prefix == iAsString) {
                    valid = null;
                    break;
                }

                valid = iAsString;
            }
            if (valid) {
                foundValid = valid;
                break;
            }
        }
    }

    // Need this for when Untitled exists, without it will go straight to random
    if (foundValid == "" && untitledFiles.length == 1) {
        foundValid = "1";
    }

    // If couldn't find a suitable prefix then just randomise it instead of wasting more time
    // This shouldn't happen right??
    if (foundValid == null) foundValid = guidGenerator();

    // Last check, just to make sure we don't overwrite a file
    while (await exists(`${basepath}\\${filename}${foundValid}.txt`)) {
        foundValid = guidGenerator();
    }

    const filepath = `${basepath}\\${filename}${foundValid}.txt`;
    await writeTextFile(filepath, "");

    return [`${filename}${foundValid}.txt`, filepath];
};

// TODO : duplicate code with newFile
export const newDir = async (
    basepath: string,
    filename: string = "New folder"
) => {
    const files = await getAllFilesFolders(basepath, false);

    // filter out files
    // filter for folders named "New folder" in the same folder
    // Checking filepath because name doesn't add subfolder to the name
    const defaultFilepath = `${basepath}\\${filename}`;
    const untitledFiles = files
        .filter((file) => file.children != undefined)
        .filter((file) => {
            return file.path?.includes(defaultFilepath);
        });

    // Get length of file extension + "."
    // Get string between file name and the extension, so the suffix to untitled/new folder
    const suffixes = untitledFiles.map((file) => {
        return file.name!.substring(filename.length);
    });

    // search through found suffixes, check for availability of 1 2 3 4 5 ...
    let foundValid: string | null = null;

    // If doesn't include "", then Untitled.txt is available so use that
    if (!suffixes.includes("")) foundValid = "";

    // If not Untitled files then use no prefix
    if (suffixes.length == 0) {
        foundValid = "";
    } else {
        // check from 1 to n + 1, check each file to see if exists already, if not then use that as prefix
        let valid = null;
        for (let i = 1; i < suffixes.length + 2; i++) {
            const iAsString = i.toString();
            for (const prefix of suffixes) {
                if (prefix == iAsString) {
                    valid = null;
                    break;
                }

                valid = iAsString;
            }
            if (valid) {
                foundValid = valid;
                break;
            }
        }
    }

    // Need this for when Untitled exists, without it will go straight to random
    if (foundValid == "" && untitledFiles.length == 1) {
        foundValid = "1";
    }

    // If couldn't find a suitable prefix then just randomise it instead of wasting more time
    // This shouldn't happen right??
    if (foundValid == null) foundValid = guidGenerator();

    // Last check, just to make sure we don't overwrite a file
    while (await exists(`${basepath}\\${filename}${foundValid}`)) {
        foundValid = guidGenerator();
    }

    const filepath = `${basepath}\\${filename}${foundValid}`;
    await createDir(filepath);

    return [`${filename}${foundValid}`, filepath];
};

export const deleteFile = async (filepath: string) => {
    return await removeFile(filepath);
};

export const saveFile = (filepath: string, content: string) => {
    writeFile(filepath, content);
};

export const readTextFileContent = async (filepath: string) => {
    return await readTextFile(filepath);
};
