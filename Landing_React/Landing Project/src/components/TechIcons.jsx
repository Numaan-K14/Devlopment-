import {Icons} from "./Icons"
export const TechIcons = () => {
    return (
      <>
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 px-6 md:px-16 xl:px-[8rem] pt-10 pb-24">
          <Icons logo="/Logos/node_js.svg" name="Node JS" />
          <Icons logo="/Logos/java.svg" name="Java" />
          <Icons logo="/Logos/js.svg" name="JavaScript" />
          <Icons logo="/Logos/python.svg" name="Python" />
        </div>
      </>
    );
}