import { ArrowUpRight } from "lucide-react";

export function Cards({ label, count, per }) {
     return (
    <>
      <div className="w-full border border-[#E9EAEB] rounded-lg px-5 pt-5 pb-10 bg-white">
        <img src="icons/Dash.png" className="pb-5" />
        <p className="font-medium text-sm leading-5 text-[#535862] pb-3">
          {label}
        </p>
        <div className="flex justify-between">
          <p className="text-[#181D27] text-4xl font-semibold leading-5">
            {count}
          </p>
          <span className="border border-[#D5D7DA] px-1.5 flex  items-center gap-1 rounded-md">
            <ArrowUpRight
              color="#17b26a"
              strokeWidth={2.75}
              className="h-3 w-3"
            />
            <p className="text-[#414651] font-medium leading-5 text-sm">
              {per}%
            </p>
          </span>
        </div>
      </div>
    </>
  );
}
