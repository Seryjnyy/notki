import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { FONTS } from "~/config/fonts.config";
import * as LK from "~/config/local-storage-keys.config";

export const styleAtom = atomWithStorage(LK.CURRENT_STYLE_KEY, "carbon");
export const useStyle = () => useAtom(styleAtom);

export const borderRadiusAtom = atomWithStorage(LK.BORDER_RADIUS_KEY, 12);
export const useBorderRadius = () => useAtom(borderRadiusAtom);

// Current Selected Font
export const useFont = () => useAtom(fontAtom);
export const fontAtom = atomWithStorage<string>(LK.CURRENT_FONT_KEY, FONTS[2]);

// Collection of user added fonts
export const useUserFonts = () => useAtom(userFontsAtom);
export const userFontsAtom = atomWithStorage<string[]>(LK.USER_FONTS_KEY, []);

export const fontSizeAtom = atomWithStorage(LK.FONT_SIZE_KEY, 24);
export const useFontSize = () => useAtom(fontSizeAtom);
