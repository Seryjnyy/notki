import { ReactNode } from "react";

interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {
    secondary?: ReactNode;
}

const Title = ({ children, secondary }: TitleProps) => {
    return (
        <div className="flex justify-between items-center pb-1 min-h-[2.5rem] ">
            <h3 className="text-muted-foreground">{children}</h3>
            {secondary}
        </div>
    );
};

Title.displayName = "Title";

const Content = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div>{children}</div>;
};

Content.displayName = "Content";

const Footer = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div>{children}</div>;
};

Footer.displayName = "Footer";

const LandingCard = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full border-2 rounded-[var(--radius)] flex flex-col items-center justify-between p-3 gap-4 ">
            <div className=" w-full h-full">{children}</div>
        </div>
    );
};

LandingCard.displayName = "LandingCard";

LandingCard.Title = Title;
LandingCard.Content = Content;
LandingCard.Footer = Footer;

export default LandingCard;
