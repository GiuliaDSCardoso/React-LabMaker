import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../../index.css";
import { CloudMoon, CloudSun } from "lucide-react";

export default function BodyLogin(props) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.add("theme-transition");

    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 1000);
  }, [darkMode]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden transition-colors duration-800">
      
      <div className="fixed top-0 left-0 w-full h-2 bg-[#0E4194] dark:bg-[#E84B13] z-[100]" />

      {/* BOTÃO TOGGLE */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="
          fixed top-20 right-12 z-[200]
          md:top-6 md:right-12
          p-3
          rounded-full
          transition-all duration-500 ease-in-out
          transform hover:scale-110 active:scale-95
          bg-[#327ef8] shadow-md dark:shadow-[#000e24] focus:outline-none focus:ring-0 shadow-[#0245b16e]
          dark:bg-[#0041a3]
          text-white
        "
      >
        <div className="transition-transform duration-800">
          {darkMode ? <CloudSun /> : <CloudMoon />}
        </div>
      </button>

      {/* CONTEÚDO */}
     <div
        className="
          flex-grow
          w-full
          transition-colors duration-800
          items-center justify-center
         
        "
      >
      {React.Children.map(props.children, (child) =>
        React.isValidElement(child) && typeof child.type !== "string"
          ? React.cloneElement(child, { darkMode })
          : child
      )}
    </div>

      {/* FOOTER */}
      <footer
        className="
          w-full
          transition-all duration-300
        "
      >
        <div className="max-w-full mx-auto text-center text-blue-900 text-sm bg-blue-100/50 dark:bg-[#001028]/50 dark:text-[#007AF8] rounded-t-xl">
          Made by Giulia Cardoso
        </div>
      </footer>
    </div>
  );
}

BodyLogin.propTypes = {
  children: PropTypes.node,
};