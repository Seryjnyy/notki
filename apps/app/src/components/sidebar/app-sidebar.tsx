import { Button } from "@repo/ui/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@repo/ui/components/ui/sidebar";
import { Clock, EllipsisVertical, Vault } from "lucide-react";
import * as React from "react";
import { Vault as VaultType } from "~/lib/backend-types";
import { Recent, useGetSortedRecents } from "~/stores/recents-store";
// import { useSidebarViewStore } from "~/stores/sidebar-view-store";
import { SearchCurrentViewForm } from "./search-form";
import { CurrentViewSwitcher } from "./view-switcher";
import AppSidebarShortcut from "./app-sidebar-shortcut";

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

const SidebarGroupRecents = () => {
    const { search } = useSidebarCurrentView();
    const sortedRecents = useGetSortedRecents();

    const filteredRecents = React.useMemo(() => {
        return sortedRecents.filter((item) => {
            return item.path.toLowerCase().includes(search.toLowerCase());
        });
    }, [sortedRecents, search]);

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="flex justify-between">
                <span className={search != "" ? "text-primary" : ""}>
                    Recents
                </span>
                <span>{filteredRecents.length}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-4">
                <SidebarMenu>
                    <RecentsList recents={filteredRecents} />
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

const SidebarGroupVaults = () => {
    const { search } = useSidebarCurrentView();
    const { vaults } = useVaults();

    const filteredVaults = React.useMemo(() => {
        return vaults.filter((item) => {
            return item.filepath.toLowerCase().includes(search.toLowerCase());
        });
    }, [vaults, search]);

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="flex justify-between">
                <span className={search != "" ? "text-primary" : ""}>
                    Vaults
                </span>
                <span>{filteredVaults.length}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-4">
                <SidebarMenu>
                    <VaultsList vaults={filteredVaults} />
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { currentView } = useSidebarCurrentView();

    return (
        <SidebarCurrentViewProvider>
            <Sidebar {...props}>
                <SidebarHeader>
                    <CurrentViewSwitcher />
                    <SearchCurrentViewForm />
                </SidebarHeader>

                <SidebarContent>
                    {currentView === "Recents" && <SidebarGroupRecents />}
                    {currentView === "Vaults" && <SidebarGroupVaults />}
                </SidebarContent>

                <SidebarFooter>
                    <Button>Open folder</Button>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <AppSidebarShortcut />
        </SidebarCurrentViewProvider>
    );
}
