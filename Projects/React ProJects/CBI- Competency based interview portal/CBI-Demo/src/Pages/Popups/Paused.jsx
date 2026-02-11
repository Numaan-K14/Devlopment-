export function Paused({ logo, Heading, Paragraph, action, cancel }) {
  return (
    <>
      <section className="flex justify-center items-center min-h-screen">
        <div>
          <div className="w-full rounded-lg shadow-2xl p-6">
            {/* <img src="icons/Paused.png" /> */}
            {logo}
            <h1 className="font-semibold text-lg leading-6 text-[#181D27] mt-5">
              {/* Interview Paused */} {Heading}
            </h1>
            <p className="font-normal text-base text-[#667085] mt-1 mb-8">
              {/* Your Interview has been paused. You ca resume it at any time. */}
              {Paragraph}
            </p>
            <div className="flex justify-between">
              <button className="text-[#414651] font-semibold text-base leading-4 bg-white py-2.5 px-10 border border-[#D5D7DA] rounded-lg cursor-pointer hover:bg-[#e0dddd] transition-all">
                {action}
              </button>
              <button className="text-white font-semibold text-base leading-4 bg-[#3B7FE6] py-2.5 px-10 rounded-lg cursor-pointer hover:bg-[#90b4e9] transition-all">
                {cancel}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
