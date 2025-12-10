export function SolutionsTxt({ data }) {
  const { heading, description } = data;
  return (
    <div>
      <div className="border-l-4 border-[#1570EF] pl-4">
        <h4 className="text-lg font-semibold text-[#181D27] leading-7">
         {heading}
        </h4>
        <p className="text-[#535862] font-normal text-base leading-6">
          {description}
        </p>
      </div>
    </div>
  );
}
