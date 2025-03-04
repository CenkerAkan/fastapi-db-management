"use client"; // Ensures client-side rendering

import { useState, useEffect } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Controls sidebar visibility
  const [activeMode, setActiveMode] = useState("home"); // Tracks active content mode
  const [results, setResults] = useState<string[]>([]); // Stores fetched results

  // Load dark mode from localStorage on page load (client-side only)
  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log("Fetching results...");

        const response = await fetch(
          "http://192.168.68.107:8081/results?queue_name=celebrity&top_n=1"
        );

        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);

        const text = await response.text(); // Read raw response
        console.log("Raw Response:", text); // Debugging: See if response is valid

        // If the response is empty or invalid, throw an error
        if (!text || text.trim() === "") {
          throw new Error("Empty response from server.");
        }

        const data = JSON.parse(text); // Convert to JSON manually
        console.log("Parsed JSON Data:", data);

        if (data.top_results && data.top_results.length > 0) {
          setResults((prevResults) => {
            const updatedResults = [data.top_results[0], ...prevResults];
            return updatedResults.slice(0, 12);
          });
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    // Set interval to fetch results every 3 seconds
    const interval = setInterval(fetchResults, 3000);

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run effect only once

  // Dark Mode Toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Menu Toggle
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="absolute top-4 left-4 z-50 p-2 bg-gray-800 dark:bg-gray-600 text-white rounded-md"
      >
        ☰ {/* Three-line hamburger icon */}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 dark:bg-gray-700 text-white transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-xl"
        >
          ✕ {/* Close Button */}
        </button>

        <div className="flex flex-col items-center justify-center mt-20 space-y-6">
          {/* Mode Selection Buttons */}
          <button
            className="px-6 py-2 bg-blue-500 dark:bg-yellow-500 rounded-md w-40"
            onClick={() => setActiveMode("advertisement")}
          >
            Advertisement
          </button>
          <button
            className="px-6 py-2 bg-green-500 dark:bg-purple-500 rounded-md w-40"
            onClick={() => setActiveMode("frame")}
          >
            Frame
          </button>
          <button
            className="px-6 py-2 bg-red-500 dark:bg-orange-500 rounded-md w-40"
            onClick={() => setActiveMode("results")}
          >
            Results
          </button>

          {/* Dark Mode Toggle Inside Sidebar */}
          <button
            onClick={toggleDarkMode}
            className="mt-4 px-6 py-2 bg-gray-600 dark:bg-gray-400 text-white rounded-md w-40"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        {/* Thicker Green Frame for Advertisement & Frame Modes */}
        <div
          className={`relative w-4/5 p-6 text-center ${
            activeMode === "advertisement" || activeMode === "frame"
              ? "border-8 border-green-600 shadow-lg p-4 flex flex-col items-center"
              : ""
          }`}
        >
          {/* "Example" Text Spanning the Bottom Edge */}
          {(activeMode === "advertisement" || activeMode === "frame") && (
            <div className="absolute bottom-0 left-0 w-full bg-green-600 text-white py-2 text-center font-bold text-lg">
              Example
            </div>
          )}

          {/* Main Content Section */}
          <h1 className="text-3xl font-bold">Welcome to my page</h1>
          <p className="text-lg mt-2">
            {activeMode === "advertisement"
              ? "This is the advertisement mode."
              : activeMode === "frame"
              ? "This is the frame mode."
              : activeMode === "results"
              ? "This is the results section."
              : "Select a mode from the menu."}
          </p>

          {/* Show Results Inside Frame for Advertisement & Frame Modes */}
          {(activeMode === "advertisement" || activeMode === "frame") && (
            <div className="w-full mt-4 p-4 bg-gray-200 dark:bg-gray-800 rounded-md shadow-md">
              <h2 className="text-xl font-bold mb-4 text-center">Fetched Data</h2>
              {results.length === 0 ? (
                <p className="text-center">No results yet...</p>
              ) : (
                <ul className="space-y-2">
                  {results.map((result, index) => (
                    <li
                      key={index}
                      className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded-md text-center"
                    >
                      {result}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Results Section - Outside Frame in Results Mode */}
        {activeMode === "results" && (
          <div className="w-4/5 mt-6 p-4 bg-gray-200 dark:bg-gray-800 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Results</h2>
            {results.length === 0 ? (
              <p className="text-center">No results yet...</p>
            ) : (
              <ul className="space-y-2">
                {results.map((result, index) => (
                  <li
                    key={index}
                    className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white p-2 rounded-md text-center"
                  >
                    {result}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
