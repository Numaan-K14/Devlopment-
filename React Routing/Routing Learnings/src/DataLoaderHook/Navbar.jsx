import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div>
      <nav className="bg-[#d5dfde] shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-700">
          Movies Data Fetching
        </h1>
        <ul className="flex gap-6 ">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/About">About</Link>
          </li>
          <li>
            <Link to="/Movies">Movies</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
