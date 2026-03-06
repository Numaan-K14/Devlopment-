import Link from "next/link";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-12 py-6 bg-linear-to-r from-[#02071c] to-[#011b63]">
      <div className="text-xl font-semibold tracking-tight  text-white">
        <Link href="/">MyLogo</Link>
      </div>

      <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link
          href="/"
          className="hover:text-blue-300 transition-all duration-500  text-white font-medium leading-2 text-xl"
        >
          Home
        </Link>
        <Link
          href="/"
          className="hover:text-blue-300 transition-all duration-500  text-white font-medium leading-2 text-xl"
        >
          About Us
        </Link>
        <Link
          href="/"
          className="hover:text-blue-300 transition-all duration-500  text-white font-medium leading-2 text-xl"
        >
          Blog
        </Link>
        <Link
          href="/"
          className="hover:text-blue-300 transition-all duration-500  text-white font-medium leading-2 text-xl"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
