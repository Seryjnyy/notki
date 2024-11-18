/* eslint-disable  @typescript-eslint/no-explicit-any */
import { StoreApi, UseBoundStore } from "zustand";
type WithSelectors<S> = S extends { getState: () => infer T }
    ? S & { use: { [K in keyof T]: () => T[K] } }
    : never;

// Changed let to const because of lint warnings, if stuff doesn't work then thats why
export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
    _store: S
) => {
    const store = _store as WithSelectors<typeof _store>;
    store.use = {};
    for (const k of Object.keys(store.getState())) {
        (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
    }

    return store;
};
