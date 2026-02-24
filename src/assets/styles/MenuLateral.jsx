import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MenuLateral() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* ================= MOBILE - NAVBAR TOPO ================= */}
      <header className="md:hidden fixed top-0 left-0 w-full h-16 dark:bg-[#001028] bg-[#D9E5FA] z-50 flex items-center justify-between px-4 shadow-md">
        <img
          src="/logos/IconsNav/SenaiLogoAzul.svg"
          alt="Senai"
          className="h-8"
        />

        <div className="flex gap-6">
          <NavIcon
            src="/logos/IconsNav/IconHome.svg"
            onClick={() => navigate("/")}
          />
          <NavIcon
            src="/logos/IconsNav/IconEmprestimo.svg"
            onClick={() => navigate("/emprestimo")}
          />
          <NavIcon
            src="/logos/IconsNav/IconAgenda.svg"
            onClick={() => navigate("/agendamento")}
          />
          <NavIcon
            src="/logos/IconsNav/IconArmazem.svg"
            onClick={() => navigate("/armazenagem")}
          />
          <NavIcon
            src="/logos/IconsNav/IconPedidos.svg"
            onClick={() => navigate("/pedidos")}
          />
          <NavIcon
            src="/logos/IconsNav/IconLogin.svg"
            onClick={() => navigate("/login")}
          />
        </div>
      </header>

      {/* ================= DESKTOP - MENU LATERAL ================= */}
      <aside
        className={`
          hidden md:flex
          fixed top-0  left-0
          h-screen
          bg-[#D9E5FA]
          dark:bg-[#001028]
          transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          flex-col justify-between
          z-50
          ${open ? "w-64" : "w-18"}
        `}
      >
        <div>
          {/* Header */}
          <div className="flex items-center p-4 h-20">
            <button
              onClick={() => setOpen(!open)}
              className="relative w-8 h-8 flex items-center justify-center"
            >
              <img
                src="/logos/IconsNav/MenuSenaiRecolhido.svg"
                alt=""
                className={`absolute w-5 h-8 transition-all duration-200
                  ${open ? "opacity-0 scale-75" : "opacity-100 scale-100"}
                `}
              />

              <img
                src="/logos/IconsNav/MenuSenaiExpandido.svg"
                alt=""
                className={`absolute w-5 h-8 transition-all duration-200
                  ${open ? "opacity-100 scale-100" : "opacity-0 scale-125"}
                `}
              />
            </button>

            <img
              src="/logos/IconsNav/SenaiLogoAzul.svg"
              alt="Senai"
              className={`h-8 transition-all duration-300 ${
                open ? "opacity-100" : "opacity-0 w-0"
              }`}
            />
          </div>

          {/* Links */}
          <nav className="mt-10 flex flex-col gap-6 px-4">
            <MenuItem icon="/logos/IconsNav/IconHome.svg" label="Início" open={open} onClick={() => navigate("/")} />
            <MenuItem icon="/logos/IconsNav/IconEmprestimo.svg" label="Empréstimo" open={open} onClick={() => navigate("/emprestimo")} />
            <MenuItem icon="/logos/IconsNav/IconAgenda.svg" label="Agendamento" open={open} onClick={() => navigate("/agendamento")} />
            <MenuItem icon="/logos/IconsNav/IconArmazem.svg" label="Armazenagem" open={open} onClick={() => navigate("/armazenagem")} />
            <MenuItem icon="/logos/IconsNav/IconPedidos.svg" label="Pedidos" open={open} onClick={() => navigate("/pedidos")} />
          </nav>
        </div>

        <div className="p-4 mb-16">
          <MenuItem icon="/logos/IconsNav/IconLogin.svg" label="Login" open={open} onClick={() => navigate("/login")} />
        </div>
      </aside>
    </>
  );
}

function MenuItem({ icon, label, open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center w-full gap-4 px-3 py-2 rounded-lg text-blue-900 transition-colors duration-200 dark:hover:bg-[#000b1b] hover:bg-blue-200/70"
    >
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        <img src={icon} alt="" />
      </div>

      <span
        className={`font-semibold whitespace-nowrap transition-all duration-200
          ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 absolute"}
        `}
      >
        {label}
      </span>
    </button>
  );
}

function NavIcon({ src, onClick }) {
  return (
    <button onClick={onClick}>
      <img src={src} alt="" className="w-6 h-6" />
    </button>
  );
}