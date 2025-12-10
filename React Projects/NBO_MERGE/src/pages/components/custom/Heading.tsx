type CustomHeadingProps = {
  heading: string;
  description: string;
  button?: string;
  Exit?: string;
};
export function CustomHeading({
  heading,
  description,
  button,
  Exit,
}: CustomHeadingProps) {
  return (
    <div>
      <header className="flex justify-between items-center p-8  ">
        <div>
          <h1 className="text-[#181D27] font-semibold text-3xl leading-9.5 ">
            {heading}
          </h1>
          <p className="font-normal text-base text-[#535862] leading-6 ">
            {description}
          </p>
        </div>
        <button className="font-semibold text-sm text-[#414651] bg-white border-2 border-[#D5D7DA] py-2.5 px-4 rounded-lg flex gap-2 items-center justify-center hover:bg-[#fafafade] transition cursor-pointer">
          <img src={`icons/${Exit}`} />
          {button}
        </button>
      </header>
      <hr className="border-2 border-[#cfd2d4] w-full " />
    </div>
  );
}
