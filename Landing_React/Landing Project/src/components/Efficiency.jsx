export const Efficiency = ({ services }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-center lg:justify-evenly gap-10 mb-24 lg:gap-6 px-6 md:px-10 xl:px-[5rem]">
      {services.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center text-center bg-white rounded-xl p-6 md:p-4 w-full lg:w-[30%] xl:w-[30%]"
        >
          <img src={item.logo} alt={item.heading} className="mb-4 w-12 h-12" />
          <h3 className="text-lg font-semibold text-[#181D27] leading-7 mb-2">
            {item.heading}
          </h3>
          <p className="text-[#667085] text-base leading-7">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};
