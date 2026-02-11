export function Assisment() {
  const data = [
    {
      index: "1",
      date: "3",
      label: "Sections completed",
    },
    {
      index: "2",
      date: "9",
      label: "Sections completed",
    },
    {
      index: "10/10/2025",
      date: "3",
      label: "Sections completed",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Popup Container */}
      <div className="bg-white w-[30%] rounded-xl shadow-lg p-8 text-center">
        {/* Top Icon */}
        <div className="flex justify-center">
          <div className="rounded-full flex items-center justify-center">
            
            <img src="/icons/thumb1.png" className="h-17 w-17" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[#181D27] mt-4">
          Assessment Successfully Submitted
        </h2>

        {/* Subtitle */}
        <p className="text-[#535862] text-sm mt-1">
          Thank you for completing the assessment.
        </p>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {data.map((items, index) => (
            <Stats key={index} date={items.date} label={items.label} />
          ))}
        </div>

        {/* Info Box */}
        <div className="border rounded-md bg-[#F7FAFF] text-[#364153] text-sm p-4 mt-6">
          Report and feedback will be provided to you by your HR or direct
          supervisor.
        </div>

        {/* Button */}
        <button className="bg-[#3B7FE6] text-white py-3 px-15 rounded-lg mt-6 text-sm font-semibold hover:bg-[#6fa5ff] transition">
          Sign Out
        </button>
      </div>
    </div>
  );
}

export const Stats = ({ date, label }) => {
  return (
    
      <div className="border rounded-lg py-4">
        <div className="flex justify-center mb-2">
          <img src="/icons/POP-UP1.png" className="h-10 w-10" />
        </div>
        <p className="text-xl font-semibold">{date}</p>
        <p className="text-xs text-[#535862]">{label}</p>
      </div>
  
  );
};
