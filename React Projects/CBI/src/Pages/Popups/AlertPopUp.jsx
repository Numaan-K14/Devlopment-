import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function AlertPopUp({
  open,
  setOpen,
  DeleteIcon,
  heading,
  Paragraph,
  action,
  cancel,
  setTableData,
  deleteId,
}) {
  function HandleDelete() {
    setTableData((prev) => prev.filter((item) => item.id !== deleteId));
    setOpen(false);
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 border-none shadow-none bg-transparent">
          <div className="w-full max-w-md rounded-lg shadow-2xl p-6 bg-white">
            <img src={`/icons/${DeleteIcon}.png`} alt={`${DeleteIcon} icon`} />
            <DialogTitle className="font-semibold text-lg leading-6 text-[#181D27] mt-5">
              {heading}
            </DialogTitle>

            <p className="font-normal text-base text-[#667085] mt-1 mb-8">
              {Paragraph}
            </p>

            <div className="flex justify-between">
              {/* CLOSE POPUP */}
              <button
                className="text-[#414651] font-semibold text-base leading-4 bg-white py-2.5 px-15 border border-[#D5D7DA] rounded-lg cursor-pointer hover:bg-[#e0dddd] transition-all"
                onClick={() => setOpen(false)}
              >
                {cancel}
              </button>

              {/* ACTION BUTTON */}
              <button
                className="text-white font-semibold text-base leading-4 bg-[#D92D20] py-2.5 px-15 rounded-lg cursor-pointer hover:bg-[#df665dbb] transition-all"
                onClick={HandleDelete}
              >
                {action}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

//  if (AlertPopUp.action === "Delete")
//    return "text-white font-semibold text-base leading-4 bg-[#D92D20] py-2.5 px-15 rounded-lg cursor-pointer hover:bg-[#90b4e9] transition-all";
//  if (AlertPopUp.action === "Resume Now")
//    return "text-white font-semibold text-base leading-4 bg-[#3B7FE6] py-2.5 px-15 rounded-lg cursor-pointer hover:bg-[#90b4e9] transition-all";

//  <AlertPopUp
//    DeleteIcon="DeleteIcon"
//    heading="Delete Participant"
//    Paragraph="Are you sure you want to delete this Participant? This action cannot be undone."
//    cancel="Cancel"
//    action="Delete"
//  />;
