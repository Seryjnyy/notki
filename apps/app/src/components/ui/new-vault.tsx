import { ArchiveIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { open } from "@tauri-apps/api/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";

import { useEffect, useState } from "react";
import { Vault } from "~/lib/types";
import { getVaults } from "~/lib/vaults";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { useForm } from "react-hook-form";
import {
  createVaultSchema,
  createVaultSchemaType,
} from "~/lib/form-schemas/create-vault";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

const ExistingVaults = () => {
  const [vaults, setVaults] = useState<Vault[]>([]);

  useEffect(() => {
    const setUp = async () => {
      setVaults(await getVaults());
    };
    setUp();
  }, []);

  return (
    <div className="border-r w-fit h-screen px-4 py-4 bg-card">
      {vaults.map((vault) => (
        <div
          key={vault.id}
          className="hover:bg-secondary p-2 rounded-md flex items-center"
        >
          <div className="flex flex-col items-start">
            <span>{vault.name}</span>
            <span className="text-sm text-muted-foreground">{vault.path}</span>
          </div>
          <Popover>
            <PopoverTrigger className="p-2 w-fit h-fit rounded-lg ml-4 hover:bg-slate-600">
              <DotsVerticalIcon className="" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-2">
              <div className="w-full hover:bg-gray-800 p-2 rounded-md flex items-center gap-2">
                <ArchiveIcon />
                <span>Reveal in file explorer</span>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  );
};

const CreateVaultForm = () => {
  const form = useForm<createVaultSchemaType>({
    resolver: zodResolver(createVaultSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: createVaultSchemaType) {
    console.log(values);
  }
  const onBrowse = async () => {
    const selected = await open({ directory: true, multiple: false });
    if (typeof selected != "string") {
      return;
    }

    form.setValue("location", selected);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <FormLabel>Vault name</FormLabel>
                  <FormDescription>Pick a name for your vault.</FormDescription>
                </div>
                <FormControl>
                  <Input placeholder="name" {...field} className="w-[12rem]" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <FormLabel>Location</FormLabel>
                  <FormDescription className="flex flex-col">
                    <span>
                      {location != null
                        ? "Your new vault location will be placed in."
                        : "Pick a folder to put your new vault."}
                    </span>
                    {location && (
                      <span className="text-sm text-primary">
                        {form.getValues("location")}
                      </span>
                    )}
                  </FormDescription>
                </div>

                <FormControl>
                  <Button
                    type="button"
                    className="w-fit"
                    variant={"secondary"}
                    id={"select-location-button"}
                    onClick={onBrowse}
                  >
                    Browse
                  </Button>
                </FormControl>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-fit mt-2" type="submit">
          Create
        </Button>
      </form>
    </Form>
  );
};

const VaultOptions = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-center items-center h-[200px] w-full ">
        txt-viewer
      </div>
      <div className="h-fit flex items-center justify-between w-full px-12">
        {/* <div>
          <h3>Create new vault</h3>
          <p className="text-sm text-muted-foreground">
            Create a new vault under a folder.
          </p>
        </div>
        <Button>Create</Button> */}
        <Tabs defaultValue="create-vault" className="w-full">
          <TabsList>
            <TabsTrigger value="create-vault">Create vault</TabsTrigger>
            <TabsTrigger value="open-existing-vault">
              Open existing vault
            </TabsTrigger>
          </TabsList>
          <TabsContent value="create-vault">
            <div className="pt-4">
              <CreateVaultForm />
            </div>
          </TabsContent>
          <TabsContent value="open-existing-vault">Not yet.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default function NewVault() {
  return (
    <div className="flex">
      <ExistingVaults />
      <VaultOptions />
    </div>
  );
}
