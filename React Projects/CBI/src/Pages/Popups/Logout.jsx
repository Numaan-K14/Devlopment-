import { LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { LoginPage } from "../LoginPage";
export function Logout({ open, setOpen }) {
  const navigate = useNavigate();

  function LogoutHandle() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (!localStorage.getItem("token")) {
      navigate(0); //for Refreshing page
      // alert("Logged Out");
    }
  }
  let user = JSON.parse(localStorage.getItem("user"));
  // console.log("From Logout POPUP", user);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 border-none shadow-none bg-transparent">
        <DialogTitle></DialogTitle>
        <div className="w-[280px] bg-[#101c36] rounded-xl shadow-lg  p-4">
          {/* USER INFO */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src="images/Avatar.jpg"
              alt="User Avatar"
              className="rounded-full h-10 w-10"
            />

            <div className="flex flex-col">
              {/* Fixed text color (white text was invisible on white BG) */}
              <span className="text-white font-semibold text-base leading-6">
                {user?.name}
              </span>
              <p className="text-white font-normal text-sm leading-5">
                {user?.role}
              </p>
            </div>
          </div>

          {/* SEPARATOR */}
          <hr className="border-[#E5E7EB] mb-3" />

          {/* LOGOUT BUTTON */}
          <button
            onClick={LogoutHandle}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#ffffff26] transition-all cursor-pointer"
          >
            <LogOut size={20} strokeWidth={2} className="text-[#9b9a9a]" />
            <span className="text-[#9b9a9a] font-medium text-base">Logout</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
