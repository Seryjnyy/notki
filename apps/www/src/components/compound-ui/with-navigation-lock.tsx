import { useNavigationLock } from "~/hooks/use-navigation-lock";

interface OpenChangeProps {
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

// TODO : rename stuff here since its not only a dialog that can use this, it can be any component that implements OpenChangeProps
export function withNavigationLock<T extends OpenChangeProps>(
    WrappedDialog: React.ComponentType<T>
) {
    return function NavigationAwareDialog(props: T) {
        const { disableNavigation, enableNavigation } = useNavigationLock();

        return (
            <WrappedDialog
                {...props}
                onOpenChange={(open) => {
                    if (open) {
                        disableNavigation();
                    } else {
                        enableNavigation();
                    }
                    props.onOpenChange?.(open);
                }}
            >
                {props.children}
            </WrappedDialog>
        );
    };
}
