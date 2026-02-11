export const HeroPage = ({ title, description, image }) => {
  return (
    <>
      <section className="hero bg-[#eff8ff] text-start sm:text-center pt-[6rem] px-2 sm:px-6 md:px-8 lg:px-16 xl:px-[12rem] 2xl:px-[10rem] relative ">
        <div className="container max-w-[62.5rem] mx-auto px-2 sm:px-4 md:px-6 w-[80%]">
          <h1 className="text-[#194185] text-3xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-[570] tracking-[-0.02em]">
            {title}
          </h1>

          <p className="text-[#175cd3] mx-2 text-sm sm:text-base md:text-lg mt-4 sm:mt-6 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
            {description}
          </p>

          <div className="hero-buttons flex flex-col sm:flex-col md:flex-row justify-start sm:justify-center md:justify-center gap-3 sm:gap-4 items-stretch md:items-center">
            <button className="demo-btn order-2 md:order-1 hover:bg-[#E0F2FE] flex items-center justify-center bg-white text-[#414651] font-semibold text-sm sm:text-base px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border border-[#d5d7da] gap-2 flex-shrink-0 text-center w-full md:w-[200px]">
              <img src="../images/Icon.svg" alt="icon" />
              Demo
            </button>

            <button className="signup-btn order-1 md:order-2 hover:bg-[#93C5FD] bg-[#1570ef] text-white font-semibold text-sm sm:text-base border border-[#1570ef] px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg flex-shrink-0 text-center w-full md:w-[200px]">
              Sign up
            </button>
          </div>
        </div>
      </section>
      {image ? (
        <div className="relative flex justify-center items-center sm:px-0 md:px-0 lg:px-0 xl:px-0">
          <img
            src="../images/Background.jpg"
            alt="section background"
            className="w-full h-auto object-cover z-0 rounded-lg mb-[11rem]"
          />

          <img
            src={image}
            alt="Demo image"
            className="absolute top-0 mt-4 sm:mt-6 lg:mt-8 w-[90%] max-w-[900px] h-auto rounded-[12px] z-10 shadow-md"
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};
