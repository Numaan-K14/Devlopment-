import { IoArrowForwardOutline } from "react-icons/io5";
import { LuPause } from "react-icons/lu";

export function Section3() {
  return (
    <>
      <section>
        <div className="p-7">
          <h2 className="font-semibold leading-9 text-3xl text-[#181D27]">
            Review Your Answers
          </h2>

          <p className="text-[#535862] font-normal text-base leading-5">
            Here are your responses for the competency. You cannot modify these
            answers, but you can review them before continuing.
          </p>
        </div>

        <hr className="border-t-2 border-[#cfd2d4] w-full" />
        {/* ------------Area 1--------------- */}

        <div className="border-2 border-gray-200 p-5 rounded-md bg-white m-7">
          <h3 className="font-semibold text-xl text-[#181D27] leading-7 mb-5">
            Core Question
          </h3>

          <p className="text-[#181D27] text-lg font-normal leading-7 mb-4">
            Describe a situation where you had to lead a team through a
            challenging project or difficult period. What was your approach, and
            what was the outcome ?
          </p>

          <textarea
            className="text-md text-gray-500 px-6 py-3 border border-gray-200 rounded-md h-37 w-full placeholder:text-[#717680] placeholder:font-normal placeholder:text-lg placeholder:leading-6"
            placeholder="Describe a situation where you had to lead a team through a challenging project or difficult period. What was your approach, and what was the outcome. Describe a situation where you had to lead a team through a challenging project or difficult period. What was your approach, and what was the outcome. Describe a situation where you had to lead a team through a challenging project or difficult period. What was your approach, and what was the outcome."
          ></textarea>
        </div>
        {/* ------------Area 2--------------- */}

        <div className="border-2 border-gray-200 p-5 rounded-md bg-white m-7">
          <h3 className="font-semibold text-xl text-[#181D27] leading-7 mb-5">
            Follow Up Question
          </h3>

          <p className="text-[#181D27] text-lg font-normal leading-7 mb-4">
            Describe a situation where you had to lead a team through a
            challenging project or difficult period. What was your approach, and
            what was the outcome ?
          </p>

          <textarea
            className="text-md text-gray-500 px-6 py-3 border border-gray-200 rounded-md h-37 w-full placeholder:text-[#717680] placeholder:font-normal placeholder:text-lg placeholder:leading-6"
            placeholder="Describe a situation where you had to lead a team through a challenging project or difficult period. What was your approach, and what was the outcome. Describe a situation where you had to lead a team through a challenging project or difficult period. What was your approach, and what was the outcome. Describe a situation where you had to lead a team through a challenging project or difficult period. What was your approach, and what was the outcome."
          ></textarea>
        </div>
        {/* ----------------Buttons--------------- */}

        <div className="flex justify-end gap-4 m-7">
          <button className="text-base font-semibold leading-5 bg-white py-3 px-5 rounded-md flex justify-center items-center gap-1  hover:bg-[#75a5ee] transition-all">
            <LuPause />
            Pause Your Interview
          </button>

          <button className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1  hover:bg-[#75a5ee] transition-all">
            Continue <IoArrowForwardOutline />
          </button>
        </div>
        {/* ------------------------ */}
      </section>
    </>
  );
}
