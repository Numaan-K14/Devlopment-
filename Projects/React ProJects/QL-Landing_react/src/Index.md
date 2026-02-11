<section class="border-t border-[#E9EAEB] mt-[11rem]">
        <div class="flex flex-col justify-center items-center mx-auto w-[55%]">
          <div class=" text-[#175CD3] font-medium text-sm py-1 px-3 mb-3 rounded-2xl border border-[#B2DDFF] bg-[#EFF8FF] inline-block hover:bg-[#93C5FD]">
            <a href="#"> {label} </a>
          </div>
          <div class="flex flex-col justify-center items-center">
            <h2 class="text-[#181D27] font-semibold text-4xl leading-[2.75rem] mb-5 text-center">
              {heading}
            </h2>
            <p class="text-[#535862] font-normal text-xl leading-[1.875rem] text-center w-[90%]">
              {description}
            </p>
          </div>
        </div>
      </section>

      ----------------------------
      <section class="border-t border-[#E9EAEB] mt-[11rem]">
          <div class="text-center my-24 xl:mx-[20rem] lg:mx-[12rem] md:mx-10 mx-4">
            <div class="tag text-[#175CD3] font-medium text-sm py-1 px-3 mb-3 rounded-2xl border border-[#B2DDFF] bg-[#EFF8FF] inline-block hover:bg-[#93C5FD]">
              <a href="#"> {label} </a>
            </div>
            <h2 class="text-[#181D27] font-semibold text-4xl leading-[2.75rem] mb-5">
              {heading}
            </h2>
            <p class="text-[#535862] font-normal text-xl leading-[1.875rem]">
              {description}
            </p>
          </div>
        </section>
        --------------------------------

        <div class="flex flex-col gap-12">

            <div class="flex lg:flex-row flex-col items-start sm:items-start md:items-start lg:items-center xl:items-center justify-end  gap-12 lg:gap-[2rem] xl:gap-[6rem] px-3 sm:px-6 md:px-[4rem] lg:pl-2 lg:pr-0 xl:px-0
          ">

                <div>
                    <img src="../Logos/Featured.png" alt="icon1" class="mb-6" />
                    <h3 class="text-[#181D27] text-3xl font-semibold mb-4">
                        EDI & API Integration
                    </h3>
                    <p class="text-[#535862] text-lg mb-8 ">
                        Simplify and speed up communication between systems with <br class="hidden sm:block"> secure,
                        seamless integrations.
                    </p>
                    <ul class="text-[#535862] text-lg space-y-3 pl-0 sm:pl-0 md:pl-0 lg:pl-3 xl:pl-4 ">
                        <li class="flex justify-start items-start gap-3">
                            <img src="../Logos/Tick.png" class=" h-[23.33px] w-[23.33px]" />Enable real-time
                            data exchange across platforms
                        </li>
                        <li class="flex justify-start items-start gap-3">
                            <img src="../Logos/Tick.png" class=" h-[23.33px] w-[23.33px]" />Reduce manual
                            intervention and errors
                        </li>
                        <li class="flex justify-start items-start gap-3">
                            <img src="../Logos/Tick.png" class=" h-[23.33px] w-[23.33px]" />
                            Improve workflow
                            efficiency with automated transactions
                        </li>
                    </ul>
                </div>

                <div
                    class="w-[100%] sm:w-full md:w-full lg:w-[47%] xl:w-[47%] mx-auto sm:mx-auto md:mx-auto lg:mx-0 xl:mx-0">
                    <img src="../Images/dashboard.png" class="rounded-[0.75rem] shadow-lg border border-[#eff8ff]"
                        alt="Dashboard" />
                </div>
            </div>
        </div>

--------------------------------------------------------------
export const Features = ({ data }) => {
  let Reverse = false;
  const {
    id,
    index,
    head_icon,
    img_url,
    heading,
    descrption,
    bullet_point1,
    bullet_point2,
    bullet_point3,
    bullet_icon,
  } = data;
  if (index % 2 === 0) {
    Reverse = true;
  } else {
    Reverse = false;
  }
  console.log(Reverse, ".>>>>>>>>>>>Reverse");
  return (
    <>
      <div className="flex flex-col gap-12">
        <div
          className={
            Reverse
              ? `flex lg:flex-row flex-col items-start sm:items-start md:items-start lg:items-center xl:items-center justify-end gap-12 lg:gap-[2rem] xl:gap-[6rem] px-3 sm:px-6 md:px-[4rem] lg:pl-2 lg:pr-0 xl:px-0`
              : `flex lg:flex-row-reverse flex-col-reverse items-start sm:items-start md:items-start lg:items-center xl:items-center justify-end gap-12 lg:gap-[2rem] xl:gap-[6rem] px-3 sm:px-6 md:px-[4rem] lg:pl-2 lg:pr-0 xl:px-0`
          }
        >
          <div>
            <img src={head_icon} alt={id} className="mb-6" />
            <h3 className="text-[#181D27] text-3xl font-semibold mb-4">
              {heading}
            </h3>
            <p className="text-[#535862] text-lg mb-8 ">{descrption}</p>
            <ul className="text-[#535862] text-lg space-y-3 pl-0 sm:pl-0 md:pl-0 lg:pl-3 xl:pl-4 ">
              <li className="flex justify-start items-start gap-3">
                <img
                  src={bullet_icon}
                  className="h-[23.33px] w-[23.33px]"
                  alt=""
                />
                {bullet_point1}
              </li>
              <li className="flex justify-start items-start gap-3">
                <img
                  src={bullet_icon}
                  className="h-[23.33px] w-[23.33px]"
                  alt=""
                />
                {bullet_point2}
              </li>
              <li className="flex justify-start items-start gap-3">
                <img
                  src={bullet_icon}
                  className="h-[23.33px] w-[23.33px]"
                  alt=""
                />
                {bullet_point3}
              </li>
            </ul>
          </div>

          <div className="w-[100%] sm:w-full md:w-full lg:w-[47%] xl:w-[47%] mx-auto sm:mx-auto md:mx-auto lg:mx-0 xl:mx-0">
            <img
              src={img_url}
              className="rounded-[0.75rem] shadow-lg border border-[#eff8ff]"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};
-----------------------------------------------------------------------------------

  <div class="text-center mt-24 mb-16 px-6 xl:px-[20rem]">
            <div
                class="tag text-[#175CD3] font-medium text-sm leading-5 py-1 px-3 mb-3 rounded-2xl border border-[#B2DDFF] bg-[#EFF8FF] inline-block hover:bg-[#93C5FD]">
                <a href="#">Features</a>
            </div>
            <h2 class="text-[#181D27] font-semibold text-3xl md:text-4xl leading-[2.75rem] mb-5">
                Helping organizations with their Operations
            </h2>
            <p class="text-[#535862] text-lg md:text-xl leading-[1.875rem]">
                Our solutions are designed to streamline supply chain processes,
                enhance visibility, improve data accuracy, and drive operational
                efficiency.
            </p>
        </div>
-------------------------------------------------------------------------------------------------------------

  <div class="text-center mx-4 my-24 md:mx-10 lg:mx-[20rem] xl:mx-[20rem] ">
            <div
                class="tag text-[#175CD3] font-medium text-sm py-1 px-3 mb-3 rounded-2xl border border-[#B2DDFF] bg-[#EFF8FF] inline-block hover:bg-[#93C5FD]">
                <a href="#">Services</a>
            </div>
            <h2 class="text-[#181D27] font-semibold text-4xl leading-[2.75rem] mb-5">
                Specialized solutions for evolving logistics and supply chain
                needs
            </h2>
            <p class="text-[#535862] font-normal text-xl leading-[1.875rem]">
                Our solutions are designed to streamline operations, enhance system
                performance, and drive digital transformation
            </p>
        </div>


----------------------- Branding.jsx----------------------- 
        import { Blog } from "../components/Blog";
import {CustomSlider }from "../components/CustomSlider";

export const Branding=() =>{
  return (
    <div className="flex items-center gap-4 px-6 md:px-16 xl:px-[8rem] mb-10 overflow-x-auto">
      <CustomSlider label="Programming Language" />
      <CustomSlider label="Frontend Framework" />
      <CustomSlider label="Backend Framework" />
      <CustomSlider label="Mobile Development" />
      <CustomSlider label="BI Tools" />
      <CustomSlider label="Design Tools" />

      <button className="ml-4 hover:shadow-lg">
        <img src="../Logos/btn-arrow.png" alt="arrow" className="w-10" />
      </button>
    </div>
  );
}
----------------------- ----------------------- ----------------------- ----------------------- 

 