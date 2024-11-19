import { ReactNode } from "react";

const LandingCard = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full border-2 rounded-[var(--radius)] flex flex-col items-center justify-between p-3 gap-4 ">
            <div className=" w-full h-full">{children}</div>
        </div>
    );
};

LandingCard.Title = ({
    children,
    secondary,
}: {
    children: ReactNode;
    secondary?: ReactNode;
}) => {
    return (
        <div className="flex justify-between items-center pb-1">
            <h3 className="text-muted-foreground">{children}</h3>
            {secondary}
        </div>
    );
};

LandingCard.Content = ({ children }: { children: ReactNode }) => {
    return <div>{children}</div>;
};

LandingCard.Footer = ({ children }: { children: ReactNode }) => {
    return <div>{children}</div>;
};

export default LandingCard;
