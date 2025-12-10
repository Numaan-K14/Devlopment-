import { IoArrowForwardOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

export function Section1() {
  const navigate = useNavigate();

  function HandleChanger() {
    navigate("/Section2");
  }

  return (
    <section>
      <div className="p-7">
        <h2 className="font-semibold leading-9 text-3xl text-[#181D27] mb-1">
          Section 1 of 6
        </h2>
        <p className="text-[#535862] font-normal text-base leading-5">
          Assess your professional skills across key competencies.
        </p>
      </div>

      <hr className="border-2 border-[#cfd2d4] w-full " />
      <div className="p-7">
        <div className="bg-white p-6 border border-gray-200 rounded-sm ">
          <p className="font-semibold text-lg leading-6 text-[#181D27] flex justify-between">
            Core Question
            <span className="flex gap-1 items-center text-[#535862] text-base font-medium leading-6">
              <IoMdTime className="w-6 h-6" /> 05:00
            </span>
          </p>
          <p className="font-normal text-base leading-0-5 text-[#181D27]">
            This is the main question for this competency. Take your time to
            provide a comprehensive answer.
          </p>

          <p className="pt-8 text-[#181D27] font-semibold text-xl leading-7">
            Describe a situation where you had to lead a team through a
            challenging project or difficult period. What was your approach, and
            what was the outcome ?
          </p>

          <textarea
            className="mt-4 w-full h-60 border border-gray-300 p-4 rounded-sm placeholder:font-normal placeholder:text-base placeholder:leading-6 placeholder:text-[#717680]"
            placeholder="Type Your Answer Here..."
          />
        </div>
        <div className="flex justify-end my-8">
          <button
            onClick={HandleChanger}
            className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1  hover:bg-[#75a5ee] transition-all"
          >
            Submit <IoArrowForwardOutline />
          </button>
        </div>
      </div>
    </section>
  );
}
