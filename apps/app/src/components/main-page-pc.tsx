import { useNotes } from "@repo/lib/hooks/use-notes"
import { ThemeSwitcherList } from "@repo/ui/components/theme-switcher-list"
import DropZone from "@repo/ui/components/drop-zone"
import { cn } from "@repo/ui/lib/utils"
import { ErrorBoundary } from "react-error-boundary"

import NoteViewSwitch from "@repo/ui/components/display-notes/note-view-switch"
import SkipToNavLink from "@repo/ui/components/skip-to-nav-link"
import SomethingWentWrong from "@repo/ui/components/something-went-wrong"
import { useSidebar } from "@repo/ui/components/ui/sidebar"
import { NoteListProvider } from "@repo/ui/providers/note-list-provider"
import Recents from "./landing/recents"
import Vaults from "./landing/vaults"
import BottomBar from "@repo/ui/components/navbar/bottom-bar"
import { useAppInfo } from "~/hooks/use-app-info.ts"
import NoteListShortcuts from "@repo/ui/components/display-notes/note-list-shortcuts"

export default function MainPage() {
  const { notes } = useNotes()
  const hasNotes = notes.length > 0
  const { open: isSidebarOpen } = useSidebar()
  const appInfo = useAppInfo()

  return (
    <main className="bg-background h-full overflow-hidden ">
      <header className="pt-4">
        <h1 className="sr-only">notki</h1>
      </header>

      {!hasNotes && (
        <section className="w-[80%] sm:w-[90%] md:w-[100%] lg:w-[90%] xl:w-[80%]  px-4 mx-auto h-full ">
          <h2 className="text-muted-foreground text-center text-sm">
            ADD TXT FILES
          </h2>
          <div
            className={cn(
              " py-2 grid sm:grid-cols-2 md:grid-cols-3 sm:px-0 grid-cols-1  h-[90%] gap-3 "
            )}
          >
            <Vaults />

            <DropZone
              replace
              title={"Add txt files"}
              desc={"Drag 'n' drop or click to select."}
            />

            <Recents />
          </div>

          <div className={"flex justify-between items-center"}>
            <ThemeSwitcherList />
            {appInfo && (
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{appInfo.name}</span>
                <span className={""}>{appInfo.version}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {hasNotes && (
        <section className="w-full h-fit  pt-4 mt-4 ">
          <SkipToNavLink
            className={cn(
              "focus:top-12",
              isSidebarOpen && "focus:left-[18rem]"
            )}
          />
          <h2 className="text-muted-foreground text-center text-sm">
            YOUR NOTES
          </h2>
          <ErrorBoundary fallback={<SomethingWentWrong />}>
            <NoteListProvider>
              <div className="pb-[10rem]">
                <NoteViewSwitch />
              </div>
              <BottomBar variant={"absolute"} />
              <NoteListShortcuts />
            </NoteListProvider>
          </ErrorBoundary>
        </section>
      )}
    </main>
  )
}
