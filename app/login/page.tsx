"use client";

import { useState } from "react";
import HamburgerMenu from "../components/HamburgerMenu";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle login submission
  const handleLogin = async () => {
    console.log("Username:", username);
    console.log("Password:", password);

    // Define request payload
    const loginData = { username, password };

    try {
      // Send request to the server
      const response = await fetch("https://127.0.0.1:8081/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      // Parse JSON response
      const responseData = await response.json();

      // Log the response
      console.log("Server Response:", responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      {/* Reusable Hamburger Menu */}
      <HamburgerMenu />

      {/* Login Form */}
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl w-96 h-[420px] flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Username Input */}
        <label className="text-md font-semibold mb-1">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full px-4 py-3 border rounded-lg mt-1 mb-5 text-lg dark:bg-gray-700 dark:text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password Input */}
        <label className="text-md font-semibold mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-3 border rounded-lg mt-1 mb-6 text-lg dark:bg-gray-700 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}
