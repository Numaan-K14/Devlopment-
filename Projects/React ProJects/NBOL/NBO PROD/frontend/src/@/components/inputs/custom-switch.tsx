import { useField, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { Label } from "../label";
import { Switch } from "../ui/switch";

interface FormikSwitchProps {
  name?: string;
  label?: string;
  className?: string;
  onChange?: (val: boolean) => void;
  checked?: boolean;
  defaultChecked?: boolean;
}

const CustomSwitch: React.FC<FormikSwitchProps> = ({
  name,
  label,
  className,
  onChange,
  checked,
  defaultChecked = false,
}) => {
  const formik = useFormikContext<any>();
  const isFormik = !!(name && formik);
  // eslint-disable-next-line
  const [field, , helpers] = isFormik ? useField(name!) : ([] as any);

  const [localValue, setLocalValue] = useState(defaultChecked);

  useEffect(() => {
    if (!isFormik && checked !== undefined) {
      setLocalValue(checked);
    } else if (isFormik && checked !== undefined && checked !== field.value) {
      helpers.setValue(checked);
    }
  }, [checked]);

  const handleChange = (val: boolean) => {
    if (isFormik) {
      helpers.setValue(val);
    } else {
      setLocalValue(val);
    }
    onChange?.(val);
  };

  const valueToUse = isFormik
    ? field.value
    : checked !== undefined
      ? checked
      : localValue;

  return (
    <div className='flex flex-col'>
      {label && <Label>{label}</Label>}
      <div className={` ${className}`}>
        <Switch checked={valueToUse} onCheckedChange={handleChange} />
      </div>
    </div>
  );
};

export default CustomSwitch;
