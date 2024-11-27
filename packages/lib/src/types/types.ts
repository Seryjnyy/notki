// TODO : Currently these types are defined in multiple places, the new stores have these types too
// So either one has to go
export type Order = "asc" | "desc"
export type SortBy = "none" | "time" | "size"
export type NoteView = "all" | "single"
export type SearchTarget = "content" | "title" | "all"

export type Note = {
  id: string
  fileName: string
  content: string
  size: number
  lastModified: number
  characterCount: number
  filepath: string
}

// TODO : this will soon be deprecated when app is updated to new www-test stuff
// settings are now stored in separate stores and types are separate
export type NoteSettings = {
  metadata: {
    visible: boolean
    options: {
      size: boolean
      lastModified: boolean
      characterCount: boolean
    }
  }
  header: {
    visible: boolean
    options: {
      title: boolean
      actions: {
        visible: boolean
        options: { remove: boolean; copy: boolean }
      }
    }
  }
  content: { letterSpacing: number; lineHeight: number }
  sort: { sortBy: SortBy; order: Order }
  styling: {
    note: {
      paddingX: number
      paddingBottom: number
      paddingTop: number
      textSelectable: boolean
    }
    list: { columns: number; paddingX: number }
    content: { fontSize: number }
  }
  view: NoteView
}
