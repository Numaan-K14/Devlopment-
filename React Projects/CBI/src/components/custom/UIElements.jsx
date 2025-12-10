import { LuCloudUpload } from "react-icons/lu";

export function Uploadbtn({ label, onClick }) {
  return (
    <>
      <div className="px-6">
        <button
          onClick={onClick}
          className="bg-[#0b2e79] text-white text-sm font-semibold leading-5 py-2 px-6 flex gap-2 items-center rounded-md focus:ring-2 focus:ring-[#04173f] hover:bg-[#04173f] cursor-pointer"
        >
          <LuCloudUpload className="text-white h-4 w-4 " />
          {label}
        </button>
      </div>
    </>
  );
}

export function ParticipantCount({ label, count }) {
  return (
    <>
      <div className="flex flex-row items-center gap-2 py-5 px-6">
        <h1 className="font-medium text-lg text-[#181D27]">{label}</h1>

        <span className="bg-[#D8E7FC] text-[#1F4B9E] rounded-full px-2 py-1 text-lg font-semibold leading-4">
          {count}
        </span>
      </div>
    </>
  );
}

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    ></Button>
  );
}
