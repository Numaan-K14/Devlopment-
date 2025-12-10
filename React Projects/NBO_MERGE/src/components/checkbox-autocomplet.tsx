// import { useField } from "formik";
// import { ChevronDown } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Label } from "./label";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { Checkbox } from "./ui/checkbox";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// interface CheckBoxAutocompleteProps {
//   name: string;
//   label?: string;
//   className?: string;
//   levels: any[];
//   onChange?: any;
//   required?: boolean;
//   defaultValue?: any[];
//   value?: any[];
//   disabled?: boolean;
// }
// export default function CheckBoxAutocomplete({
//   name,
//   label,
//   className,
//   levels,
//   onChange,
//   required,
//   defaultValue,
//   value,
//   disabled = false,
// }: CheckBoxAutocompleteProps) {
//   const [open, setOpen] = useState(false);
//   const [field, meta, helpers] = useField<any[]>(name);

//   const toggleLevel = (level: any) => {
//     const currentValue = field.value || [];

//     const isAlreadySelected = currentValue.some((item) => item.id === level.id);
//     const updatedValue = isAlreadySelected
//       ? currentValue.filter((item) => item.id !== level.id)
//       : [...currentValue, level];

//     helpers.setValue(updatedValue);
//     if (onChange) {
//       onChange(updatedValue);
//     }
//   };

//   const allSelected =
//     levels.length > 0 && field.value?.length === levels.length;

//   const toggleSelectAll = () => {
//     if (allSelected) {
//       helpers.setValue([]);
//       if (onChange) onChange([]);
//     } else {
//       helpers.setValue(levels);
//       if (onChange) onChange(levels);
//     }
//   };

//   const isSelected = (level: any) => {
//     return (field?.value || []).some((item) =>
//       item?.assoc_comp ? item?.assoc_comp === level.id : item.id === level.id,
//     );
//   };

//   useEffect(() => {
//     if (
//       (!field.value || field.value.length === 0) &&
//       defaultValue &&
//       defaultValue?.length > 0
//     ) {
//       if (onChange) {
//         onChange(defaultValue);
//       }
//     }
//   }, [defaultValue]);

//   return (
//     <div className='flex flex-col  !h-[46px] !rounded-[5px]'>
//       {label && <Label required={required}>{label}</Label>}
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger className=' !h-[46px]' asChild>
//           <Button
//             variant='outline'
//             className={`w-full justify-between !min-h-[48px] flex-wrap   !rounded-[5px] p-2 ${
//               meta.error && meta.touched ? "border-red-500" : ""
//             } ${className}`}
//             disabled={disabled}
//           >
//             {field?.value?.length > 0 ? (
//               <div className='flex overflow-x-auto no-scrollbar items-center gap-1'>
//                 {field.value.map((item) => (
//                   <Badge
//                     key={item.id}
//                     variant='default'
//                     className='mx-1 !h-[29px] rounded-sm py-1 flex items-center gap-1'
//                   >
//                     {item.label ||
//                       item.competency ||
//                       item.assessor_name ||
//                       item.participant_name ||
//                       item?.client_name ||
//                       item?.assoc_client?.client_name ||
//                       item?.assessment?.assessment_name ||
//                       item}
//                     <button
//                       type='button'
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleLevel(item);
//                       }}
//                       className='ml-1 text-[#008000] hover:text-red-600'
//                     >
//                       ✕
//                     </button>
//                   </Badge>
//                 ))}
//               </div>
//             ) : (
//               <div className='!w-full flex justify-end'>
//                 <ChevronDown className='h-4 w-4 text-black opacity-50' />
//               </div>
//             )}
//           </Button>
//         </PopoverTrigger>

//         <PopoverContent
//           className={`${className} p-2 w-full overflow-y-auto max-w-[335px] max-h-[250px] pointer-events-auto`}
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
//           <div className='flex flex-col gap-2'>
//             <div className='flex items-center gap-2 p-2 border-b border-gray-200'>
//               <Checkbox
//                 id='select-all'
//                 checked={allSelected}
//                 onCheckedChange={toggleSelectAll}
//                 className='size-4'
//               />
//               <label
//                 htmlFor='select-all'
//                 className='text-[13px] font-medium cursor-pointer'
//               >
//                 Select All
//               </label>
//             </div>

//             {levels.map((level: any) => (
//               <div key={level.id} className='flex items-center gap-2 p-2'>
//                 <Checkbox
//                   id={`level-${level.id}`}
//                   checked={isSelected(level)}
//                   onCheckedChange={() => toggleLevel(level)}
//                   className='size-4'
//                 />
//                 <label
//                   htmlFor={`level-${level.id}`}
//                   className='text-[13px] font-medium cursor-pointer'
//                 >
//                   {level.label ||
//                     level.competency ||
//                     level.assessor_name ||
//                     level.participant_name ||
//                     level?.client_name ||
//                     level?.assoc_client?.client_name ||
//                     level?.assessment?.assessment_name ||
//                     level}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </PopoverContent>
//       </Popover>
//       {meta.touched && meta.error && (
//         <p className='text-red-500 text-sm mt-1'>{meta.error}</p>
//       )}
//     </div>
//   );
// }

import { useField } from "formik";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface CheckBoxAutocompleteProps {
  name: string;
  label?: string;
  className?: string;
  levels: any[];
  onChange?: any;
  required?: boolean;
  defaultValue?: any[];
  value?: any[];
  withPortal?: boolean;
  disabled?: boolean;
  allSelect?: boolean;
}

export default function CheckBoxAutocomplete({
  name,
  // label,
  className,
  levels,
  onChange,
  // required,
  defaultValue,
  // value,
  disabled = false,
  withPortal = true,
  allSelect = false,
}: CheckBoxAutocompleteProps) {
  // console.log(levels);
  const [open, setOpen] = useState(false);
  const [field, meta, helpers] = useField<any[]>(name);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleLevel = (level: any) => {
    const currentValue = field.value || [];
    const isAlreadySelected = currentValue.some((item) => item.id === level.id);

    const updatedValue = isAlreadySelected
      ? currentValue.filter((item) => item.id !== level.id)
      : [...currentValue, level];

    helpers.setValue(updatedValue);
    if (onChange) {
      onChange(updatedValue);
    }
  };

  const allSelected =
    levels.length > 0 && field.value?.length === levels.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      helpers.setValue([]);
      if (onChange) onChange([]);
    } else {
      helpers.setValue(levels);
      if (onChange) onChange(levels);
    }
  };

  const isSelected = (level: any) => {
    return (field?.value || []).some((item) =>
      item?.assoc_comp ? item?.assoc_comp === level.id : item.id === level.id
    );
  };

  useEffect(() => {
    if (
      (!field.value || field.value.length === 0) &&
      defaultValue &&
      defaultValue?.length > 0
    ) {
      if (onChange) {
        onChange(defaultValue);
      }
    }
  }, [defaultValue]);

  useEffect(() => {
    if (allSelect && levels.length > 0 && (field.value?.length ?? 0) === 0) {
      helpers.setValue(levels);
      if (onChange) onChange(levels);
    }
  }, [allSelect, levels]);

  const filteredLevels = levels.filter((level) => {
    const text =
      level?.label ||
      level?.cohort_name ||
      level?.competency ||
      level?.assessor_name ||
      level?.participant_name ||
      level?.client_name ||
      level?.assoc_client?.client_name ||
      level?.assessment?.assessment_name ||
      level?.room ||
      String(level);

    return text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col !h-fit !rounded-[5px]">
      {/* {label && <Label required={required}>{label || ""}</Label>} */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="!h-[46px]" asChild>
          <Button
            variant="outline"
            className={`w-full border-[#D5D7DA] justify-between !min-h-[44px] flex-wrap !rounded-[5px] p-2 ${
              meta.error && meta.touched ? "border-red-500" : ""
            } ${className}`}
            disabled={disabled}
          >
            {field?.value?.length > 0 ? (
              <div className="flex overflow-x-auto no-scrollbar items-center gap-1">
                {field.value.map((item) => (
                  <Badge
                    key={item.id}
                    variant="default"
                    className="mx-1 !h-[29px] rounded-sm py-1 flex items-center gap-1"
                  >
                    {item?.label ||
                      item?.cohort_name ||
                      item?.competency ||
                      item?.assessor_name ||
                      item?.participant_name ||
                      item?.client_name ||
                      item?.assoc_client?.client_name ||
                      item?.assessment?.assessment_name ||
                      item?.room ||
                      item}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLevel(item);
                      }}
                      className="ml-1 text-[#008000] hover:text-red-600"
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="!w-full flex justify-end">
                <ChevronDown className="h-4 w-4 text-black opacity-50" />
              </div>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          withPortal={withPortal}
          className={`${className} p-2 w-full overflow-y-auto max-w-[335px] max-h-[300px] pointer-events-auto`}
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
          <div className="flex items-center gap-2 p-2 border-b border-[#D5D7DA]">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 p-2 border-b border-[#D5D7DA]">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={toggleSelectAll}
                className="size-4"
              />
              <label
                htmlFor="select-all"
                className="text-[13px] font-medium cursor-pointer"
              >
                Select All
              </label>
            </div>

            {filteredLevels.length > 0 ? (
              filteredLevels.map((level: any) => (
                <div key={level.id} className="flex items-center gap-2 p-2">
                  <Checkbox
                    id={`level-${level.id}`}
                    checked={isSelected(level)}
                    onCheckedChange={() => toggleLevel(level)}
                    className="size-4"
                  />
                  <label
                    htmlFor={`level-${level.id}`}
                    className="text-[13px] font-medium cursor-pointer"
                  >
                    {level?.label ||
                      level?.cohort_name ||
                      level?.competency ||
                      level?.assessor_name ||
                      level?.participant_name ||
                      level?.client_name ||
                      level?.assoc_client?.client_name ||
                      level?.assessment?.assessment_name ||
                      level?.room ||
                      level}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 px-2 py-4">
                No results found.
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm mt-1">{meta.error}</p>
      )}
    </div>
  );
}
