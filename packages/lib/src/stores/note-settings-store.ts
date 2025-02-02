import { createSelectors } from "@repo/lib/utils/create-zustand-selectors"
import { formatLocalStorageKey } from "@repo/lib/utils/local-storage"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// TODO : This whole entire approach is odd and cumbersome
//  So much boilerplate code :/

type Header = {
  header: boolean
  title: boolean
  copy: boolean
  remove: boolean
  titleSelectable: boolean
}

const header: Header = {
  header: true,
  title: true,
  copy: true,
  remove: true,
  titleSelectable: false,
}

type Content = {
  lineHeight: number
  letterSpacing: number
  fontSize: number
  textSelectable: boolean
}

const content: Content = {
  lineHeight: 1.5,
  letterSpacing: 0,
  fontSize: 16,
  textSelectable: true,
}

type Footer = {
  metadata: boolean
  size: boolean
  lastModified: boolean
  characterCount: boolean
}

const footer: Footer = {
  metadata: true,
  size: true,
  lastModified: true,
  characterCount: true,
}

type Padding = {
  paddingX: number
  paddingTop: number
  paddingBottom: number
}

const padding: Padding = {
  paddingX: 24,
  paddingTop: 4,
  paddingBottom: 4,
}

type Style = {
  elevation: number
}

const style: Style = {
  elevation: 80,
}

type State = {
  header: Header
  content: Content
  footer: Footer
  padding: Padding
  style: Style
}

export const defaults = { header, content, footer, padding, style }

interface Actions {
  reset: () => void
  setHeader: (header: Header) => void
  setContent: (content: Content) => void
  setFooter: (footer: Footer) => void
  setPadding: (padding: Padding) => void
  setStyle: (style: Style) => void
  resetHeader: () => void
  resetStyle: () => void
  resetContent: () => void
  resetFooter: () => void
  resetPadding: () => void
}

const useNoteSettingsBase = create<State & Actions>()(
  persist(
    (set) => ({
      ...defaults,
      setHeader: (header) => set({ header }),
      setContent: (content) => set({ content }),
      setFooter: (footer) => set({ footer }),
      setPadding: (padding) => set({ padding }),
      setStyle: (style) => set({ style }),
      reset: () => set(defaults),
      resetHeader: () => set({ header }),
      resetStyle: () => set({ style }),
      resetContent: () => set({ content }),
      resetFooter: () => set({ footer }),
      resetPadding: () => set({ padding }),
    }),
    {
      name: formatLocalStorageKey("note-settings-store"),
      storage: createJSONStorage(() => localStorage),
    }
  )
)

const useNoteSettings = createSelectors(useNoteSettingsBase)

export { useNoteSettings }
