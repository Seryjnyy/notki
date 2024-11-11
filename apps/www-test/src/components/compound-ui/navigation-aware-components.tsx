import { Dialog } from "@repo/ui/dialog";
import { withNavigationLock } from "./with-navigation-lock";
import { Sheet } from "@repo/ui/sheet";

export const NavigationAwareDialog = withNavigationLock(Dialog);
export const NavigationAwareSheet = withNavigationLock(Sheet);
