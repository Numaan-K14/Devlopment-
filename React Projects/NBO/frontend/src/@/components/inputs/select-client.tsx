import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@/hooks/useQuerry";

import { useEffect, useState } from "react";
import { Autocomplete } from "./auto-complete";

const SelectCommonOptions = ({
  handleChange,
  className,
  required,
  localStorageName = "client",
  url = "/client/getall-clients",
  handleDataChange,
  disabled,
  onOptionsLoaded,
}: {
  handleChange?: any;
  className?: string;
  localStorageName?: string;
  required?: any;
  url?: string;
  handleDataChange?: any;
  disabled?: boolean;
  onOptionsLoaded?: (options: any[]) => void;
}) => {
  const IsMobile = useIsMobile();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const { data: options } = useQuery<any[]>({
    queryKey: [url],
    select: (data: any) => data?.data?.data?.rows,
    staleTime: 60 * 9000,
    enabled: !!url,
  });

  useEffect(() => {
    if (options && onOptionsLoaded) {
      onOptionsLoaded(options);
    }
  }, [options]);

  // useEffect(() => {
  //   const stored = localStorage.getItem(localStorageName);
  //   console.log(stored, "<----------- stored");
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       const match = options?.find((opt) => opt.id === parsed?.id);
  //       if (match) {
  //         setSelectedItem(match);
  //         handleChange?.(match);
  //         handleDataChange?.(match);
  //       }
  //     } catch (err) {
  //       console.error("Failed to parse localStorage item", err);
  //     }
  //   } else {
  //     console.log("object");
  //     setSelectedItem(null);
  //   }
  // }, [options]);
  useEffect(() => {
    const stored = localStorage.getItem(localStorageName);
    if (!stored) {
      setSelectedItem(null);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const match = options?.find((opt) => opt.id === parsed?.id);
      if (match) {
        setSelectedItem(match);
        handleChange?.(match);
        handleDataChange?.(match);
      }
    } catch (err) {
      console.error("Failed to parse localStorage item", err);
      setSelectedItem(null);
    }
  }, [options, localStorageName]);

  const handleSelectChange = (item: any | null) => {
    setSelectedItem(item);
    localStorage.setItem(localStorageName, JSON.stringify(item));
    handleChange?.(item);
    handleDataChange?.(item);
  };

  return (
    <div>
      <Autocomplete
        required={required}
        disabled={disabled}
        className={
          IsMobile
            ? `!w-[350px] h-[44px] ${className}`
            : `w-[475.33px] h-[44px] border-[#D5D7DA] shadow-[rgba(10,13,18,0.05)] ${className}`
        }
        label={
          localStorageName === "project"
            ? "Select Project"
            : localStorageName === "leadership-level"
              ? "NBO Leadership level"
              : localStorageName === "cohort"
                ? "Select Cohort"
                : "Select Client"
        }
        options={options || []}
        getOptionLabel={(item: any) =>
          localStorageName === "project"
            ? item?.project_name || item?.name
            : localStorageName === "client"
              ? item?.client_name || item?.nbol_client_name
              : localStorageName === "cohort"
                ? item?.cohort_name
                : localStorageName === "leadership-level"
                  ? item?.leadership_level
                  : item?.cohort_name
        }
        getOptionValue={(item) => item?.id}
        onChange={handleSelectChange}
        value={selectedItem}
      />
      {/* <CustomSelect
        required={required}
        disabled={disabled}
        className={
          IsMobile
            ? `!w-[350px] h-[48px] ${className}`
            : `w-[494.33px] h-[48px] ${className}`
        }
        label={
          localStorageName === "project"
            ? "Select Project"
            : localStorageName === "leadership-level"
              ? "NBO Leadership level"
              : localStorageName === "cohort"
                ? "Select Cohort"
                : "Select Client"
        }
        options={options || []}
        getOptionLabel={(item: any) =>
          localStorageName === "project"
            ? item?.project_name || item?.name
            : localStorageName === "client"
              ? item?.client_name || item?.nbol_client_name
              : localStorageName === "cohort"
                ? item?.cohort_name
                : localStorageName === "leadership-level"
                  ? item?.leadership_level
                  : item?.cohort_name
        }
        getOptionValue={(item) => item?.id}
        onChange={handleSelectChange}
        value={selectedItem}
      /> */}
    </div>
  );
};

export default SelectCommonOptions;
