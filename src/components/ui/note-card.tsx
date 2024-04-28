import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function NoteCard({
  children,
  title,
  seeTitles,
}: {
  children: ReactNode;
  title: string;
  seeTitles: boolean;
}) {
  console.log(seeTitles);
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn("text-muted-foreground select-none", {
            "sr-only": !seeTitles,
          })}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="leading-normal">
        <pre>{children}</pre>
      </CardContent>
    </Card>
  );
}
