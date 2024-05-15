import { GearIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";

export default function Sidebar() {
  return (
    <div className="w-12 h-screen mt-[30px] border-r">
      <div className="flex flex-col p-1">
        <Button variant="ghost" className="p-0">
          <GearIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
