import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  // DrawerTrigger,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import { useEffect } from "react";
export function SIdeDrawer({
  open,
  setOpen,
  heading,
  children,
  form,
  onSubmit,
}) {
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [form, open]);
  return (
    <>
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex justify-between items-center py-4 px-6">
              <DrawerTitle className="text-[#272D37] font-bold text-lg leading-6">
                {heading}
              </DrawerTitle>
              <DrawerClose asChild>
                <button>
                  <X strokeWidth={2.25} />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <hr className="border border-[#D0D0D7] w-full" />
          {children}
          <DrawerFooter>
            <hr className="border border-[#D0D0D7] w-full" />
            <div className="py-4 flex justify-end gap-3">
              <DrawerClose asChild>
                <button
                  onClick={() => form.reset()}
                  className="bg-white hover:bg-[#e8e9ec] text-[#414651] border border-[#D5D7DA] rounded-md px-8 py-2.5 cursor-pointer"
                >
                  Cancel
                </button>
              </DrawerClose>
              <button
                onClick={form.handleSubmit(onSubmit)}
                type="submit"
                className="bg-[#0b2e79] focus:ring-2 focus:ring-[#04173f] hover:bg-[#04173f] cursor-pointer text-white rounded-md px-8 py-2.5"
              >
                Next
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
