import { CustomSlider } from "./CustomSlider";

export const TechButtons = () => {
  return (
    <>
      <div className="flex items-center gap-4 px-6 md:px-16 xl:px-[8rem] mb-10 overflow-x-auto">
        <CustomSlider label="Programming Language" />
        <CustomSlider label="Frontend Framework" />
        <CustomSlider label="Backend Framework" />
        <CustomSlider label="Mobile Development" />
        <CustomSlider label="BI Tools" />
        <CustomSlider label="Design Tools" />

        <button className="ml-4 hover:shadow-lg">
          <img src="/Logos/btn-arrow.png" alt="arrow" className="w-10" />
        </button>
      </div>
    </>
  );
};
