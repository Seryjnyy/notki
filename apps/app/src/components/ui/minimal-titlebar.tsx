import { ViewVerticalIcon } from "@radix-ui/react-icons";
import { produce } from "immer";
// import { ReactNode } from "react";
import { useUiState } from "~/lib/ui-store";

// interface WindowActionButtonProps {
//     children: ReactNode;
//     action: () => Promise<void>;
// }
// const WindowActionButton = ({ children, action }: WindowActionButtonProps) => {
//     return (
//         <div
//             className="inline-flex justify-center items-center h-[30px] w-[30px] hover:bg-primary group"
//             onClick={action}
//         >
//             <span className="text-primary group-hover:text-secondary">
//                 {children}
//             </span>
//         </div>
//     );
// };

const SidebarButton = () => {
    const uiState = useUiState((state) => state.uiState);
    const setUiState = useUiState((state) => state.setUiState);

    const onToggle = () => {
        setUiState(
            produce(uiState, (draft) => {
                draft.sidebar = !draft.sidebar;
            })
        );
    };

    return (
        <div
            className="inline-flex justify-center items-center h-[30px] w-12 p-1"
            onClick={onToggle}
        >
            <div className="hover:bg-primary p-1 rounded-md group">
                <ViewVerticalIcon className="text-primary group-hover:text-secondary" />
            </div>
        </div>
    );
};

export default function MinimalTitlebar() {
    return (
        <div
            data-tauri-drag-region
            className="select-none h-[30px] w-[30px] ml-auto flex justify-between fixed top-0 left-0 right-0 bg-secondary z-10 rounded-bl-md"
        >
            <SidebarButton />
        </div>
    );
}
