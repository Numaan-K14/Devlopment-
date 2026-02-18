"use client";
import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <>
      <header className="flex justify-between items-center  bg-blue-600 text-white p-4">
        <div>MyLogo</div>
        <ul className="flex gap-6">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </header>
    </>
  );
}

export default Navbar;
