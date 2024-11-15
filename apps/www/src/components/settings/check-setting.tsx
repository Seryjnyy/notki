import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Label } from "@repo/ui/components/ui/label";

interface CheckSettingProps {
    label: string;
    value: boolean;
    onChange: (val: boolean) => void;
}

const CheckSetting = ({ label, value, onChange }: CheckSettingProps) => {
    return (
        <div className="flex items-center justify-between w-full border py-3 px-4 rounded-[var(--radius)]">
            <div className="flex gap-2 items-center">
                <Label className="max-w-[10rem]  py-1 truncate capitalize">
                    {label}
                </Label>
            </div>
            <Checkbox
                checked={value}
                onCheckedChange={(val) => {
                    if (val == "indeterminate") {
                        onChange(false);
                        return;
                    }
                    onChange(val);
                }}
            />
        </div>
    );
};

export default CheckSetting;
