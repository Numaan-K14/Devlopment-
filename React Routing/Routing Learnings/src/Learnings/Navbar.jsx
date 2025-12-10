import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-[#d5dfde] shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-blue-700">MyWebsite</h1>
      <ul className="flex gap-6 text-gray-700 font-medium">
        <li>
          <Link
            to="/"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Contact
          </Link>
        </li>
        <li>
          <Link
            to="/Movies"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Movies
          </Link>
        </li>
      </ul>
    </nav>
  );
};
