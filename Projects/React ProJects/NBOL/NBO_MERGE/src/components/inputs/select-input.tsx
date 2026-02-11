import { cva } from "class-variance-authority";
import { Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { type FieldError, useFormContext } from "react-hook-form";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import AutoSizer from "react-virtualized-auto-sizer";
import { List } from "react-window";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { HelpText } from "./help-text";
import { cn } from "@/lib/utils";
import { axios } from "@/config/axios";
import { useGetDataRef } from "@/hooks/useGetDataRef";
import { getValueByKey } from "@/lib/getValueBykey";

const selectVariants = cva(
  "w-full justify-between bg-background font-medium text-text-primary text-md hover:bg-background my-0 font-red-display",
  {
    variants: {
      size: {
        sm: "px-3 h-[40px]",
        lg: "px-4 py-[17px] h-[52px]",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

const defaultGetOptionLabel = (option: any) => option.label;

export function SelectInput({
  options,
  name,
  placeholder,
  label,
  dataRef,
  required,
  size = "sm",
  className,
  helpText,
  onValueChange,
  getOptionLabel = defaultGetOptionLabel,
  disable,
  value: controlledValue,
  // isPending = false,
  apiUrl,
  serverSide = false,
  removePortal,
  addPortal,
}: {
  name?: string;
  options: any[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  dataRef?: string;
  className?: string;
  helpText?: string;
  onValueChange?: (value: any) => void;
  size?: "sm" | "lg";
  getOptionLabel?: (option: any) => string;
  disable?: boolean;
  value?: any;
  isPending?: boolean;
  apiUrl?: string;
  serverSide?: boolean;
  removePortal?: string;
  addPortal?: string;
}) {
  const componentDataRef: string = useGetDataRef(
    dataRef,
    name,
    "components.select-input"
  );
  const [open, setOpen] = useState<boolean>(false);
  const formContext = useFormContext();
  const isFormContext = !!formContext && !!name;

  const {
    register,
    formState: { errors, disabled: disabledFields },
    setValue,
    watch,
  } = formContext || {};

  const error = isFormContext
    ? (getValueByKey(errors, name) as FieldError | undefined)
    : undefined;
  const formValue = isFormContext ? watch(name) : undefined;
  const value = isFormContext ? formValue : controlledValue;

  const { onBlur, disabled } = isFormContext
    ? register(name, {
        required,
        disabled:
          disable ||
          (disabledFields
            ? Object.keys(disabledFields)?.includes(name)
            : false),
      })
    : { onBlur: () => {}, disabled: disable };

  const fieldValue = useMemo(() => {
    return value ? getOptionLabel(value) : placeholder;
  }, [value, options, placeholder, getOptionLabel]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fetchedOptions, setFetchedOptions] = useState<any[]>(options);
  const [_loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 50,
  });

  // const filteredOptions = useMemo(() => {
  //   return !searchTerm
  //     ? options
  //     : options.filter((option) =>
  //         getOptionLabel(option)
  //           .toLowerCase()
  //           .includes(searchTerm.toLowerCase()),
  //       );
  // }, [options, searchTerm, getOptionLabel]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (serverSide && apiUrl && searchTerm) {
        console.log("2nd if");
        let endpoint = apiUrl.includes("?")
          ? `${apiUrl}&q=${encodeURIComponent(searchTerm)}`
          : `${apiUrl}?q=${encodeURIComponent(searchTerm)}`;
        setLoading(true);
        axios
          .get(`${endpoint}${"&limit=50&pg=0"}`)
          .then((res: any) => {
            setFetchedOptions(res || []);
          })
          .catch((err) => {
            console.error("Error fetching options:", err);
            setFetchedOptions([]);
          })
          .finally(() => setLoading(false));
      } else if (serverSide && apiUrl && pagination.page > 0) {
        console.log("1st if");
        let endpoint = apiUrl.includes("?")
          ? `${apiUrl}&q=${encodeURIComponent(searchTerm)}`
          : `${apiUrl}?q=${encodeURIComponent(searchTerm)}`;
        setLoading(true);
        axios
          .get(
            `${endpoint}${
              "&limit=" + pagination.limit + "&pg=" + pagination.page
            }`
          )
          .then((res: any) => {
            console.log(res);
            setFetchedOptions((prev) => [...prev, ...(res || [])]);
          })
          .catch((err) => {
            console.error("Error fetching options:", err);
            setFetchedOptions([]);
          })
          .finally(() => setLoading(false));
      } else {
        const filtered = !searchTerm
          ? options
          : options.filter((option) =>
              getOptionLabel(option)
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            );
        setFetchedOptions(filtered);
      }
    }, 300); // debounce time in ms

    return () => clearTimeout(delayDebounce);
  }, [
    searchTerm,
    apiUrl,
    options,
    getOptionLabel,
    pagination.page,
    pagination.limit,
  ]);

  const listRef = useRef<any>(null);

  const getItemSize = (index: number) => {
    let option = fetchedOptions[index];
    let label = getOptionLabel(option);
    let rowHeight = (label.length / 35) * 35;
    return rowHeight < 35 ? 35 : rowHeight;
  };

  const handleValueChange = (option: any) => {
    if (isFormContext) {
      setValue(name, option, { shouldValidate: true });
    }
    onValueChange && onValueChange(option);
    setOpen(false);
  };

  return (
    <div
      className={cn("relative", className)}
      data-ref={`${componentDataRef}.container`}
    >
      {label && (
        <label
          data-ref={`${componentDataRef}label`}
          htmlFor={name}
          className="block mb-1.5 bg-background px-1 text-sm leading-5 font-normal text-helper"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <Popover
        modal={true}
        open={open}
        onOpenChange={(val) => {
          setOpen(val);

          if (!val && isFormContext) {
            onBlur({ target: { name, value }, type: "blur" });
          }
        }}
      >
        <div
          className={cn("rounded-sm", {
            "bg-tertiary-gradient p-[1px]": open,
          })}
        >
          <PopoverTrigger asChild>
            <Button
              id={name || "select-input"}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              name={name}
              className={cn("rounded-sm", selectVariants({ size }), {
                "border-destructive": error,
              })}
              data-ref={`${componentDataRef}.trigger`}
              disabled={disabled}
            >
              <span
                className={cn(
                  "truncate",
                  !value && "text-text-primary font-red-display"
                )}
                data-ref={`${componentDataRef}.selected-value`}
              >
                {fieldValue}
              </span>
              <span className="w-4 h-4">
                {open ? (
                  <IoChevronUpSharp
                    className="shrink-0 text-primary text-sm"
                    data-ref={`${componentDataRef}.chevron-icon`}
                  />
                ) : (
                  <IoChevronDownSharp
                    className="shrink-0 text-primary text-sm"
                    data-ref={`${componentDataRef}.chevron-icon`}
                  />
                )}
                {/* <ChevronDown
                size={16}
                strokeWidth={2}
                className='shrink-0 text-primary'
                aria-hidden='true'
                data-ref={`${componentDataRef}.chevron-icon`}
              /> */}
              </span>
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          className={`w-full min-w-[var(--radix-popper-anchor-width)] p-0 z-[301] ${removePortal} ${addPortal}`}
          align="start"
          data-ref={`${componentDataRef}.popover-content`}
        >
          <Command>
            <CommandInput
              onChangeCapture={(e: any) => {
                setSearchTerm(e.target.value);
              }}
              value={searchTerm}
              placeholder="Search option"
              data-ref={`${componentDataRef}.search-input`}
            />
            <CommandList data-ref={`${componentDataRef}.command-list`}>
              {/* {isPending ? (
                <CommandEmpty>
                  <div className='text-center text-sm text-text-secondary py-2'>
                    Loading...
                  </div>
                </CommandEmpty>
              ) : (
                <CommandEmpty>No option found.</CommandEmpty>
              )} */}
              <CommandEmpty>
                {fetchedOptions.length === 0 ? "No option found." : null}
              </CommandEmpty>

              <CommandGroup>
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      key={fetchedOptions.length}
                      ref={listRef}
                      height={250}
                      itemCount={fetchedOptions.length}
                      itemSize={getItemSize}
                      width={width}
                      onItemsRendered={({ visibleStopIndex: stopIndex }) => {
                        if (
                          (stopIndex + 1) % 50 === 0 &&
                          stopIndex > 0 &&
                          serverSide
                        ) {
                          setPagination((prev) => ({
                            ...prev,
                            page: (stopIndex + 1) / 50,
                          }));
                        }
                      }}
                    >
                      {({ index, style }) => {
                        let option = fetchedOptions[index];
                        let label = getOptionLabel(option);
                        return (
                          <CommandItem
                            key={index + label}
                            style={style}
                            value={JSON.stringify(option)}
                            className="cursor-pointer !hover:bg-background hover:font-semibold mb-1"
                            onSelect={() => handleValueChange(option)}
                            data-ref={`${componentDataRef}.option.${label}`}
                          >
                            {label}
                            <Check
                              className={cn(
                                "ml-auto",
                                JSON.stringify(value) === JSON.stringify(option)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                              data-ref={`${componentDataRef}.option-check.${label}`}
                            />
                          </CommandItem>
                        );
                      }}
                    </List>
                  )}
                </AutoSizer>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {(error || helpText) && (
        <HelpText dataRef={`${componentDataRef}`} error={!!error}>
          {error ? error?.message : helpText}
        </HelpText>
      )}
    </div>
  );
}
