
import { Blog } from "../components/Blog";
import { TechButtons } from "../components/TechButtons";
import { TechIcons } from "../components/TechIcons";

export const Branding=() =>{
  return (
    <>
      <section className="border-t border-[#E9EAEB] md:bg-white lg:bg-[#FAFAFA] xl:bg-[#FAFAFA] 2xl:bg-[#FAFAFA]">
        <Blog
          label="Tech Stacks"
          heading="Comprehensive and Modern Tech Stack"
          description="At Quartoloom, we leverage a tech stack to deliver robust, scalable, and high-performing digital solutions tailored to diverse business needs"
        />
        <TechButtons />
       <TechIcons/>

      </section>
    </>
  );
}


