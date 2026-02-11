import { format } from "date-fns";
import { useField } from "formik";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "../label";

interface DatePickerWithRangeProps {
  className?: string;
  label?: string;
  name?: string;
  value?: DateRange;
  required?: boolean;
  fromDate?: Date;
  onChange?: (date?: DateRange | undefined) => void;
  disabled?: boolean;
  buttonClassName?: string;
}

export function DatePickerWithRange({
  className,
  label,
  name,
  value,
  onChange,
  fromDate,
  required,
  disabled = false,
  buttonClassName,
}: DatePickerWithRangeProps) {
  // eslint-disable-next-line
  const [field, meta, helpers] = name ? useField(name) : [{}, {}, {}];
  const formikValue: DateRange | undefined = field?.value;
  const setFormikValue = helpers?.setValue;

  const selectedValue = name ? formikValue : value;
  const handleChange = (date: DateRange | undefined) => {
    if (name) {
      setFormikValue?.(date);
      onChange && onChange(date);
    } else {
      onChange?.(date);
    }
  };

  return (
    <div className='flex flex-col'>
      {label && <Label required={required}>{label}</Label>}
      <div className={className}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id='date'
              variant={"outline"}
              className={cn(
                "justify-start text-left bg-white shadow-none !srounded-[8px] !hover:bg-white text-black border-0 !text-[13px] font-normal p-0 !h-[48px] !w-[300px]",
                !selectedValue && "",
                buttonClassName,
              )}
              disabled={disabled}
            >
              {selectedValue?.from ? (
                selectedValue.to ? (
                  <>
                    <div className='border-[1px] border-[#D5D7DA]  px-4 w-full flex gap-5 items-center justify-between !h-full rounded-[8px]'>
                      {format(selectedValue.from, "dd/MM/yyyy")} -{" "}
                      {format(selectedValue.to, "dd/MM/yyyy")} <CalendarIcon />
                    </div>
                    {/* <FaArrowRight />
                    <div className='border-[1px]  px-4 w-full flex items-center justify-between !h-full rounded-[5px]'>
                      {format(selectedValue.to, "LLL dd, y")} <CalendarIcon />
                    </div> */}
                  </>
                ) : (
                  <>
                    <div className='border-[1px] border-[#D5D7DA]  px-4 w-full flex items-center justify-between !h-full rounded-[8px]'>
                      {format(selectedValue.from, "dd/MM/yyyy")} - {"End Date"}
                      <CalendarIcon />
                    </div>
                    {/* <FaArrowRight />
                    <div className='border-[1px]  px-4 w-full flex items-center justify-between !h-full rounded-[5px]'>
                      {format(selectedValue.from, "LLL dd, y")} <CalendarIcon />
                    </div> */}
                  </>
                )
              ) : (
                <>
                  <div className='border-[1px] border-[#D5D7DA] px-4 w-full flex items-center justify-between !h-full rounded-[8px]'>
                    {"Start Date"} - {"End Date"}
                    <CalendarIcon />
                  </div>
                  {/* <FaArrowRight />
                  <div className='border-[1px] border-[#D5D7DA] px-4 w-full flex items-center justify-between !h-full rounded-[5px]'>
                    {"Ending Date"} <CalendarIcon />
                  </div> */}
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              fromDate={fromDate}
              initialFocus
              mode='range'
              defaultMonth={selectedValue?.from}
              selected={selectedValue}
              onSelect={handleChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      {name && meta.touched && meta.error && (
        <p className='text-red-500 text-sm'>{meta.error}</p>
      )}
    </div>
  );
}
