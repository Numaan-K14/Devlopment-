import { useGetDataRef } from "@/hooks";
import { cn, getValueByKey } from "@/lib";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDown } from "lucide-react";
import * as React from "react";
import { List } from "react-virtualized";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

import { FieldError, useFormContext } from "react-hook-form";

import { axios } from "@/config";
import { MdClose } from "react-icons/md";
import { HelpText } from "./help-text";

const selectVariants = cva(
  "w-full justify-between bg-background font-normal text-active text-lg hover:bg-background my-0",
  {
    variants: {
      size: {
        sm: "px-3",
        lg: "px-4 py-3 min-h-[52px] h-auto",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: any[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;
  label?: string;
  required?: boolean;
  dataRef?: string;
  helpText?: string;
  name: string;
  badgeClassName?: string;
  hideSelectAll?: boolean;
  serverSide?: boolean;
  getOptionLabel?: (option: any) => string;
  getSelctedOption?: (option: any) => string;
  isOptionEqualToValue?: (option: any, value: any) => boolean;
  onBlur?: (_: any) => void;
  apiUrl?: string | undefined;
}

const defaultGetOptionLabel = (option: any) => option.label;
const defaultGetSelctedOption = (option: any) => option.value;
const defaultIsOptionEqualToValue = (option: any, values: any) =>
  JSON.stringify(values).includes(JSON.stringify(option));

export const MultiSelect = ({
  options,
  variant,
  defaultValue = [],
  placeholder = "Select options",
  animation = 0,
  maxCount = 3,
  modalPopover = true,
  asChild = false,
  className,
  label,
  required,
  dataRef,
  helpText,
  name,
  badgeClassName,
  hideSelectAll = false,
  apiUrl,
  serverSide = false,
  getOptionLabel = defaultGetOptionLabel as (option: any) => string,
  getSelctedOption = defaultGetSelctedOption as (option: any) => string,
  isOptionEqualToValue = defaultIsOptionEqualToValue as (
    option: any,
    values: any,
  ) => boolean,
  onBlur: OnInputBlur,
  ...props
}: MultiSelectProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext(); // Access the react-hook-form context
  const values: any = watch(name) || [];
  // const stringifiedValue: string = JSON.stringify(values) || "";

  const { onBlur, disabled } = register(name, { required });
  const [pagination, setPagination] = React.useState({
    page: 0,
    limit: 50,
  });

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsPopoverOpen(true);
    } else if (event.key === "Backspace" && !event.currentTarget.value) {
      const newSelectedValues = [...values];
      newSelectedValues.pop();
      setValue(name, newSelectedValues, { shouldValidate: true });
    }
  };

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

  // const toggleOption = (value: any) => {
  //   const newSelectedValues = stringifiedValue.includes(JSON.stringify(value))
  //     ? values.filter((option: any) => {
  //         return getSelctedOption(option) !== getSelctedOption(value);
  //       })
  //     : [...values, value];

  //   setValue(name, newSelectedValues, { shouldValidate: true });
  // };

  const handleClear = () => {
    setValue(name, [], { shouldValidate: true });
  };

  const toggleAll = () => {
    if (values.length === fetchedOptions.length) {
      handleClear();
    } else {
      setValue(name, fetchedOptions, { shouldValidate: true });
    }
  };

  const componentDataRef: string = useGetDataRef(
    dataRef,
    name,
    "components.multiple-select-input",
  );

  const error = getValueByKey(errors, name) as FieldError | undefined;

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [fetchedOptions, setFetchedOptions] = React.useState<any[]>(options);
  const [_loading, setLoading] = React.useState(false);

  // const filteredOptions = React.useMemo(() => {
  //   return !searchTerm
  //     ? options
  //     : options.filter((option) =>
  //         getOptionLabel(option)
  //           .toLowerCase()
  //           .includes(searchTerm.toLowerCase()),
  //       );
  // }, [options, searchTerm, getOptionLabel]);

  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (serverSide && apiUrl && searchTerm) {
        console.log("2nd if");
        setLoading(true);
        axios
          .get(
            `${apiUrl}?q=${encodeURIComponent(searchTerm)}${"&limit=50&pg=0"}`,
          )
          .then((res: any) => {
            console.log(res, "auuuuuuuuuuuuuuuu");
            setFetchedOptions(res || []);
          })
          .catch((err) => {
            console.error("Error fetching options:", err);
            setFetchedOptions([]);
          })
          .finally(() => setLoading(false));
      } else if (serverSide && apiUrl && pagination.page > 0) {
        console.log("1st if");
        setLoading(true);
        axios
          .get(
            `${apiUrl}?q=${encodeURIComponent(searchTerm)}${"&limit=" + pagination.limit + "&pg=" + pagination.page}`,
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
                .includes(searchTerm.toLowerCase()),
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

  const listRef = React.useRef<any>(null);

  const getItemSize = ({ index }: { index: number }) => {
    let option = fetchedOptions[index];
    let label = getOptionLabel(option);
    let rowHeight = (label?.length / 35) * 35;
    return rowHeight < 35 ? 35 : rowHeight;
  };

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label
          data-ref={`${componentDataRef}.label`}
          htmlFor={name}
          className='block mb-1.5 bg-background px-1 text-sm leading-5 font-normal text-helper'
        >
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </label>
      )}
      <Popover
        open={isPopoverOpen}
        onOpenChange={(val) => {
          setIsPopoverOpen(val);

          if (!val) {
            onBlur({ target: { name, value: values }, type: "blur" });
            OnInputBlur?.({ target: { name, value: values }, type: "blur" });
          }
        }}
        modal={modalPopover}
      >
        {" "}
        <div
          className={cn("rounded-sm max-h-[80px] overflow-auto", {
            "bg-tertiary-gradient p-[1px]": isPopoverOpen,
          })}
        >
          <PopoverTrigger asChild>
            <Button
              {...props}
              disabled={disabled}
              // onClick={handleTogglePopover}
              variant='outline'
              data-ref={`${componentDataRef}.component.multi-select.trigger`}
              id={name || "multi-select-input"}
              className={cn("rounded-sm", selectVariants({ size: "lg" }), {
                "border-destructive": error,
                "bg-gray-50": disabled,
              })}
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
          className='w-auto p-0'
          align='start'
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandInput
              placeholder='Search...'
              onKeyDown={handleInputKeyDown}
              onChangeCapture={(e: any) => {
                setSearchTerm(e.target.value);
              }}
              value={searchTerm}
            />
            <CommandList>
              {fetchedOptions.length === 0 ? (
                <CommandEmpty>
                  No results found. {fetchedOptions.length}
                </CommandEmpty>
              ) : (
                <>
                  <CommandGroup>
                    {!hideSelectAll && (
                      <CommandItem
                        key='all'
                        onSelect={toggleAll}
                        className='cursor-pointer'
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
                      </CommandItem>
                    )}

                    <List
                      ref={listRef}
                      height={200}
                      rowCount={fetchedOptions.length}
                      rowHeight={getItemSize}
                      width={300}
                      onRowsRendered={({ stopIndex }) => {
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
                      rowRenderer={({ index, key, style }) => {
                        let option = fetchedOptions[index];
                        const isSelected = isOptionEqualToValue(option, values);
                        // const isSelected = stringifiedValue.includes(JSON.stringify(option));
                        const label = getOptionLabel(option);
                        return (
                          <CommandItem
                            style={style}
                            // key={option?.id ? option.id : key}
                            key={key}
                            onSelect={() => toggleOption(option)}
                            className='cursor-pointer hover:bg-inherit hover:font-semibold'
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
                            <span>{label}</span>
                          </CommandItem>
                        );
                      }}
                    ></List>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <div className='flex items-center justify-between'>
                      {values.length > 0 && (
                        <>
                          <CommandItem
                            onSelect={handleClear}
                            className='flex-1 justify-center cursor-pointer'
                          >
                            Clear
                          </CommandItem>
                          <Separator
                            orientation='vertical'
                            className='flex min-h-6 h-full'
                          />
                        </>
                      )}
                      <CommandItem
                        onSelect={() => setIsPopoverOpen(false)}
                        className='flex-1 justify-center cursor-pointer max-w-full'
                      >
                        Close
                      </CommandItem>
                    </div>
                  </CommandGroup>
                </>
              )}
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
};
