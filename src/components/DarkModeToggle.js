"use client"; // This file is only rendered on the client

import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if the user has a preference saved in localStorage
    const darkModePreference = localStorage.getItem("theme");

    if (darkModePreference) {
      setIsDarkMode(darkModePreference === "dark");
      document.documentElement.classList.add(darkModePreference);
    } else {
      // If no preference, use system settings
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDarkMode);
      if (prefersDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return <button onClick={toggleDarkMode}>Toggle Dark Mode</button>;
}
