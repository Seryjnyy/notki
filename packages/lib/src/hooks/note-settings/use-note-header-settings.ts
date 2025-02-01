import React from "react"
import { useNoteSettings } from "@repo/lib/stores/note-settings-store"

// TODO : I really don't like how this stuff is done anymore, not very extendable
// just pointless duplicate code, and this goes for header, content, and footer
export default function useNoteHeaderSettings() {
  const header = useNoteSettings.use.header()
  const setHeader = useNoteSettings.use.setHeader()
  const resetHeader = useNoteSettings.use.resetHeader()

  const toggleHeader = React.useCallback(() => {
    setHeader({ ...header, header: !header.header })
  }, [header])

  const toggleTitle = React.useCallback(() => {
    setHeader({ ...header, title: !header.title })
  }, [header])

  const toggleRemove = React.useCallback(() => {
    setHeader({ ...header, remove: !header.remove })
  }, [header])

  const toggleCopy = React.useCallback(() => {
    setHeader({ ...header, copy: !header.copy })
  }, [header])

  const toggleTitleSelectable = React.useCallback(() => {
    setHeader({ ...header, titleSelectable: !header.titleSelectable })
  }, [header])

  return {
    header,
    toggleHeader,
    toggleCopy,
    toggleRemove,
    toggleTitle,
    toggleTitleSelectable,
    resetHeader,
  }
}
