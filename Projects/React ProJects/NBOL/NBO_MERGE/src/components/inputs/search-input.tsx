import { Search } from "lucide-react";
import { Input } from "../ui/input";


export const SearchInput = (props: React.ComponentProps<"input">) => {
  return (
    <div className="relative">
      <Input placeholder="Search" className="pr-9 w-[240px]" {...props} />
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-6" />
    </div>
  );
};
