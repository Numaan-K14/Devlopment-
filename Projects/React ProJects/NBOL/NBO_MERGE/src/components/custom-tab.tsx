import { Tabs } from "@radix-ui/react-tabs";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { TabsList, TabsTrigger } from "./ui/tabs";

const CustomTab = ({
  tabs,
  className,
  value,
  setValue,
}: {
  tabs: { label: string; value: number | string }[];
  className?: string;
  setValue: React.Dispatch<React.SetStateAction<number | string>>;
  value: any;
}) => {
  return (
    <Tabs value={value} onValueChange={setValue} className={` ${className}`}>
      <ScrollArea className='max-w-full whitespace-nowrap'>
        {/* <TabsList className='bg-[#EFF4FF] !rounded-[8.91px] !h-[40px] mx-auto '>
          {tabs.map((item) => (
            <TabsTrigger key={item.value} value={String(item.value)}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList> */}
        <TabsList
          className='
    bg-white
    rounded-[10px]
    h-[46px]
    p-1
    w-full
    flex
    items-center
    justify-between
    shadow-sm
    mx-auto
  '
        >
          {tabs.map((item) => (
            <TabsTrigger
              key={item.value}
              value={String(item.value)}
              className='
        data-[state=active]:bg-[#F7F8FD]
    data-[state=active]:text-[#4D4D4D]
    data-[state=active]:shadow-[0px_1px_4px_rgba(0,0,0,0.30)]
    data-[state=active]:rounded-[8px]

    text-[#6B7280]
    font-medium
    px-6
    h-[38px]
    transition-all
    duration-200
    text-center
    whitespace-nowrap  
      '
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>
    </Tabs>
  );
};

export default CustomTab;
