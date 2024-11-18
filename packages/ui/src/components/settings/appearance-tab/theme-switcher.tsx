import {
    RadioCard,
    RadioCardContent,
    RadioCardDescription,
} from "@repo/ui/components/ui/radio-card";
import colors from "@repo/ui/styles/theme-list.json";
import { cn, formatThemeName } from "@repo/ui/lib/utils";
import { useStyleStore } from "@repo/lib/stores/style-store";

export const ThemeSwitcher = () => {
    // const [colorStyle, setColorStyle] = useStyle();
    const style = useStyleStore.use.style();
    const setStyle = useStyleStore.use.setStyle();

    return (
        <div className="grid w-full grid-cols-6 flex-wrap gap-4">
            {colors.map(({ mainColor, bgColor, textColor, name }) => {
                const displayColors = [mainColor, bgColor, textColor];
                const isActive = name === style;

                return (
                    <RadioCard
                        key={name}
                        isActive={isActive}
                        className={cn(
                            "col-span-6 flex-grow md:col-span-3",
                            isActive && "outline-primary"
                        )}
                        onClick={() => {
                            setStyle(name);
                        }}
                    >
                        <RadioCardDescription className="mb-1 flex items-center justify-between font-medium">
                            {formatThemeName(name)}
                            <div className="flex gap-1">
                                {displayColors.map((col, i) => (
                                    <div
                                        key={name + col + i}
                                        style={{
                                            background: col,
                                        }}
                                        className="h-4 w-4 rounded-full border border-foreground"
                                    />
                                ))}
                            </div>
                        </RadioCardDescription>
                        <RadioCardContent
                            className="flex flex-col gap-2"
                            style={{
                                background: bgColor,
                            }}
                        ></RadioCardContent>
                    </RadioCard>
                );
            })}
        </div>
    );
};
