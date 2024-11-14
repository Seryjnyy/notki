import { ReactNode } from "react";
import { ResetButton } from "~/components/compound-ui/reset-button";

export const TabTitle = ({
    children,
    onReset,
}: {
    children: ReactNode;
    onReset: () => void;
}) => {
    return (
        <div className="flex items-center mb-4">
            <h3 className="font-semibold text-lg">{children}</h3>
            <ResetButton onClick={onReset} />
        </div>
    );
};

export const TabContent = ({ children }: { children: ReactNode }) => (
    <div className=" flex flex-wrap gap-2 w-full ">{children}</div>
);
