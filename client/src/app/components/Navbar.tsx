import React from "react";
import Link from "next/link";
const Navbar = () => {
  return (
    <nav className="w-full py-2 px-4 bg-[#FBFBFB] fixed top-0 left-0 right-0 flex items-center max-w-[1280px] m-auto">
      <Link href="/" className="text-black text-2xl font-bold tracking-wide">Quizify</Link>
    </nav>
  );
};

export default Navbar;
