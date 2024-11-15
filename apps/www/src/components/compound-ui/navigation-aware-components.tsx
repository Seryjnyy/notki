import { Dialog } from "@repo/ui/components/ui/dialog";
import { withNavigationLock } from "./with-navigation-lock.js";
import { Sheet } from "@repo/ui/components/ui/sheet";

export const NavigationAwareDialog = withNavigationLock(Dialog);
export const NavigationAwareSheet = withNavigationLock(Sheet);
