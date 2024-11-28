import { Dialog } from "@repo/ui/components/ui/dialog";
import { withNavigationLock } from "./with-navigation-lock";
import { Sheet } from "@repo/ui/components/ui/sheet";
import { DropdownMenu } from "./ui/dropdown-menu";

export const NavigationAwareDialog = withNavigationLock(Dialog);
export const NavigationAwareSheet = withNavigationLock(Sheet);
export const NavigationAwareDropdownMenu = withNavigationLock(DropdownMenu);
