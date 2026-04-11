import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../../index.css";

export default function Body(props) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Estado que controla se o menu lateral está aberto ou fechado
  const [open, setOpen] = useState(false);

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
    <div className="flex flex-col min-h-screen overflow-x-hidden transition-colors duration-700">
      {/* Linha decorativa no topo */}
      <div className="fixed top-0 left-0 w-full h-2 bg-[#0E4194] dark:bg-[#E84B13] z-[100]" />

      {/* CONTEÚDO PRINCIPAL - AJUSTA A MARGEM CONFORME O MENU */}
      <div
        className={`
          flex-grow 
          w-full 
          transition-all duration-300 
          pt-16 md:pt-0 
          ${open ? "md:ml-32" : "md:ml-18"}
        `}
      >
        {React.Children.map(props.children, (child) =>
          React.isValidElement(child) && typeof child.type !== "string"
            ? React.cloneElement(child, { darkMode, setDarkMode, open, setOpen })
            : child
        )}
      </div>

      {/* FOOTER - AJUSTA A MARGEM CONFORME O MENU */}
      <footer
        className={`
          w-full 
          transition-all duration-300 
          ${open ? "md:ml-64" : "md:ml-18"}
        `}
      >
        <div className="max-w-full mx-auto text-center text-blue-900 text-sm bg-blue-100/50 dark:bg-[#001028]/50 dark:text-[#007AF8] rounded-t-xl py-2">
          Made by Giulia Cardoso
        </div>
      </footer>
    </div>
  );
}

Body.propTypes = {
  children: PropTypes.node,
};