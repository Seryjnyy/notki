import * as React from "react"
import { Clock, Vault } from "lucide-react"

// TODO : Fast refresh only works when a file only exports components. react-refresh/only-export-components

type ViewOption = { value: string; label: string; icon: JSX.Element }

const VIEWS: ViewOption[] = [
  { value: "vaults", label: "Vaults", icon: <Vault /> },
  { value: "recents", label: "Recents", icon: <Clock /> },
] as const
type Views = (typeof VIEWS)[number]["value"]

interface SidebarViewContext {
  currentView: Views
  search: string
  setSearch: (search: string) => void
  availableViews: ViewOption[]
  setCurrentView: (view: Views) => void
}

const SidebarCurrentViewContext =
  React.createContext<SidebarViewContext | null>(null)

export const useSidebarCurrentView = () => {
  const context = React.useContext(SidebarCurrentViewContext)
  if (!context) {
    throw new Error(
      "useSidebarCurrentView must be used within SidebarCurrentViewProvider"
    )
  }
  return context
}

const SidebarCurrentViewProvider = ({
  children,
}: {
  children?: React.ReactNode
}) => {
  const [currentView, setCurrentView] = React.useState<Views>("vaults")
  const [search, setSearch] = React.useState<string>("")

  return (
    <SidebarCurrentViewContext.Provider
      value={{
        currentView,
        setCurrentView,
        availableViews: [...VIEWS],
        search,
        setSearch,
      }}
    >
      {children}
    </SidebarCurrentViewContext.Provider>
  )
}

export default SidebarCurrentViewProvider
