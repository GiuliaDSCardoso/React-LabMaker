import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MenuLateral({darkMode}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
  function handleClickOutside(event) {
    if (
      open &&
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [open]);

  return (
    <>
      {/* ================= MOBILE - NAVBAR TOPO ================= */}
      <header
        className="md:hidden fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-4 shadow-md transition-colors duration-300"
        style={{
          backgroundColor: darkMode ? "#001028" : "#D9E5FA",
        }}
      >
        <img
          src="/logos/IconsNav/LogoSenai.svg"
          alt="Senai"
          className="h-6"
        />

        <div className="flex gap-4">
          <NavIcon
            src="/logos/IconsNav/IconInicio.svg"
            onClick={() => navigate("/")}
          />
          <NavIcon
            src="/logos/IconsNav/IconEmprestimo.svg"
            onClick={() => navigate("/emprestimo")}
          />
          <NavIcon
            src="/logos/IconsNav/IconAgenda.svg"
            onClick={() => navigate("/agendauso")}
          />
          <NavIcon
            src="/logos/IconsNav/IconArmazem.svg"
            onClick={() => navigate("/guardarprojetos")}
          />
          <NavIcon
            src="/logos/IconsNav/IconPedidos.svg"
            onClick={() => navigate("/pedidos")}
          />
          <NavIcon
            src="/logos/IconsNav/IconContato.svg"
            onClick={() => navigate("/contact")}
          />
          <NavIcon
            src="/logos/IconsNav/IconLogout.svg"
            onClick={() => navigate("/login")}
          />
        </div>
      </header>

      {/* ================= DESKTOP - MENU LATERAL ================= */}
      <aside
        ref={menuRef}
        className={`
          hidden md:flex
          fixed top-0 left-0
          h-screen
          transition-[width] duration-300
          flex-col justify-between
          z-50
          ${open ? "w-64" : "w-18"}
        `}
        style={{
          backgroundColor: darkMode ? "#001028" : "#D9E5FA",
        }}
      >
        <div>
          {/* Header */}
          <div className="flex items-center p-6 h-20">
            <button
              onClick={() => setOpen(!open)}
              className="relative w-8 h-8 flex items-center justify-center"
            >
              <img
                src="/logos/IconsNav/LogoFechado.svg"
                alt=""
                className={`absolute w-5 h-8 transition-all duration-200
                  ${open ? "opacity-0 scale-75" : "opacity-100 scale-100"}
                `}
              />

              <img
                src="/logos/IconsNav/LogoAberto.svg"
                alt=""
                className={`absolute w-5 h-8 transition-all  duration-200
                  ${open ? "opacity-100 scale-100" : "opacity-0 scale-125"}
                `}
              />
            </button>

            <img
              src="/logos/IconsNav/LogoSenai.svg"
              alt="Senai"
              className={`h-8 transition-all  duration-300 ${
                open ? "opacity-100" : "opacity-0 w-0"
              }`}
            />
          </div>

          {/* Links */}
          <nav className="mt-10 flex flex-col gap-6 px-4">
            <MenuItem icon="/logos/IconsNav/IconInicio.svg" label="Início" open={open} onClick={() => navigate("/")} />
            <MenuItem icon="/logos/IconsNav/IconEmprestimo.svg" label="Empréstimo" open={open} onClick={() => navigate("/emprestimo")} />
            <MenuItem icon="/logos/IconsNav/IconAgenda.svg" label="Agendamento" open={open} onClick={() => navigate("/agendauso")} />
            <MenuItem icon="/logos/IconsNav/IconArmazem.svg" label="Armazenagem" open={open} onClick={() => navigate("/guardarprojetos")} />
            <MenuItem icon="/logos/IconsNav/IconPedidos.svg" label="Pedidos" open={open} onClick={() => navigate("/pedidos")} />
            <MenuItem icon="/logos/IconsNav/IconContato.svg" label="Contato" open={open} onClick={() => navigate("/contact")} />
            
          </nav>
        </div>

        <div className="p-4 mb-16">
          <MenuItem icon="/logos/IconsNav/IconLogout.svg" label="Login" open={open} onClick={() => navigate("/login")} />
        </div>
      </aside>
    </>
  );
}

function MenuItem({ icon, label, open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center  w-full gap-4 px-2 py-2 rounded-lg text-blue-900 transition-colors duration-200 dark:hover:bg-[#000b1b] hover:bg-blue-200/70"
    >
      <div className="w-6 h-6 flex items-center dark:brightness-200 justify-center flex-shrink-0">
        <img src={icon} alt="" />
      </div>

      <span
        className={`
          font-semibold whitespace-nowrap overflow-hidden
          transition-all duration-300 text-[#007AF8] ease-in-out
          ${open 
            ? "opacity-100 max-w-[200px] ml-0" 
            : "opacity-0 max-w-0 ml-[-8px]"
          }
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
      <img src={src} alt="" className="w-5 h-9 rounded-full dark:active:bg-[#01245a] dark:brightness-200 active:bg-blue-200/70" />
    </button>
  );
}