import { FontFamilyIcon } from "@radix-ui/react-icons";
import {
    LayoutPanelLeft,
    NotebookText,
    PaintbrushIcon,
    Scissors,
} from "lucide-react";
import { AppearanceTab } from "./appearance-tab/appearance-tab";
import { CardTab } from "./card-tab/card-tab";
import { DisplayTab } from "./display-tab/display-tab";
import { FontSelect } from "./font-tab/font-tab";
import ShortcutTab from "./shortcut-tab/shortcut-tab";

export const SETTINGS_TABS = [
    {
        id: "font",
        label: "Font",
        icon: (
            <FontFamilyIcon className="rounded-sm border border-foreground/10" />
        ),
        comp: <FontSelect />,
    },

    {
        id: "appearance",
        label: "Appearance",
        icon: <PaintbrushIcon className="h-4 w-4" />,
        comp: <AppearanceTab />,
    },
    {
        id: "card",
        label: "Card",
        icon: <NotebookText className="h-4 w-4" />,
        comp: <CardTab />,
    },
    {
        id: "display",
        label: "Display",
        icon: <LayoutPanelLeft className="h-4 w-4" />,
        comp: <DisplayTab />,
    },
    {
        id: "shortcuts",
        label: "Shortcuts",
        icon: <Scissors className="h-4 w-4" />,
        comp: <ShortcutTab />,
    },
];
