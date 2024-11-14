import { zodResolver } from "@hookform/resolvers/zod";
import { ArchiveIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { open } from "@tauri-apps/api/dialog";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@repo/ui/components/ui/popover";

import { Input } from "@repo/ui/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    createVaultSchema,
    createVaultSchemaType,
} from "~/lib/form-schemas/create-vault";

import { addVault, getVaults } from "~/lib/vaults";
import { useWorkspaceConfig } from "~/lib/workspace-store";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./form";
// import { setCurrentWorkspace } from "~/lib/config-service";
import { Vault } from "~/lib/backend-types";

const ExistingVaults = () => {
    const [vaults, setVaults] = useState<Vault[]>([]);
    const setWorkspacePath = useWorkspaceConfig(
        (state) => state.setCurrentWorkspace
    );

    useEffect(() => {
        const setUp = async () => {
            setVaults(await getVaults());
        };
        setUp();
    }, []);

    const onOpenInFileExplorer = async (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        filepath: string
    ) => {
        e.stopPropagation();
        console.log(filepath);
    };

    return (
        <div className="border-r min-w-[16rem]  h-screen px-4 py-4 bg-card">
            <h2 className="font-semibold">Vaults</h2>
            {vaults.map((vault) => (
                <div
                    key={vault.id}
                    className="hover:bg-secondary px-4 py-3 rounded-md flex items-center cursor-pointer"
                    onClick={async () => {
                        setWorkspacePath(vault);
                    }}
                >
                    <div className="flex flex-col items-start">
                        <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[10rem]">
                            {vault.name}
                        </span>
                        <span className="text-sm text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap max-w-[10rem]">
                            {vault.filepath}
                            oub
                        </span>
                    </div>
                    <Popover>
                        <PopoverTrigger
                            className="p-2 w-fit h-fit rounded-lg ml-4 hover:brightness-150 bg-inherit z-30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DotsVerticalIcon />
                        </PopoverTrigger>
                        <PopoverContent
                            className="flex flex-col  bg-background cursor-pointer"
                            onClick={(e) =>
                                onOpenInFileExplorer(e, vault.filepath)
                            }
                        >
                            <div className="w-full hover:bg-foreground hover:text-background p-2 rounded-sm flex items-center gap-2">
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
            location: "",
        },
    });

    function onSubmit(values: createVaultSchemaType) {
        console.log(values);
        addVault(values.name, values.location);
    }
    const onBrowse = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            recursive: true,
        });
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
                                    <FormDescription>
                                        Pick a name for your vault.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder="name"
                                        {...field}
                                        className="w-[12rem]"
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={() => (
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
        <div className="flex flex-col w-full ">
            <div className="flex justify-center items-center h-[200px] w-full ">
                <h1 className="text-sm font-extrabold">txt-viewer</h1>
            </div>
            <div className="h-fit flex items-center justify-between w-full px-12">
                {/* <div>
          <h3>Create new vault</h3>
          <p className="text-sm text-muted-foreground">
            Create a new vault under a folder.
          </p>
        </div>
        <Button>Create</Button> */}
                <Tabs defaultValue="create-vault" className="w-full space-y-12">
                    <TabsList>
                        <TabsTrigger value="create-vault">
                            Create vault
                        </TabsTrigger>
                        <TabsTrigger value="open-existing-vault">
                            Open existing vault
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="create-vault">
                        <CreateVaultForm />
                    </TabsContent>
                    <TabsContent value="open-existing-vault">
                        Not yet.
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default function VaultManager() {
    return (
        <div className="flex">
            <ExistingVaults />
            <VaultOptions />
        </div>
    );
}
