import {Blog} from "../components/Blog"
import { SolutionsTxt } from "../components/SolutionsTxt";
import Solutions from "../api/Solutions.json"
export const OurSolutions = () => {
  return (
    <>
      <Blog
        label="Why Us?"
        heading="Don’t just take our word for it"
        description="We are crafting tailored technology solutions for complex business needs"
      />

      <div className="flex flex-col md:flex-col lg:flex-row gap-16 items-start w-[95%] mx-4 lg:mx-14 mb-12">
        <div className="space-y-8 w-full lg:w-[41%]">
          {Solutions.map((item) => (
            <SolutionsTxt key={item.id} data={item} />
          ))}
        </div>
        <div className="flex flex-wrap justify-center lg:justify-end w-full lg:w-[59%]">
          <picture>
            <source
              media="(max-width: 1024px)"
              srcSet="/images/PAGE4(MD).svg"
            />

            <img
              src="/images/Phones.png"
              alt="Mobile dashboard preview"
              className="w-full h-auto"
            />
          </picture>
        </div>
      </div>
    </>
  );
}

 
