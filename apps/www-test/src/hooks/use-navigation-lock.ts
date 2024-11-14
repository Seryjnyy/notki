import { atom, useAtom } from "jotai";

// TODO : Using a atom file for atoms, this is outside of it, idk if this is a good practice
const navigationDisableCountAtom = atom(0);

export const useNavigationLock = () => {
    const [count, setCount] = useAtom(navigationDisableCountAtom);

    return {
        isNavigationEnabled: count === 0,
        disableNavigation: () => setCount((prev) => prev + 1),
        enableNavigation: () => setCount((prev) => Math.max(0, prev - 1)),
    };
};
