const PartDashboardCard = ({
  title,
  subTitle,
  number,
}: {
  title: string;
  subTitle: string;
  number: number;
}) => {
  return (
    <div className='bg-[#FFFFFF] h-[150px] w-[480.67px] border border-[rgba(0,0,0,0.1)] rounded-[14px] p-[24px] flex flex-col gap-4'>
      <div className='flex gap-2 items-center justify-center'>
        <div className='w-[32px] h-[32px] bg-[rgba(216,231,252,0.5)] rounded-full text-[rgba(59,127,230,1)] flex items-center justify-center'>
          {number}
        </div>
        <h2 className='text-[#0A0A0A] text-[18px] leading-7'>{title}</h2>
      </div>
      <p className='text-[14px] leading-5 text-[#717182]'>{subTitle}</p>
    </div>
  );
};

export default PartDashboardCard;
