import { BorderRadiusVisualizer } from "~/components/settings/appearance-tab/border-radius-visualiser";

import { BORDER_RADIUS_OPTIONS, useStyleStore } from "~/stores/style-store";
import { Setting } from "../setting";
import { ThemeSwitcher } from "./theme-switcher";

export const AppearanceTab = ({
    setBorderRadius,
    borderRadius,
}: {
    setBorderRadius: (radius: number) => void;
    borderRadius: number;
}) => {
    const reset = useStyleStore.use.reset();

    return (
        <div>
            <Setting
                title="Radius"
                description="Changes the base border radius of the website."
                resetAction={() => reset(["borderRadius"])}
            >
                <div className="flex gap-4">
                    {BORDER_RADIUS_OPTIONS.map((radius) => (
                        <BorderRadiusVisualizer
                            key={radius}
                            radius={radius}
                            isActive={radius === borderRadius}
                            onClick={() => setBorderRadius(radius)}
                        />
                    ))}
                </div>
            </Setting>
            <Setting title="Themes" resetAction={() => reset(["style"])}>
                <ThemeSwitcher />
            </Setting>
        </div>
    );
};
