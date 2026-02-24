<<<<<<< Updated upstream
=======
import { useEffect, useState } from "react";
>>>>>>> Stashed changes

const colorMap = {
  yellow: "bg-yellow-400",
  red: "bg-red-500",
  green: "bg-green-400",
  blue: "bg-cyan-300",
};

function CardStyle({ title, description, icon, href, color = "blue" }) {
<<<<<<< Updated upstream
  return (
    <a
      href={href}
      className="
=======
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Inicial
    setIsDark(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={href}
      className={`
>>>>>>> Stashed changes
        relative w-72 rounded-[28px] overflow-visible
        transition-transform duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:-translate-y-1 will-change-transform
        h-48
<<<<<<< Updated upstream
        dark:bg-[#0C3D8F]
        
        bg-[#ffffff]
        shadow-[6px_6px_30px_rgba(14,65,148,0.11)]
      "
=======
        shadow-[6px_6px_30px_rgba(14,65,148,0.11)]
        ${isDark ? "bg-[#0C3D8F]" : "bg-white"}
      `}
>>>>>>> Stashed changes
    >
      {/* HEADER */}
      <div
        className={`relative flex items-center h-16 justify-between px-6 py-4 
        text-white font-black text-xl rounded-t-[28px] 
        ${colorMap[color]}`}
      >
        <span className="leading-tight">{title}</span>
        <div className="opacity-90 flex-shrink-0">{icon}</div>
      </div>

      {/* CONTEÚDO */}
      <div className="px-6 py-6">
<<<<<<< Updated upstream
        <p className="text-[#0E4194]/70  dark:text-white text-lg leading-relaxed">
=======
        <p className={`text-lg leading-relaxed ${isDark ? "text-white" : "text-[#0E4194]/70"}`}>
>>>>>>> Stashed changes
          {description}
        </p>
      </div>
    </a>
  );
}

<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
export default CardStyle;