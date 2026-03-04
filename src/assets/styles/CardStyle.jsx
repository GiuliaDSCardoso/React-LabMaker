import { useEffect, useState } from "react";

const colorMap = {
  yellow: "bg-yellow-400",
  red: "bg-red-500",
  green: "bg-green-400",
  blue: "bg-cyan-300",
};

function CardStyle({ title, description, icon, href, color = "blue" }) {
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
        relative w-72 rounded-[28px] overflow-visible
        transition-transform duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:-translate-y-1 will-change-transform
        h-48
        shadow-[6px_6px_30px_rgba(14,65,148,0.11)]
        ${isDark ? "bg-[#0C3D8F]" : "bg-white"}
      `}
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
        <p className={`text-lg leading-relaxed ${isDark ? "text-white" : "text-[#0E4194]/70"}`}>
          {description}
        </p>
      </div>
    </a>
  );
}

export default CardStyle;