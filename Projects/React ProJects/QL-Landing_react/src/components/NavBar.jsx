export const NavBar = () => {
  return (
    <>
      <div className="page-container">
        <div className="navbar-container bg-[#eff8ff] overflow-hidden">
          <nav className="navbar flex items-center justify-between gap-4 py-[1.125rem] px-[1rem] md:px-[4rem] lg:px-[5rem] xl:px-[7rem]">
            <div className="nav-first flex justify-start items-center">
              <div className="logo flex justify-start items-center h-8 w-[13.375rem] sm:pr-0 ">
                <img src="/Logos/QLogo.png" alt="Logo" />
              </div>
              <div className="nav-links hidden lg:flex justify-start items-center text-sm ml-5 p-2">
                <span className="hover:text-[#a19e9e] text-[#414651] font-semibold text-base cursor-pointer flex items-center gap-[0.25rem] px-2 py-1">
                  Products
                  <img src="/images/logo-svg.svg" alt="icon" />
                </span>
                <span className="hover:text-[#a19e9e] text-[#414651] font-semibold text-base cursor-pointer flex items-center gap-[0.25rem] px-[0.5rem] py-[0.25rem]">
                  Services
                  <img src="/images/logo-svg.svg" alt="icon" />
                </span>
                <span className="hover:text-[#a19e9e] text-[#414651] font-semibold text-base cursor-pointer flex items-center gap-[0.25rem] px-2 py-1">
                  Resources
                  <img src="/images/logo-svg.svg" alt="icon" />
                </span>
                <a
                  href="#"
                  className="hover:text-[#a19e9e] text-[#414651] font-semibold text-base cursor-pointer flex items-center gap-[0.25rem] px-2 py-1"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="hover:text-[#a19e9e] text-[#414651] font-semibold text-base cursor-pointer flex items-center gap-[0.25rem] px-2 py-1"
                >
                  About
                </a>
              </div>
            </div>

            <div className="nav-buttons hidden lg:flex gap-4 text-center min-w-max">
              <a
                href="#"
                className="login flex-shrink-0 hover:bg-[#E0F2FE] bg-white border border-[#d5d7da] text-[#414651] px-4 py-2 rounded-md text-base font-semibold"
              >
                Log in
              </a>
              <a
                href="#"
                className="signup flex-shrink-0 hover:bg-[#93C5FD] bg-blue-600 text-white px-4 py-2 rounded-md text-base font-semibold"
              >
                Sign up
              </a>
            </div>

            <div className="lg:hidden">
              <button className="hamburger focus:outline-none">
                <img
                  src="/Logos/Humburger.png"
                  alt="menu"
                  className="w-10 h-10"
                />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};
