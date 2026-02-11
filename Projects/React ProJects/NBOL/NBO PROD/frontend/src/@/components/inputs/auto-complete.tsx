// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { useField, useFormikContext } from "formik";
// import { Check, ChevronDown } from "lucide-react";
// import * as React from "react";
// import { Label } from "../label";

// export function Autocomplete({
//   name,
//   label,
//   options,
//   placeholder,
//   defaultValue,
//   onChange,
//   value: propValue,
//   className,
// }: any) {
//   console.log(options, "<------------ option");
//   const formik = useFormikContext();
//   let field, meta, helpers;

//   const isFormik = !!(formik && name);
//   if (isFormik) {
//     // eslint-disable-next-line
//     [field, meta, helpers] = useField(name);
//   }

//   const [localValue, setLocalValue] = React.useState(defaultValue || "");
//   const [open, setOpen] = React.useState(false);

//   const value = isFormik ? field?.value : (propValue ?? localValue);
//   const setValue =
//     isFormik && helpers?.setValue
//       ? helpers.setValue
//       : (val: string) => {
//           setLocalValue(val);
//           if (onChange) onChange(val);
//         };

//   return (
//     <div className='flex  flex-col rounded-sm'>
//       {label && <Label className='capitalize'>{label}</Label>}
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant='outline'
//             role='combobox'
//             aria-expanded={open}
//             className={`w-[300px] !h-[48px] overflow-x-auto no-scrollbar  justify-between text-[#2E3545] rounded-sm  ${
//               meta?.error && meta.touched ? "border-red-500" : ""
//             } ${className}`}
//           >
//             {value
//               ? options.find((option: any) => option === value)?.name ||
//                 options.find((option: any) => option?.header === value)?.header
//               : placeholder || "Select..."}
//             <ChevronDown className='opacity-50' />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent
//           className='w-[300px] p-0'
//           onWheel={(e) => {
//             const el = e.currentTarget;
//             const isScrollable =
//               el.scrollHeight > el.clientHeight &&
//               ((e.deltaY > 0 &&
//                 el.scrollTop < el.scrollHeight - el.clientHeight) ||
//                 (e.deltaY < 0 && el.scrollTop > 0));
//             if (isScrollable) e.stopPropagation();
//           }}
//         >
//           <Command>
//             <CommandInput placeholder='Search...' />
//             <CommandList>
//               <CommandEmpty>No Data found.</CommandEmpty>
//               <CommandGroup>
//                 {options?.map((option: any) => (
//                   <CommandItem
//                     key={option.value || option?.header}
//                     value={option || option?.header}
//                     onSelect={() => {
//                       setValue(option || option?.header);
//                       setOpen(false);
//                     }}
//                   >
//                     {option.name || option?.header}
//                     <Check
//                       className={cn(
//                         "ml-auto",
//                         value === option || value === option?.header
//                           ? "opacity-100"
//                           : "opacity-0",
//                       )}
//                     />
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>
//       {meta?.touched && meta.error && (
//         <p className='text-red-500 text-sm mt-1'>{meta.error}</p>
//       )}{" "}
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useField, useFormikContext } from "formik";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { Label } from "../label";

interface AutocompleteProps<T> {
  name?: string;
  label?: string;
  options: T[];
  placeholder?: string;
  defaultValue?: T | null;
  value?: T | null;
  onChange?: (value: T | null) => void;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string | number;
  className?: string;
  required?: boolean;
  id?: any;
  onBlur?: any;
  disabled?: boolean;
  withPortal?: boolean;
}

export function Autocomplete<T>({
  name,
  label,
  options,
  placeholder,
  defaultValue,
  onChange,
  value: propValue,
  disabled,
  required,
  withPortal = true,
  getOptionLabel = (o: any) => o?.name ?? o?.header ?? "",
  getOptionValue = (o: any) => o?.id ?? o?.value ?? o?.header,
  className,
}: AutocompleteProps<T>) {
  const formik = useFormikContext<any>();
  let field, meta, helpers: any;

  const isFormik = !!(formik && name);
  if (isFormik) {
    // eslint-disable-next-line
    [field, meta, helpers] = useField(name as string);
  }

  const [localValue, setLocalValue] = React.useState<T | null>(
    defaultValue ?? null,
  );
  const [open, setOpen] = React.useState(false);

  const value: T | null = isFormik ? field?.value : (propValue ?? localValue);

  const setValue = (val: T | null) => {
    if (isFormik && helpers?.setValue) {
      helpers.setValue(val);
    } else {
      setLocalValue(val);
      onChange?.(val);
    }
  };

  return (
    <div className='flex flex-col rounded-sm'>
      {label && (
        <Label className='capitalize' required={required}>
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn(
              "w-[300px] !bg-white !h-[44px] overflow-x-auto no-scrollbar justify-between text-[#2E3545] rounded-[8px]  border-[#D5D7DA] shadow-[rgba(10,13,18,0.05)]",
              meta?.error && meta.touched ? "border-red-500" : "",
              className,
            )}
          >
            {value ? getOptionLabel(value) : placeholder || "Select..."}
            <ChevronDown className='opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          withPortal={withPortal}
          className='max-h-[300px]  p-0'
          onWheel={(e) => {
            const el = e.currentTarget;
            const isScrollable =
              el.scrollHeight > el.clientHeight &&
              ((e.deltaY > 0 &&
                el.scrollTop < el.scrollHeight - el.clientHeight) ||
                (e.deltaY < 0 && el.scrollTop > 0));
            if (isScrollable) e.stopPropagation();
          }}
        >
          <Command>
            <CommandInput placeholder='Search...' />
            <CommandList>
              <CommandEmpty>No Data found.</CommandEmpty>
              <CommandGroup>
                {options?.map((option: T, idx: number) => {
                  const label = getOptionLabel(option);
                  const optionVal = getOptionValue(option);
                  const selectedVal = value ? getOptionValue(value) : undefined;
                  return (
                    <CommandItem
                      key={optionVal ?? idx}
                      value={`${label} ${optionVal}`}
                      onSelect={() => {
                        setValue(option);
                        setOpen(false);
                      }}
                    >
                      {label}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedVal === optionVal
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {meta?.touched && meta.error && (
        <p className='text-red-500 text-sm mt-1'>{meta.error}</p>
      )}
    </div>
  );
}
