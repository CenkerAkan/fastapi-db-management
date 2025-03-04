"use client"; // Required for using React hooks in Next.js App Router

import { useEffect, useState } from "react";
import Link from "next/link"; // Import Next.js Link for navigation
import { FiMenu, FiX, FiMoon, FiSun } from "react-icons/fi"; // Import icons
import HamburgerMenu from "./components/HamburgerMenu";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const maxElements = 5; // Number of elements in the list

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      {/* Full-Screen Rectangular Frame */}
      <div className="relative w-full h-full min-h-screen flex flex-col border-[20px] border-blue-500">
        
        {/* Embedded Header inside Frame */}
        <div className="absolute top-0 w-full flex justify-center bg-blue-500 text-white text-xl font-bold py-3">
          My Next.js Page
        </div>

        {/* Hamburger Menu Icon (Left Top) */}
        <HamburgerMenu />

        {/* Main Content Area */}
        <div className="flex flex-grow w-full">
          {/* Left Side (2/3) - Centered Video */}
          <div className="w-2/3 flex items-center justify-center bg-black">
            <div className="w-3/4 h-3/4">
              <video
                autoPlay
                loop
                muted
                className="w-full h-full object-cover rounded-lg shadow-lg"
              >
                <source src="/snake.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Right Side (1/3) - Dynamic List */}
          <div className="w-1/3 h-full flex flex-col items-center justify-center p-6">
            <p className="text-lg font-bold mb-4">Dynamic List</p>
            <ul className="w-full space-y-4">
              {Array.from({ length: maxElements }, (_, index) => (
                <li key={index} className="flex justify-between items-center border p-3 rounded-lg shadow-md bg-white dark:bg-gray-800">
                  
                  {/* Left Image + Text */}
                  <div className="flex flex-col items-center">
                    <img src={`/images/left-${index + 1}.png`} alt={`Left ${index + 1}`} className="w-12 h-12 object-cover rounded-full" />
                    <p className="text-sm text-center mt-2">Left {index + 1}</p>
                  </div>

                  {/* Right Image + Text */}
                  <div className="flex flex-col items-center">
                    <img src={`/images/right-${index + 1}.png`} alt={`Right ${index + 1}`} className="w-12 h-12 object-cover rounded-full" />
                    <p className="text-sm text-center mt-2">Right {index + 1}</p>
                  </div>

                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
