import { useState } from "react";

export function ToggleSwitch() {
  const [toggle, setToggle] = useState(false);
  const HandlerButton = () => {
    setToggle(!toggle)
  }
  return (
    <>
      <div className="w-[6.25rem] h-[3.125rem] rounded-3xl bg-[#ccc] relative cursor-pointer mt-[5rem] shadow-[0px_48px_100px_0px_rgba(17,12,46,0.15)] p-[0.313rem]" onClick={HandlerButton} >
        <div
          className={`w-[2.5rem] h-[2.5rem] rounded-[1.25rem] flex items-center justify-center font-bold text-white absolute top-[0.313rem] left-[0.313rem] border-[0.2rem] border-[#ccc] shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)] transition-transform duration-300 ease-linear] ${toggle ? "on" : "off"}`} 
        >
          <span className="mx-[0.625rem] ">{toggle ? "ON" : "OFF"}</span>
        </div>
      </div>
    </>
  ); 
}

