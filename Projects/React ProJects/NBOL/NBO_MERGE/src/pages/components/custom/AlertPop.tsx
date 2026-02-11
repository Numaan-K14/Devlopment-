import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
export function AlertPopUp({
  open,
  setOpen,
  Icon,
  heading,
  Paragraph,
  action,
  cancel,
  LogoutHandle,
  PausedHandle,
  // setTableData,
  // deleteId,
}) {
  // function HandleDelete() {
  //   setTableData((prev) => prev.filter((item) => item.id !== deleteId));
  //   setOpen(false);
  // }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 border-none shadow-none bg-transparent">
          <div className="w-full max-w-md rounded-lg shadow-2xl p-6 bg-white">
            <img src={`/icons/${Icon}.png`} alt={`${Icon} icon`} />
            <DialogTitle className="font-semibold text-lg leading-6 text-[#181D27] mt-5">
              {heading}
            </DialogTitle>

            <p className="font-normal text-base text-[#667085] mt-1 mb-8">
              {Paragraph}
            </p>

            <div className="flex justify-between">
              {/* CLOSE POPUP */}
              <button
                className="text-[#414651] font-semibold text-base leading-4 bg-white py-3.5 px-14 border border-[#D5D7DA] rounded-lg cursor-pointer hover:bg-[#e0dddd] transition-all"
                onClick={() => {
                  setOpen(false);
                  LogoutHandle();
                }}
              >
                {cancel}
              </button>

              {/* ACTION BUTTON */}
              <button
                className="text-white bg-[#3B7FE6] font-semibold text-base leading-4 py-3.5 px-14 rounded-lg cursor-pointer hover:bg-[#75a5ee] transition-all"
                onClick={PausedHandle}
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
