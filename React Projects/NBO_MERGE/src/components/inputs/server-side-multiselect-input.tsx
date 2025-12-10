"use client";

import { axios } from "@/config";
import { useGetDataRef } from "@/hooks";
import { cn, getValueByKey } from "@/lib";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cva } from "class-variance-authority";
import { CheckIcon, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { Separator } from "../ui";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { HelpText } from "./help-text";

const selectVariants = cva(
  "w-full justify-between bg-background font-normal text-active text-sm md:text-lg hover:bg-background my-0",
  {
    variants: {
      size: {
        sm: "px-[10px] py-[9px] [&_span]:text-sm",
        lg: "px-4 py-[17px] h-[52px]",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

const defaultGetOptionLabel = (option: any) => option?.label;
const defaultIsOptionEqualToValue = (option: any, values: any) =>
  JSON.stringify(values).includes(JSON.stringify(option));

export function MultiSelectInputServerSide({
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
  //   containerId,
  getOptionLabel = defaultGetOptionLabel,
  isReadOnly = false,
  modalPopover = true,
  apiUrl,
  serverSide = false,
  badgeClassName,
  isOptionEqualToValue = defaultIsOptionEqualToValue as (
    option: any,
    values: any,
  ) => boolean,
  ...props
}: {
  name: string;
  options: any[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  dataRef?: string;
  className?: string;
  containerId?: string;
  helpText?: string;
  onValueChange?: (value: any) => void;
  size?: "sm" | "lg";
  getOptionLabel?: (option: any) => string;
  isReadOnly?: boolean;
  modalPopover?: boolean;
  apiUrl?: string;
  serverSide?: boolean;
  badgeClassName?: string;
  isOptionEqualToValue?: (option: any, values: any) => boolean;
  [key: string]: any;
}) {
  //   const componentDataRef: string = useGetDataRef(
  //     dataRef,
  //     name,
  //     'components.select-input',
  //   );

  const componentDataRef: string = useGetDataRef(
    dataRef,
    name,
    "components.select-input",
  );
  const [open, setOpen] = useState<boolean>(false);
  const formContext = useFormContext();
  const isFormContext = !!formContext && !!name;
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const error = isFormContext
    ? (getValueByKey(errors, name) as FieldError | undefined)
    : undefined;
  const value = watch(name);
  const { onBlur, disabled, ref } = register(name, { required });

  //   const fieldValue = useMemo(() => {
  //     return value ? getOptionLabel(value) : placeholder;
  //   }, [value, options, placeholder, getOptionLabel]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fetchedOptions, setFetchedOptions] = useState<any[]>(options);
  const [_loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 50,
  });
  const values: any = watch(name) || [];

  //   const filteredOptions = useMemo(() => {
  //     return !searchTerm
  //       ? options
  //       : options.filter((option) =>
  //           getOptionLabel(option)
  //             .toLowerCase()
  //             .includes(searchTerm.toLowerCase()),
  //         );
  //   }, [options, searchTerm, getOptionLabel]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const q = encodeURIComponent(searchTerm);
      const limit = pagination.limit;
      const page = pagination.page;

      if (serverSide && apiUrl) {
        const endpoint = apiUrl.includes("?")
          ? `${apiUrl}&q=${q}&limit=${limit}&pg=${page}`
          : `${apiUrl}?q=${q}&limit=${limit}&pg=${page}`;

        setLoading(true);
        axios
          .get(endpoint)
          .then((res: any) => {
            if (page === 0) {
              setFetchedOptions(res || []);
            } else {
              setFetchedOptions((prev) => [...prev, ...(res || [])]);
            }
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
                .includes(searchTerm.toLowerCase()),
            );
        setFetchedOptions(filtered);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [
    searchTerm,
    apiUrl,
    pagination.page,
    pagination.limit,
    // options,
    // getOptionLabel,
    serverSide,
  ]);

  const parentRef = useRef<any>(null);
  const virtualizer = useVirtualizer({
    count: fetchedOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();
  const height = virtualizer.getTotalSize();

  // Debounced measurement to prevent rapid ResizeObserver calls
  const measureTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (open) {
      if (measureTimeoutRef.current) {
        clearTimeout(measureTimeoutRef.current);
      }
      measureTimeoutRef.current = setTimeout(() => {
        virtualizer.measure();
      }, 100);
    }
    return () => {
      if (measureTimeoutRef.current) {
        clearTimeout(measureTimeoutRef.current);
      }
    };
  }, [open, virtualizer]);

  if (isReadOnly) {
    return (
      <div
        className={cn(
          "sm:border-l border-l-zinc-100 sm:pl-6 min-h-12",
          className,
        )}
      >
        <label className='text-sm font-semibold text-zinc-700 whitespace-nowrap'>
          {label}
        </label>
        <p className='text-sm text-zinc-500 font-medium'>
          {getOptionLabel(value) || "-"}
        </p>
      </div>
    );
  }

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 0,
    }));
  }, [searchTerm]);

  useEffect(() => {
    const lastItem = items[items.length - 1];
    if (!lastItem) return;
    const isEndReached =
      lastItem.index >= fetchedOptions.length - 1 &&
      fetchedOptions.length >= pagination.limit &&
      !isReadOnly &&
      !searchTerm &&
      serverSide &&
      (lastItem.index + 1) % 50 === 0;

    if (isEndReached) {
      setPagination((prev) => ({
        ...prev,
        page: (lastItem.index + 1) / 50,
      }));
    }
  }, [
    items,
    fetchedOptions.length,
    pagination.limit,
    isReadOnly,
    searchTerm,
    serverSide,
  ]);

  const toggleOption = (value: any) => {
    //  isOptionEqualToValue
    //   ? isOptionEqualToValue(option, value)
    //   :
    const isAlreadySelected = values?.some((option: any) =>
      typeof option === "string" ? option === value : option?.id === value?.id,
    );

    const newSelectedValues = isAlreadySelected
      ? values.filter((option: any) => option?.id !== value?.id)
      : [...values, value];

    setValue(name, newSelectedValues, { shouldValidate: true });
  };

  const toggleAll = () => {
    if (values.length === fetchedOptions.length) {
      handleClear();
    } else {
      setValue(name, fetchedOptions, { shouldValidate: true });
    }
  };

  const handleClear = () => {
    console.log("sime ay a");
    setValue(name, [], { shouldValidate: true });
  };

  return (
    <div
      className={cn("relative", className)}
      data-ref={`${componentDataRef}.container`}
      ref={ref}
    >
      {label && (
        <label
          data-ref={`${componentDataRef}label`}
          htmlFor={name}
          className='block mb-1.5 bg-background px-1 text-sm leading-5 font-normal text-helper'
        >
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </label>
      )}
      <Popover
        open={open}
        modal={modalPopover}
        onOpenChange={(val) => {
          setOpen(val);

          if (!val) {
            onBlur({ target: { name, value }, type: "blur" });
          }
        }}
      >
        <div
          className={cn("rounded-sm max-h-[80px] overflow-auto ", {
            "bg-tertiary-gradient p-[1px]": open,
          })}
        >
          <PopoverTrigger asChild>
            <Button
              {...props}
              disabled={disabled}
              variant='outline'
              data-ref={`${componentDataRef}.component.multi-select.trigger`}
              id={name || "multi-select-input"}
              className={cn(
                "rounded-sm !h-full",
                selectVariants({ size: "lg" }),
                {
                  "border-destructive": error,
                  "bg-gray-50": disabled,
                },
              )}
            >
              {values && values.length > 0 ? (
                <div className='flex justify-between items-center w-full'>
                  <div className='flex flex-wrap items-center gap-1'>
                    {values.map((option: any) => {
                      const value = getOptionLabel(option);
                      return (
                        <div
                          key={value}
                          className={cn(
                            "animate-fadeIn relative inline-flex h-7 cursor-default items-center rounded-full border border-solid border-primary bg-primary-p0 font-red-display font-semibold pe-7 px-3 text-xs text-destructive transition-all hover:bg-background disabled:cursor-not-allowed disabled:opacity-50 data-[fixed]:pe-2",
                            badgeClassName,
                          )}
                          data-ref={`${componentDataRef}.selected-option.${value}`}
                        >
                          {value}
                          <div
                            className='absolute cursor-pointer -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-lg border border-transparent p-0 text-muted-foreground/80 ring-offset-background transition-colors hover:text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2'
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                toggleOption(option);
                              }
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={() => toggleOption(option)}
                            aria-label='Remove'
                            data-ref={`${componentDataRef}.remove-button.${value}`}
                          >
                            <MdClose
                              size={18}
                              color='var(--primary)'
                              aria-hidden='true'
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className='flex items-center justify-between'>
                    <Separator
                      orientation='vertical'
                      className='flex min-h-6 h-full'
                    />
                    <ChevronDown className='h-4 mx-2 cursor-pointer text-muted-foreground' />
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-between w-full'>
                  <span className='text-lg text-gray-300 truncate'>
                    {placeholder}
                  </span>
                  <ChevronDown className='h-4 cursor-pointer text-muted-foreground mx-2' />
                </div>
              )}
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          className='w-full min-w-[var(--radix-popper-anchor-width)] p-0 z-[401]'
          align='start'
          data-ref={`${componentDataRef}.popover-content`}
        >

          <input
            className='w-full rounded-t-md bg-background z-10 outline-none ring-0 border-b border-zinc-200 px-3 py-2 shadow-none text-zinc-600'
            placeholder='Search...'
            onChangeCapture={(e: any) => {
              setSearchTerm(e.target.value);
            }}
            data-ref={`${componentDataRef}.search-input`}
            value={searchTerm}
          />

          {true && (
            <div
              key='all'
              onClick={toggleAll}
              className='cursor-pointer flex justify-start items-center w-full h-9 px-4 hover:bg-gray-100'
            >
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-[3px] border border-primary",
                  values.length === fetchedOptions.length
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible",
                )}
              >
                <CheckIcon color='white' className='h-3 w-3' />
              </div>
              <span>(Select All)</span>
            </div>
          )}

          <div
            style={{
              contain: "strict",
              height: height > 300 ? 300 : height + 10,
              width: "100%",
              overflowY: "auto",
            }}
            ref={parentRef}
          >
            <div
              style={{
                height: virtualizer.getTotalSize(),
                width: "100%",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${items[0]?.start ?? 0}px)`,
                }}
                className='p-1 z-[9] w-full'
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  let option = fetchedOptions[virtualRow.index];
                  const label = getOptionLabel(option);
                  const isSelected = isOptionEqualToValue(option, values);
                  return (
                    <div
                      onClick={() => {
                        toggleOption(option);
                      }}
                      data-ref={`${componentDataRef}.option.${label}`}
                      className='cursor-pointer flex  items-center w-full hover:bg-gray-100 px-3'
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={virtualizer.measureElement}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-[3px] border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <CheckIcon color='white' className='h-3 w-3' />
                      </div>
                      <div
                        className={
                          "relative flex select-none items-center justify-between w-full text-zinc-500 font-medium rounded-sm px-2 py-1.5 text-sm text cursor-pointer "
                        }
                      >
                        <div>{label}</div>
                        {/* <Check
                          className={cn(
                            "ml-auto",
                            JSON.stringify(value) === JSON.stringify(option)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                          data-ref={`${componentDataRef}.option-check.${label}`}
                        /> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <>
              <Button
                onClick={handleClear}
                variant='outline'
                size='sm'
                className='flex-1 justify-center cursor-pointer'
              >
                Clear
              </Button>
              <Separator
                orientation='vertical'
                className='flex min-h-6 h-full'
              />
            </>

            <Button
              variant='outline'
              size='sm'
              className='flex-1 justify-center cursor-pointer'
              onClick={() => setOpen(false)}
              // className='flex-1 justify-center cursor-pointer max-w-full'
            >
              Close
            </Button>
          </div>
          {/* </CommandGroup> */}
          {/* <CommandSeparator /> */}
          {/*               </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                
              </CommandGroup>
                  </>

                )
              }
            </CommandList>
          </Command> */}
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
