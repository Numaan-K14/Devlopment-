import { useGetDataRef } from "@/hooks";
import { cn, getValueByKey } from "@/lib";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "iconsax-react";
import { useState } from "react";
import { FieldError, useFormContext } from "react-hook-form";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { HelpText } from "./help-text";

function DateInput({
  name,
  helpText,
  className,
  label,
  required,
  dataRef,
  placeholder = "Pick a date",
  minDate,
  maxDate,
  disable,
  dateTime,
  removePortal,
}: {
  name: string;
  helpText?: string;
  className?: string;
  label: string;
  dataRef?: string;
  required?: boolean;
  disable?: boolean;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  dateTime?: boolean;
  removePortal?: string;
}) {
  const [open, setOpen] = useState(false);
  const [timeBoxClicked, setTimeBoxClicked] = useState({hour:false,minute:false})
  const {
    setValue,
    formState: { errors },
    watch,
    register,
  } = useFormContext(); // Access the react-hook-form context
  const error = getValueByKey(errors, name) as FieldError | undefined;
  const date = watch(name);
  const componentDataRef: string = useGetDataRef(
    dataRef,
    name,
    "components.date-field",
  );
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (date) {
      const newDate = new Date(date);
      const newTimeBoxState = { ...timeBoxClicked };
      if (type === "hour") {
        newDate.setHours(parseInt(value));
        newTimeBoxState.hour = true;
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
        newTimeBoxState.minute = true;
      }
      setValue(name, newDate, { shouldValidate: true });
      setTimeBoxClicked(newTimeBoxState);
      
      if (newTimeBoxState.hour && newTimeBoxState.minute) {
        setOpen(false);
        setTimeBoxClicked({hour:false,minute:false})
      }
    }
  };

  const { disabled } = register(name);
  return (
    <div
      className={` group relative  ${className}`}
      data-ref={`${componentDataRef}.container`}
      id={`${componentDataRef}.container`}
    >
      {label && (
        <label
          data-ref={`${componentDataRef}.label`}
          htmlFor={name}
          className='block mb-1 bg-background px-1 text-sm leading-5 font-normal text-helper'
        >
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </label>
      )}

      <Popover
        open={open}
        modal={true}
        onOpenChange={(val) => {
          setOpen(val);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            disabled={disabled || disable}
            variant={"outline"}
            data-ref={`${componentDataRef}.trigger`}
            className={cn(
              "w-full justify-between gap-3 bg-background font-medium truncate text-text-primary !text-md hover:bg-background my-0 px-4 py-[0.75rem] h-[40px]",
              !date && "text-muted-foreground",
              {
                "bg-gray-50": disabled || disable,
              },
            )}
          >
            {dateTime ? (
              date ? (
                format(date, "P hh:mm a")
              ) : (
                <span className='text-gray-300'>{placeholder}</span>
              )
            ) : date ? (
              format(date, "P")
            ) : (
              <span className='text-gray-300'>{placeholder}</span>
            )}
            <CalendarIcon color='black' className='mr-2 h-4 w-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-auto p-0 ${removePortal}`}>
          <div className='sm:flex'>
            <Calendar
              data-ref={`${componentDataRef}.calender`}
              mode='single'
              selected={date}
              onSelect={(value) => {
                setValue(name, value, { shouldValidate: true });
                !dateTime && setOpen(false) 
              }}
              initialFocus
              // captionLayout="dropdown-years"
              toDate={maxDate || new Date()}
              fromDate={minDate}
            />
           {dateTime && <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
              <ScrollArea className='w-64 sm:w-auto'>
                <div className='flex sm:flex-col p-2'>
                  {hours.reverse().map((hour) => (
                    <Button
                      key={hour}
                      size='icon'
                      variant={
                        date && date?.getHours() === hour ? "default" : "ghost"
                      }
                      className='sm:w-full shrink-0 aspect-square'
                      onClick={() => handleTimeChange("hour", hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation='horizontal' className='sm:hidden' />
              </ScrollArea>
              <ScrollArea className='w-64 sm:w-auto'>
                <div className='flex sm:flex-col p-2'>
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <Button
                      key={minute}
                      size='icon'
                      variant={
                        date && date.getMinutes() === minute
                          ? "default"
                          : "ghost"
                      }
                      className='sm:w-full shrink-0 aspect-square'
                      onClick={() =>
                        handleTimeChange("minute", minute.toString())
                      }
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation='horizontal' className='sm:hidden' />
              </ScrollArea>
            </div>}
          </div>
        </PopoverContent>
      </Popover>
      <div>
        {(error || helpText) && (
          <HelpText dataRef={componentDataRef} error={!!error}>
            {error ? error?.message : helpText}
          </HelpText>
        )}
      </div>
    </div>
  );
}

export { DateInput };
