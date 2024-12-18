import { Button } from "@repo/ui/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { useToast } from "@repo/ui/hooks/use-toast";
import { ReactNode, useRef } from "react";
import { FONT_OPTIONS, useStyleStore } from "@repo/lib/stores/style-store";
import { MyFonts } from "./my-fonts";

const Content = () => {
    const { toast, dismiss } = useToast();

    const userFonts = useStyleStore.use.userFonts();
    const setUserFonts = useStyleStore.use.setUserFonts();

    const inputRef = useRef<HTMLInputElement>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const userFontsCopy = [...userFonts];
        const inputValue = inputRef.current?.value || "";
        if (!inputValue) return;

        const trueFontInput: string[] = [];
        const fonts = inputValue
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((s) => {
                trueFontInput.push(s);
                const fontAlreadyAdded = [
                    ...FONT_OPTIONS,
                    ...userFontsCopy,
                ].some((i) => i.toLowerCase() === s.toLowerCase());

                if (!fontAlreadyAdded) {
                    userFontsCopy.push(s);
                    return s;
                }
            })
            .filter(Boolean) as string[];

        setUserFonts(userFontsCopy);

        if (inputRef.current) {
            inputRef.current.value = "";
        }

        if (!fonts.length) {
            toast({
                title: "Failed to add Fonts",
                description: " Fonts already exist or the input was invalid.",
            });
            return;
        }

        let toastTitle;
        if (fonts.length != trueFontInput.length) {
            toastTitle = "Some Fonts added";
        } else {
            toastTitle = `${fonts.length > 1 ? "Fonts" : "Font"} Added`;
        }
        const toastDescription =
            fonts.length === 1
                ? `${fonts[0]} was added.`
                : `${fonts.map((s) => s.trim()).join(", ")} were added.`;

        toast({
            title: toastTitle,
            description: toastDescription,
            action: (
                <Button
                    onClick={() => {
                        dismiss();
                    }}
                >
                    Undo
                </Button>
            ),
        });
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <MyFonts />
            <DialogHeader>
                <DialogTitle>Add new Font</DialogTitle>
                <DialogDescription>
                    Type the name of the font and make sure you have that font
                    installed on your computer.
                    <br />
                    <br />
                    You can add multiple fonts at once by comma separating them.
                </DialogDescription>
            </DialogHeader>
            <form action="submit" id="font-form" onSubmit={handleSubmit}>
                <Input
                    className="z-10 border border-border bg-muted"
                    ref={inputRef}
                    form="font-form"
                    id="font-input"
                    placeholder="Roboto Mono, Poppins"
                />
                <Button type="submit" className="float-right mt-6">
                    Add Fonts
                </Button>
            </form>
        </DialogContent>
    );
};

const Trigger = ({ children }: { children: ReactNode }) => (
    <DialogTrigger asChild>{children}</DialogTrigger>
);

export const AddFontModal = { Content, Trigger };
