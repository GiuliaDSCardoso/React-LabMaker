import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function CarrosselEventos() {

  const imagens = [
    {
      imgLight: "/logos/Eventos/Evento1.svg",
      imgDark: "/logos/Eventos/Evento1Dark.svg",
      link: "https://plataforma.gpinovacao.senai.br/plataforma/demandas-da-industria/interna/12312",
    },
    {
      imgLight: "/logos/Eventos/Evento2.svg",
      imgDark: "/logos/Eventos/Evento2Dark.svg",
      link: "https://www.instagram.com/mobiliza.senaifeira/",
    },
    {
      imgLight: "/logos/Eventos/Evento3.svg",
      imgDark: "/logos/Eventos/Evento3Dark.svg",
      link: "https://labmakerfsa.vercel.app/",
    },
    {
      imgLight: "/logos/Eventos/Evento4.svg",
      imgDark: "/logos/Eventos/Evento4Dark.svg",
      link: "https://plataforma.gpinovacao.senai.br/plataforma/desafio/2061",
    },
  ];

  const [indexAtual, setIndexAtual] = useState(0);
  const [isDark, setIsDark] = useState(false);

  const proximo = () => {
    setIndexAtual((prev) => (prev + 1) % imagens.length);
  };

  const anterior = () => {
    setIndexAtual((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
  };

  // AUTO PLAY
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndexAtual((prev) => (prev + 1) % imagens.length);
    }, 7000);

    return () => clearInterval(intervalo);
  }, []);

  // VERIFICA DARK MODE
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Inicial
    setIsDark(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto mt-5 relative overflow-visible">
      
      {/* CONTAINER */}
      <div className="relative overflow-hidden rounded-3xl h-[260px] md:h-[420px]">
        
        {/* SLIDES */}
        <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            style={{ transform: `translate3d(-${indexAtual * 100}%, 0, 0)` }}
          >
          {imagens.map((item, i) => (
            <div key={i} className="min-w-full h-[260px]  md:h-[420px]">
              <a href={item.link} target="_blank" className="block w-full h-full relative">
                <img
                  src={isDark ? item.imgDark : item.imgLight}
                  alt={`Evento ${i + 1}`}
                  className="w-full h-full rounded-4xl md:rounded-3xl object-contain md:object-cover hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* SETAS DESKTOP */}
      <button
        onClick={anterior}
        className="absolute -left-12 top-1/2 hidden md:flex -translate-y-1/2 hover:scale-110 transition"
      >
        <ChevronLeft className="text-[#0E4194]/70 dark:text-[#1368f1]/70" size={42} />
      </button>

      <button
        onClick={proximo}
        className="absolute -right-12 top-1/2 hidden md:flex -translate-y-1/2 hover:scale-110 transition"
      >
        <ChevronRight className="text-[#0E4194]/70 dark:text-[#1368f1]/70" size={42} />
      </button>

      {/* SETAS MOBILE */}
      <button
        onClick={anterior}
        className="absolute left-4 top-1/2 bg-white/80 dark:bg-[#001b3d]/80 rounded-full flex md:hidden -translate-y-1/2 hover:scale-110 transition"
      >
        <ChevronLeft className="text-[#0E4194]/70 dark:text-[#1368f1]/70" size={24} />
      </button>

      <button
        onClick={proximo}
        className="absolute right-4 top-1/2 bg-white/80 dark:bg-[#001b3d]/80 rounded-full flex md:hidden -translate-y-1/2 hover:scale-110 transition"
      >
        <ChevronRight className="text-[#0E4194]/70 dark:text-[#1368f1]/70" size={24} />
      </button>

      {/* INDICADORES */}
      <div className="flex justify-center items-center gap-3 mt-2">
        {imagens.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndexAtual(i)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              indexAtual === i
                ? "bg-[#0E4194] scale-125 dark:bg-[#1368f1]"
                : "bg-[#0E4194]/30 hover:bg-[#0E4194]/60 dark:hover:bg-[#1368f1]/60 dark:bg-[#1368f1]/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}