import { IoArrowForwardOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export function Section2() {
  const navigate = useNavigate();

  function HandleChanger() {
    navigate("/Section3");
  }

  return (
    <>
      <section>
        <div className="p-7">
          <h2 className="font-semibold leading-9 text-3xl text-[#181D27] mb-1">
            Section 1 of 6
          </h2>
          <p className="text-[#535862] font-normal text-base leading-5">
            Assess your professional skills across key competencies.
          </p>
        </div>
        <hr className="border-t-2 border-[#cfd2d4] w-full" />

        <div className="p-7">
          <div className="bg-white px-6 pt-6 pb-30 border border-gray-200 rounded-sm ">
            <h3 className="font-semibold text-xl leading-6 text-[#181D27] mb-7">
              Core Question
            </h3>

            <p className=" text-[#181D27] font-semibold text-xl leading-7">
              Describe a situation where you had to lead a team through a
              challenging project or difficult period. What was your approach,
              and what was the outcome ?
            </p>

            <textarea
              className="bg-[#FAFAFA] text-md py-3 px-2.5  my-4 border border-[#D5D7DA] rounded-md h-32 w-full placeholder:font-normal placeholder:text-lg placeholder:text-[#717680]"
              placeholder="I had to lead a team through a challenging project or difficult period. What was your approach, and what was the outcome "
            ></textarea>

            <h3 className="font-bold text-[#535862] text-xl leading-7 mb-7">
              Follow Up Question 1
            </h3>

            <p className=" text-[#181D27] font-semibold text-xl leading-7 mb-4">
              Describe a situation where you had to lead a team through a
              challenging project or difficult period. What was your approach,
              and what was the outcome ?
            </p>

            <textarea
              className="bg-[#FAFAFA] text-md py-3 px-2.5 border border-[#D5D7DA] rounded-md h-32 w-full placeholder:font-normal placeholder:text-lg placeholder:text-[#717680]"
              placeholder="I had to lead a team through a challenging project or difficult period. What was your approach, and what was the outcome "
            ></textarea>
          </div>

          <div className="flex justify-end mx-4 mt-6">
            <button
              onClick={HandleChanger}
              className="text-base font-semibold leading-5 bg-[#3B7FE6] text-white py-3 px-5 rounded-md flex justify-center items-center gap-1  hover:bg-[#75a5ee] transition-all"
            >
              Submit <IoArrowForwardOutline />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
