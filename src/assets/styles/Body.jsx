import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../../index.css";
import { CloudMoon, CloudSun } from "lucide-react";

export default function Body(props) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
<<<<<<< Updated upstream
=======
    document.documentElement.classList.add("theme-transition");

>>>>>>> Stashed changes
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
<<<<<<< Updated upstream
  }, [darkMode]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
=======

    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 1000);
  }, [darkMode]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden transition-colors duration-800">
>>>>>>> Stashed changes
      
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
<<<<<<< Updated upstream
          bg-[#327ef8] shadow-md dark:shadow-[#000e24] shadow-[#0245b16e]
=======
          bg-[#327ef8] shadow-md dark:shadow-[#000e24] focus:outline-none focus:ring-0 shadow-[#0245b16e]
>>>>>>> Stashed changes
          dark:bg-[#0041a3]
          text-white
        "
      >
<<<<<<< Updated upstream
        <div className="transition-transform duration-500">
=======
        <div className="transition-transform duration-800">
>>>>>>> Stashed changes
          {darkMode ? <CloudSun /> : <CloudMoon />}
        </div>
      </button>

      {/* CONTEÚDO */}
<<<<<<< Updated upstream
      <div
        className="
          flex-grow
          w-full
          transition-all duration-300
=======
     <div
        className="
          flex-grow
          w-full
          transition-colors duration-800
>>>>>>> Stashed changes
          md:ml-1
          lg:ml-2
        "
      >
<<<<<<< Updated upstream
        {
          React.Children.map(props.children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child, { darkMode })
              : child
          )
        }
      </div>
=======
      {React.Children.map(props.children, (child) =>
        React.isValidElement(child) && typeof child.type !== "string"
          ? React.cloneElement(child, { darkMode })
          : child
      )}
    </div>
>>>>>>> Stashed changes

      {/* FOOTER */}
      <footer
        className="
          w-full
          transition-all duration-300
          md:ml-12
          lg:ml-16
        "
      >
        <div className="max-w-full mx-auto text-center text-blue-900 text-sm bg-blue-100/50 dark:bg-[#001028]/50 dark:text-blue-600 rounded-t-xl">
          Made by Giulia Cardoso
        </div>
      </footer>
    </div>
  );
}

Body.propTypes = {
  children: PropTypes.node,
};