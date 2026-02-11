import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10 sticky">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-xl font-semibold text-white">Learnings</h2>
        <ul className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/About" className="hover:text-white transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </ul>
        <p className="text-sm text-gray-400 text-center md:text-right">
          © {new Date().getFullYear()} MyWebsite. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
