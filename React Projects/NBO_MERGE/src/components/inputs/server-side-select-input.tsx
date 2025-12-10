"use client";

import { axios } from "@/config";
import { useGetDataRef } from "@/hooks";
import { cn, getValueByKey } from "@/lib";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cva } from "class-variance-authority";
import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FieldError, useFormContext } from "react-hook-form";
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

export function SelectInputServerSide({
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
  isOptionDisabled,
  disabled: disabledProp = false,
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
  isOptionDisabled?: (option: any) => boolean;
  disabled?: boolean;
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
  const { onBlur, disabled: fieldDisabled, ref } = register(name, { required });
  const disabled = disabledProp || fieldDisabled;

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
              setFetchedOptions(Array.isArray(res) ? res : res?.data || []);
            } else {
              setFetchedOptions((prev) => [
                ...prev,
                ...(Array.isArray(res) ? res : res?.data || []),
              ]);
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

    // console.log(lastItem.index,"kakakaka",height)

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

  return (
    <div
      className={cn("relative", { "mt-4": !!label }, className)}
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
          className={cn("rounded-sm", {
            "bg-tertiary-gradient p-[1px]": open,
          })}
        >
          <PopoverTrigger asChild>
            <Button
              id={name}
              variant='outline'
              role='combobox'
              aria-expanded={open}
              name={name}
              className={cn(
                "rounded-sm relative max-md:gap-1",
                selectVariants({ size }),
                {
                  "border-destructive": error,
                },
              )}
              data-ref={`${componentDataRef}.trigger`}
              disabled={disabled}
            >
              <span
                className={cn("truncate", !value && "text-gray-300")}
                data-ref={`${componentDataRef}.selected-value`}
              >
                {fieldValue}
              </span>

              <span className='inline-flex items-center gap-1 md:gap-1.5'>
                {value && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setValue(name, null, { shouldValidate: true });
                      onValueChange && onValueChange(null);
                    }}
                    className='rounded-sm p-0 text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer'
                    // className='absolute right-10 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  >
                    <X className='h-3 w-3' />
                  </div>
                )}
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className='shrink-0 text-muted-foreground/80'
                  aria-hidden='true'
                  data-ref={`${componentDataRef}.chevron-icon`}
                />
              </span>
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          //   containerId={containerId}
          className='w-full min-w-[var(--radix-popper-anchor-width)] p-0 z-[401]'
          align='start'
          data-ref={`${componentDataRef}.popover-content`}
        >
          {/* {options.length > 10 && ( */}
          <input
            className='w-full rounded-t-md bg-background z-10 outline-none ring-0 border-b border-zinc-200 px-3 py-2 shadow-none text-zinc-600'
            placeholder='Search...'
            onChangeCapture={(e: any) => {
              setSearchTerm(e.target.value);
            }}
            data-ref={`${componentDataRef}.search-input`}
            value={searchTerm}
          />
          {/* )} */}
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
                className='p-1 z-[9]'
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  let option = fetchedOptions[virtualRow.index];
                  const label = getOptionLabel(option);
                  const optionIsDisabled = Boolean(isOptionDisabled?.(option));

                  return (
                    <div
                      onClick={() => {
                        if (optionIsDisabled) return;
                        setValue(name, option, { shouldValidate: true });
                        onValueChange && onValueChange(option);
                        setOpen(false);
                      }}
                      data-ref={`${componentDataRef}.option.${label}`}
                      className={cn(
                        "cursor-pointer",
                        optionIsDisabled && "opacity-50 pointer-events-none",
                      )}
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={virtualizer.measureElement}
                    >
                      <div
                        className={
                          "relative flex select-none items-center justify-between  text-zinc-500 font-medium rounded-sm px-2 py-1.5 text-sm text cursor-pointer hover:bg-gray-100"
                        }
                      >
                        <div>{label}</div>
                        <Check
                          className={cn(
                            "ml-auto",
                            JSON.stringify(value) === JSON.stringify(option)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                          data-ref={`${componentDataRef}.option-check.${label}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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
