import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../label";
import { useField } from "formik";

export function CustomCheckbox({
  label,
  name,
}: {
  label?: string;
  name: string;
}) {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={name}
        checked={field.value}
        onCheckedChange={(checked) => helpers.setValue(checked)}
      />
      {label && (
        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </Label>
      )}
    </div>
  );
}
