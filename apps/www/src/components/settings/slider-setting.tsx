import { Label } from "@repo/ui/components/ui/label";
import { Slider } from "@repo/ui/components/ui/slider";
import { cn } from "@repo/ui/lib/utils";
import { ResetButton } from "~/components/compound-ui/reset-button";

const SliderSetting = ({
    label,
    value,
    limits,
    step = 1,
    disabled,
    onChange,
    onReset,
}: {
    label: string;
    value: number;
    step?: number;
    limits?: { min: number; max: number };
    disabled?: boolean;
    onChange: (val: number) => void;
    onReset?: () => void;
}) => {
    return (
        <div
            className={cn(
                "w-full border py-3 px-4 rounded-[var(--radius)] ",
                disabled && "text-muted-foreground"
            )}
        >
            <div className="flex justify-between items-center w-full">
                <Label className="select-none">{label}</Label>
                {onReset && (
                    <ResetButton onClick={onReset} disabled={disabled} />
                )}
            </div>
            <div className="flex gap-2">
                <div className="flex items-center gap-2">
                    <p className="min-w-[1.5rem] font-bold">{value}</p>
                </div>
                <Slider
                    disabled={disabled}
                    max={limits?.max}
                    min={limits?.min}
                    step={step}
                    value={[value]}
                    onValueChange={(val) => onChange(val[0])}
                />
            </div>
        </div>
    );
};

export default SliderSetting;
