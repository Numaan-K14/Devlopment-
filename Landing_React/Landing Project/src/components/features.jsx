export const Features = ({ data }) => {
  const {
    id,
    head_icon,
    img_url, 
    heading,
    description,
    bullet_point1,
    bullet_point2,
    bullet_point3,
    bullet_icon,
  } = data;


  const blockNumber = parseInt(id.split("-")[1], 10);
  const isReverse = blockNumber % 2 === 0; 

  return (
    <div className="flex flex-col gap-12">
      <div
        className={`flex flex-col lg:flex-row ${
          isReverse ? "lg:flex-row-reverse " : ""
        } items-start sm:items-start md:items-start lg:items-center xl:items-center justify-end gap-12 lg:gap-[2rem] xl:gap-[6rem] px-3 sm:px-6 md:px-[4rem] lg:pl-2 lg:pr-0 xl:px-0 mb-10`}
      >
        <div>
          <img src={head_icon} alt="" className="mb-6" />
          <h3 className="text-[#181D27] text-3xl font-semibold mb-4">
            {heading}
          </h3>
          <p className="text-[#535862] text-lg mb-8 whitespace-pre-line">
            {description}
          </p>
          <ul className="text-[#535862] text-lg space-y-3 pl-0 sm:pl-0 md:pl-0 lg:pl-3 xl:pl-4">
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
  );
};
