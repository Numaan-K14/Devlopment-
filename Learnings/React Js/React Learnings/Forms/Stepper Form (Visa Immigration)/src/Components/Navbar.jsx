import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-linear-to-r from-[#020024] via-[#18187e] to-[#00d4ff] py-4 px-10 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <p className="text-white flex">
        <Link to="/Profile" className="relative hover:text-cyan-300 transition-all duration-300 ease-in-ou">
          
          <FaUserCircle className="text-2xl mr-2" />
        </Link>
      </p>
      <ul className="flex gap-10 text-white font-semibold text-lg tracking-wide">
        <li>
          <Link
            to="/"
            className="relative hover:text-cyan-300 transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-cyan-300 hover:after:w-full after:transition-all after:duration-300"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/PersonalInfo"
            className="relative hover:text-cyan-300 transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-cyan-300 hover:after:w-full after:transition-all after:duration-300"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/ContactInfo"
            className="relative hover:text-cyan-300 transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-cyan-300 hover:after:w-full after:transition-all after:duration-300"
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};
    