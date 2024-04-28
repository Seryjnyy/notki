import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

export default function NoteCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground select-none">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
