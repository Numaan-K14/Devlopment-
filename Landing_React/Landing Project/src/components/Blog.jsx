export const Blog = ({label,heading,description}) => {
    return (
      <>
        <section className="border-t border-[#E9EAEB]">
          <div className="text-center mx-4 my-24 md:mx-10 lg:mx-[20rem] xl:mx-[20rem] ">
            <div className="tag text-[#175CD3] font-medium text-sm py-1 px-3 mb-3 rounded-2xl border border-[#B2DDFF] bg-[#EFF8FF] inline-block hover:bg-[#93C5FD]">
              <a href="#">{label}</a>
            </div>
            <h2 className="text-[#181D27] font-semibold text-4xl leading-[2.75rem] mb-5">
             {heading}
            </h2>
            <p className="text-[#535862] font-normal text-xl leading-[1.875rem]">
             {description}
            </p>
          </div>
        </section>
      </>
    );
}