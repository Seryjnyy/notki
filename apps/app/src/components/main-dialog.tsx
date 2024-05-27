import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog-controlled";
import { useTempUiState } from "~/lib/temp-uistate-store";
import { themes } from "./themes";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import { useEffect, useState } from "react";
import { useConfig } from "./use-config";
import { cn } from "~/lib/utils";
import { useTheme } from "@repo/ui/theme-provider";
import { CheckIcon } from "@radix-ui/react-icons";
import { produce } from "immer";
import { Label } from "@repo/ui/label";
export default function MainDialog() {
  const [mounted, setMounted] = useState(false);
  const tempUiState = useTempUiState((state) => state.tempUiState);
  const setTempUiState = useTempUiState((state) => state.setTempUiState);
  const setTheme = useConfig((state) => state.setTheme);
  const noteFontColour = useConfig((state) => state.noteFontColour);
  const setNoteFontColour = useConfig((state) => state.setNoteFontColour);
  const config = useConfig();
  const themess = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <Dialog open={tempUiState.settingsOpened}>
        <DialogContent className={`${"theme-" + config.theme}`}>
          <DialogHeader>
            <DialogTitle>Theme settings</DialogTitle>
            <DialogClose
              className="bg-red-200"
              onClick={() => {
                console.log("called");
                setTempUiState(
                  produce(tempUiState, (draft) => {
                    draft.settingsOpened = false;
                  })
                );
              }}
            />
            <DialogDescription>
              Select a theme colour and the font colour in notes.
            </DialogDescription>
          </DialogHeader>
          <Label className="text-xs">Colour</Label>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((theme) => {
              const isActive = config.theme === theme.name;

              return mounted ? (
                <Button
                  variant={"outline"}
                  size="sm"
                  key={theme.name}
                  onClick={() => {
                    setTheme(theme.name);
                  }}
                  className={cn(
                    "justify-start",
                    isActive && "border-2 border-primary"
                  )}
                  style={
                    {
                      "--theme-primary": `hsl(${
                        theme?.activeColor[
                          themess.theme === "dark" ? "dark" : "light"
                        ]
                      })`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className={cn(
                      "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
                    )}
                  >
                    {isActive && <CheckIcon className="h-4 w-4 text-white" />}
                  </span>
                  {theme.label}
                </Button>
              ) : (
                <Skeleton className="h-8 w-full" key={theme.name} />
              );
            })}
          </div>

          <Label className="text-xs">Note text colour</Label>
          {mounted ? (
            <div className="space-x-2">
              <Button
                variant={"outline"}
                size="sm"
                onClick={() => {
                  setNoteFontColour("primary");
                }}
                className={cn(
                  "justify-start",
                  noteFontColour == "primary" && "border-2 border-primary"
                )}
              >
                <span
                  className={cn(
                    "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-primary"
                  )}
                >
                  {noteFontColour == "primary" && (
                    <CheckIcon className="h-4 w-4 text-primary-foreground" />
                  )}
                </span>
                {/* {theme.label} */}
                Primary
              </Button>
              <Button
                variant={"outline"}
                size="sm"
                onClick={() => {
                  setNoteFontColour("white/black");
                }}
                className={cn(
                  "justify-start",
                  noteFontColour == "white/black" && "border-2 border-primary"
                )}
              >
                <span
                  className={cn(
                    "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-black dark:bg-white"
                  )}
                >
                  {noteFontColour == "white/black" && (
                    <CheckIcon className="h-4 w-4 dark:text-black text-white" />
                  )}
                </span>
                {/* {theme.label} */}
                White/Black
              </Button>
            </div>
          ) : (
            // <Skeleton className="h-8 w-full" key={theme.name} />
            <></>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
