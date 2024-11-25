import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@repo/ui/components/ui/sidebar";
import { Clock, Vault } from "lucide-react";
import * as React from "react";
import { SearchCurrentViewForm } from "./search-form";
import { CurrentViewSwitcher } from "./view-switcher";

import { ManageVaultsDialogTrigger } from "../vault-manager/manage-vaults-dialog";
import SidebarGroupRecents from "./app-sidebar-group-recents";
import SidebarGroupVaults from "./app-sidebar-group-vaults";
import AppSidebarShortcut from "./app-sidebar-shortcut";
import { OpenFolderDialogTrigger } from "./open-folder-dialog";

type ViewOption = { value: string; label: string; icon: JSX.Element };

const VIEWS: ViewOption[] = [
    { value: "vaults", label: "Vaults", icon: <Vault /> },
    { value: "recents", label: "Recents", icon: <Clock /> },
] as const;
type Views = (typeof VIEWS)[number]["value"];

interface SidebarViewContext {
    currentView: Views;
    search: string;
    setSearch: (search: string) => void;
    availableViews: ViewOption[];
    setCurrentView: (view: Views) => void;
}

const SidebarCurrentViewContext =
    React.createContext<SidebarViewContext | null>(null);

export const useSidebarCurrentView = () => {
    const context = React.useContext(SidebarCurrentViewContext);
    if (!context) {
        throw new Error(
            "useSidebarCurrentView must be used within SidebarCurrentViewProvider"
        );
    }
    return context;
};

const SidebarCurrentViewProvider = ({
    children,
}: {
    children?: React.ReactNode;
}) => {
    const [currentView, setCurrentView] = React.useState<Views>("vaults");
    const [search, setSearch] = React.useState<string>("");

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
    );
};

const CurrentView = () => {
    const { currentView } = useSidebarCurrentView();
    switch (currentView) {
        case "recents":
            return <SidebarGroupRecents />;
        case "vaults":
            return <SidebarGroupVaults />;
        default:
            return null;
    }
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <SidebarCurrentViewProvider>
            <Sidebar {...props}>
                <SidebarHeader>
                    <CurrentViewSwitcher />
                    <SearchCurrentViewForm />
                </SidebarHeader>

                <SidebarContent>
                    <CurrentView />
                </SidebarContent>

                <SidebarFooter>
                    <OpenFolderDialogTrigger />
                    <ManageVaultsDialogTrigger />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <AppSidebarShortcut />
        </SidebarCurrentViewProvider>
    );
}
