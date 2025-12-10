// src/components/DateTimePicker.tsx
import { useField, useFormikContext } from "formik";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Label } from "../label";

interface DateTimePickerProps {
  name: string;
  className?: string;
  label?: string;
  minDate?: Date;
  placeholderText?: string;
  props?: any;
}

export function DateTimePicker({
  name,
  className,
  label,
  minDate,
  placeholderText = "Select date & time",
  ...props
}: DateTimePickerProps) {
  const [field, meta, helpers] = useField(name);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (!field.value) {
      setFieldValue(name, null);
    }
  }, [field.value, name, setFieldValue]);

  return (
    <div className='flex flex-col relative'>
      {label && <Label>{label}</Label>}
      <div className='relative'>
        <DatePicker
          {...props}
          selected={field.value}
          onChange={(val: Date | null) => setFieldValue(name, val)}
          showTimeSelect
          timeIntervals={15}
          dateFormat='dd/ MM /yyyy       hh:mm a'
          placeholderText={placeholderText}
          minDate={minDate}
          popperClassName='custom-datepicker-popper'
          className={`!rounded-[4px] !h-[48px] font-Neue-Haas-Grotesk bg-transparent transition-colors justify-between font-normal focus:outline-none ${className}`}
        />
        <span className='pl-72 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-black'>
          <FaRegCalendarAlt className='w-4 h-4' />
        </span>
      </div>
      {meta.touched && meta.error && (
        <div className='text-red-500 text-xs mt-1'>{meta.error}</div>
      )}
    </div>
  );
}

export default DateTimePicker;
