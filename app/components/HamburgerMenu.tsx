"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiMoon, FiSun, FiLogIn } from "react-icons/fi"; // Import login icon

export default function HamburgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <>
      {/* Hamburger Menu Icon (Top Left) */}
      <button
        onClick={() => setMenuOpen(true)}
        className="absolute top-4 left-4 text-white bg-blue-500 p-2 rounded-md focus:outline-none"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-700 text-white transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg`}
      >
        {/* Close Button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-white"
        >
          <FiX size={24} />
        </button>

        {/* Menu Content */}
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <p className="text-lg font-semibold">Menu</p>

          {/* Navigation Buttons */}
          <Link href="/" className="w-5/6">
            <button className="w-full px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-gray-200 transition">
              Advertisement
            </button>
          </Link>
          <Link href="/frame-only" className="w-5/6">
            <button className="w-full px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-gray-200 transition">
              Frame Only
            </button>
          </Link>
          <Link href="/results" className="w-5/6">
            <button className="w-full px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-gray-200 transition">
              Results
            </button>
          </Link>

          {/* Login Button */}
          <Link href="/login" className="w-5/6">
            <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-gray-200 transition">
              <FiLogIn size={20} />
              <span>Login</span>
            </button>
          </Link>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-gray-200 transition"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
