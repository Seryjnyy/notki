import { ThemeSwitcher } from "./theme-switcher.js";
import { useStyle } from "~/atoms/atoms";
import { BorderRadiusVisualizer } from "~/components/settings/appearance-tab/border-radius-visualiser";
import {
    BORDER_RADII,
    DEFAULT_BORDER_RADIUS,
    DEFAULT_THEME,
} from "~/config/appearance.config";
import { Setting } from "../setting.js";

export const AppearanceTab = ({
    setBorderRadius,
    borderRadius,
}: {
    setBorderRadius: (radius: number) => void;
    borderRadius: number;
}) => {
    const [, setStyle] = useStyle();
    return (
        <div>
            <Setting
                title="Radius"
                description="Changes the base border radius of the website."
                resetAction={() => setBorderRadius(DEFAULT_BORDER_RADIUS)}
            >
                <div className="flex gap-4">
                    {BORDER_RADII.map((radius) => (
                        <BorderRadiusVisualizer
                            key={radius}
                            radius={radius}
                            isActive={radius === borderRadius}
                            onClick={() => setBorderRadius(radius)}
                        />
                    ))}
                </div>
            </Setting>
            <Setting title="Themes" resetAction={() => setStyle(DEFAULT_THEME)}>
                <ThemeSwitcher />
            </Setting>
        </div>
    );
};
