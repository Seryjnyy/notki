import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import NewVault from "./new-vault";

export default function ManageVaultsDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
            <NewVault />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
