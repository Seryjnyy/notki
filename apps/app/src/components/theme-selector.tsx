import { Label } from "@repo/ui/label";
import React from "react";
import { themes } from "./themes";
import { Button } from "@repo/ui/button";

// Based on stuff from Shadcn/ui
export default function ThemeSelector() {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme: setMode, resolvedTheme: mode } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <div className="space-y-1.5">
        <Label className="text-xs">Color</Label>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((theme) => {
            const isActive = config.theme === theme.name;

            return mounted ? (
              <Button
                variant={"outline"}
                size="sm"
                key={theme.name}
                onClick={() => {
                  setConfig({
                    ...config,
                    theme: theme.name,
                  });
                }}
                className={cn(
                  "justify-start",
                  isActive && "border-2 border-primary"
                )}
                style={
                  {
                    "--theme-primary": `hsl(${
                      theme?.activeColor[mode === "dark" ? "dark" : "light"]
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
      </div>
    </div>
  );
}
