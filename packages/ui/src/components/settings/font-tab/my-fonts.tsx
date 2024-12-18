import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/components/ui/button";
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { useToast } from "@repo/ui/hooks/use-toast";
import { useCallback } from "react";
import { cn, generateFontCss } from "@repo/ui/lib/utils";
import { useStyleStore } from "@repo/lib/stores/style-store";

export const MyFonts = () => {
    const { toast, dismiss } = useToast();
    const userFonts = useStyleStore.use.userFonts();
    const setUserFonts = useStyleStore.use.setUserFonts();

    const setCurrentFont = useStyleStore.use.setFont();
    const currentFont = useStyleStore.use.font();

    const handleRemoveFont = useCallback(
        (font: string) => {
            const newUserFonts = new Set(userFonts);
            newUserFonts.delete(font);
            setUserFonts([...newUserFonts]);

            toast({
                title: "Font removed",
                description: `${font} was removed`,
                action: (
                    <Button
                        onClick={() => {
                            setUserFonts(userFonts);
                            setCurrentFont(currentFont);
                            dismiss();
                        }}
                    >
                        Undo
                    </Button>
                ),
            });
        },
        [userFonts, currentFont]
    );

    if (!userFonts.length) return null;

    return (
        <DialogHeader>
            <DialogTitle>My Fonts</DialogTitle>
            <DialogDescription className="flex flex-wrap gap-2 pb-4 pt-2">
                {userFonts.map((font, i) => (
                    <Button
                        key={i}
                        variant="secondary"
                        style={{
                            fontFamily: generateFontCss(font),
                        }}
                        onClick={() => setCurrentFont(font)}
                        className={cn(
                            "flex h-fit w-fit items-center justify-between gap-4 rounded-md px-2 py-1 text-foreground/80 outline outline-1 outline-foreground/20 hover:bg-foreground/20 hover:text-foreground hover:outline-foreground",
                            font == currentFont &&
                                "bg-primary/20 text-foreground outline-2 outline-primary"
                        )}
                    >
                        {font}
                        <Button
                            asChild
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFont(font);
                            }}
                            className="h-5 w-5 rounded-full p-[2px] text-xs hover:bg-background/40"
                            size="icon"
                            variant="ghost"
                        >
                            <Cross2Icon />
                        </Button>
                    </Button>
                ))}
            </DialogDescription>
        </DialogHeader>
    );
};
