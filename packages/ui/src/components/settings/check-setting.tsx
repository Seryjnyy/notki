import { Checkbox } from "@repo/ui/components/ui/checkbox"
import { Label } from "@repo/ui/components/ui/label"

interface CheckSettingProps {
  label: string
  desc?: string
  value: boolean
  onChange: (val: boolean) => void
}

const CheckSetting = ({ label, desc, value, onChange }: CheckSettingProps) => {
  return (
    <div className="flex items-center justify-between w-full border py-3 px-4 rounded-[var(--radius)]">
      <div className="flex flex-col">
        <div>
          <Label className="max-w-[10rem]  py-1 truncate first-letter:capitalize">
            {label}
          </Label>
        </div>
        {desc && <p className="text-muted-foreground text-xs">{desc}</p>}
      </div>
      <Checkbox
        checked={value}
        onCheckedChange={(val) => {
          if (val == "indeterminate") {
            onChange(false)
            return
          }
          onChange(val)
        }}
      />
    </div>
  )
}

export default CheckSetting
