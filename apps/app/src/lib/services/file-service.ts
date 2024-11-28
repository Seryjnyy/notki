import { FileEntry } from "@tauri-apps/api/fs"
import { Metadata, metadata } from "tauri-plugin-fs-extra-api"
import { generateFileID } from "../file.ts"

export interface FileEntryWithMetadata {
  id: string
  metadata: Metadata
  path: string
  name?: string | undefined
  children?: FileEntryWithMetadata[] | undefined
}

export const getMetadataForFileEntry = async (
  file: FileEntry
): Promise<FileEntryWithMetadata> => {
  const meta = await metadata(file.path)
  const childrenWithMeta = []
  if (file.children) {
    for (const child of file.children) {
      const metaForChild = await getMetadataForFileEntry(child)
      childrenWithMeta.push(metaForChild)
    }
  }

  const fileChildren = file.children ? childrenWithMeta : file.children
  return {
    ...file,
    children: fileChildren,
    metadata: meta,
    id: await generateFileID(file.path),
  }
}
