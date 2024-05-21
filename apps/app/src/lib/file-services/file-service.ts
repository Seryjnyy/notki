import {
  FileEntry,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { getAllFilesInFolder } from "./directory-service";
import { guidGenerator } from "@repo/lib/metadata-utils";
import { Metadata, metadata } from "tauri-plugin-fs-extra-api";

export interface FileEntryWithMetadata {
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
  return { ...file, children: fileChildren, metadata: meta };
};

// TODO : can metadata() fail?
export const getMetadataForFile = async (filepath: string) => {
  return await metadata(filepath);
};

// TODO : Only for folders, not sure if need to specify
export const getFileWithMetadata = async (filepath: string) => {
  // const metadata = await getMetadataForFile(filepath);
  // const split = filepath.split("\\");
  // const name = split.length > 0 ? split[split.length - 1] : "unknown";
  // return {
  //   name: name,
  //   path: filepath,
  //   children: undefined,
  //   metadata: metadata,
  // };
};

// TODO : This is awful :/ but im tired
export const newFile = async (
  basepath: string,
  filename: string = "Untitled"
) => {
  // TODO : Inefficient I think, fetching the entire directory then checking checking each file
  const files = await getAllFilesInFolder(basepath, false);

  // filter out folders
  // filter for files named "Untitled" in the same folder
  // take only the part after "Untitled"
  const defaultFilepath = `${basepath}\\${filename}`;
  const untitledFiles = files
    .filter((file) => file.children == undefined)
    .filter((file) => {
      return file.path?.includes(defaultFilepath);
    });

  const prefixes = untitledFiles.map((file) =>
    file.name!.substring(8, file.name!.length - 4)
  );

  // search through found prefixes, check for availability 1 2 3 ...
  let foundValid: string | null = null;

  // If doesn't include "" so Untitled.txt then use that
  if (!prefixes.includes("")) foundValid = "";

  // If not Untitled files then use no prefix
  if (prefixes.length == 0) {
    foundValid = "";
  } else {
    // check from 1 to n + 1, check each file to see if exists already, if not then use that as prefix
    let valid = null;
    for (let i = 1; i < prefixes.length + 2; i++) {
      const iAsString = i.toString();
      for (const prefix of prefixes) {
        console.log(prefix, iAsString);
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
  if (foundValid == null) foundValid = guidGenerator();

  // Last check, just to make sure we don't overwrite a file
  while (await exists(`${basepath}\\${filename}${foundValid}.txt`)) {
    foundValid = guidGenerator();
  }

  const filepath = `${basepath}\\${filename}${foundValid}.txt`;
  await writeTextFile(`${basepath}\\${filename}${foundValid}.txt`, "");

  return [`${filename}${foundValid}.txt`, filepath];
};

export const saveFile = (filepath: string, content: string) => {
  writeTextFile(filepath, content);
};
