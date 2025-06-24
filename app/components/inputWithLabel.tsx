import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props extends React.ComponentProps<"input"> {
  label:string
}

export function InputWithLabel({ label, ...props }:Props) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor={label}>{label}</Label>
      <Input {...props} />
    </div>
  )
}
