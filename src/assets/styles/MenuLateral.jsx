import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CloudMoon, CloudSun } from "lucide-react";

export default function MenuLateral({ darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const buttonMobileRef = useRef(null);
  const buttonDesktopRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonMobileRef.current?.contains(event.target) &&
        !buttonDesktopRef.current?.contains(event.target)
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
      {/* ================= MOBILE NAVBAR ================= */}

      <header
        className="md:hidden fixed top-0 left-0 w-full h-16 z-50 flex items-center px-4 shadow-md"
        style={{
          backgroundColor: darkMode ? "#001028" : "#D9E5FA",
        }}
      >
        {/* Botão Menu na ESQUERDA */}
        <button
          ref={buttonMobileRef}
          onClick={() => setOpen(!open)}
          className="text-2xl font-bold text-textColor dark:text-[#007AF8] w-8 z-50"
        >
          ☰
        </button>

        {/* Logo CENTRALIZADA */}
        <div className="flex-1 flex justify-center">
          <img src="/logos/IconsNav/LogoSenai.svg" alt="Senai" className="h-10" />
        </div>

        {/* Espaçador para manter a logo no centro exato */}
        <div className="w-8" />
      </header>

      {/* ================= MENU MOBILE (LADO ESQUERDO) ================= */}
      {open && (
        <div
          ref={menuRef}
          className="md:hidden fixed top-16 left-0 h-full w-64 z-50 shadow-lg flex flex-col justify-between pb-32 p-6"
          style={{
            backgroundColor: darkMode ? "#001028" : "#D9E5FA",
          }}
        >
          <div className="flex flex-col gap-4">
            <MenuItem icon="/logos/IconsNav/IconInicio.svg" label="Início" open onClick={() => navigate("/")} />
            <MenuItem icon="/logos/IconsNav/IconEmprestimo.svg" label="Empréstimo" open onClick={() => navigate("/emprestimo")} />
            <MenuItem icon="/logos/IconsNav/IconAgenda.svg" label="Agendamento" open onClick={() => navigate("/agendauso")} />
            <MenuItem icon="/logos/IconsNav/IconArmazem.svg" label="Armazenagem" open onClick={() => navigate("/guardarprojetos")} />
            <MenuItem icon="/logos/IconsNav/IconPedidos.svg" label="Pedidos" open onClick={() => navigate("/pedidos")} />
            <MenuItem icon="/logos/IconsNav/IconContato.svg" label="Contato" open onClick={() => navigate("/contact")} />
          </div>

          <div className="gap-4 flex flex-col">
            <MenuItem
              icon={darkMode ? <CloudSun /> : <CloudMoon />}
              label={darkMode ? "Modo claro" : "Modo escuro"}
              open
              onClick={() => setDarkMode(!darkMode)}
            />
            <MenuItem icon="/logos/IconsNav/IconLogin.svg" label="Login" open onClick={() => navigate("/login")} />
            
          </div>
        </div>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside
        ref={menuRef}
        className={`hidden md:flex fixed top-0 left-0 h-screen transition-[width] duration-300 flex-col justify-between z-50 ${
          open ? "w-64" : "w-18"
        }`}
        style={{
          backgroundColor: darkMode ? "#001028" : "#D9E5FA",
        }}
      >
        <div>
          {/* HEADER */}
          <div className="flex items-center p-6 h-20">
            <button
              ref={buttonDesktopRef}
              onClick={() => setOpen(!open)}
              className="relative w-8 h-8 flex items-center justify-center"
            >
              <img
                src="/logos/IconsNav/LogoFechado.svg"
                className={`absolute w-5 h-8 transition-all duration-200 ${
                  open ? "opacity-0 scale-75" : "opacity-100 scale-100"
                }`}
              />

              <img
                src="/logos/IconsNav/LogoAberto.svg"
                className={`absolute w-5 h-8 transition-all duration-200 ${
                  open ? "opacity-100 scale-100" : "opacity-0 scale-125"
                }`}
              />
            </button>

            <img
              src="/logos/IconsNav/LogoSenai.svg"
              className={`h-8 transition-all duration-300 ${
                open ? "opacity-100" : "opacity-0 w-0"
              }`}
            />
          </div>

          {/* LINKS */}
          <nav className="mt-10 flex flex-col gap-6 px-4">
            <MenuItem icon="/logos/IconsNav/IconInicio.svg" label="Início" open={open} onClick={() => navigate("/")} />
            <MenuItem icon="/logos/IconsNav/IconEmprestimo.svg" label="Empréstimo" open={open} onClick={() => navigate("/emprestimo")} />
            <MenuItem icon="/logos/IconsNav/IconAgenda.svg" label="Agendamento" open={open} onClick={() => navigate("/agendauso")} />
            <MenuItem icon="/logos/IconsNav/IconArmazem.svg" label="Armazenagem" open={open} onClick={() => navigate("/guardarprojetos")} />
            <MenuItem icon="/logos/IconsNav/IconPedidos.svg" label="Pedidos" open={open} onClick={() => navigate("/pedidos")} />
            <MenuItem icon="/logos/IconsNav/IconContato.svg" label="Contato" open={open} onClick={() => navigate("/contact")} />
          </nav>
        </div>

        {/* FOOTER */}
        <div className="p-4 mb-16 flex flex-col gap-4">
          <MenuItem
            icon={darkMode ? <CloudSun /> : <CloudMoon />}
            label={darkMode ? "Modo claro" : "Modo escuro"}
            open={open}
            onClick={() => setDarkMode(!darkMode)}
          />

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
      className="group flex items-center w-full gap-4 pl-3 py-2 rounded-lg text-blue-900 transition-colors duration-200 dark:hover:bg-[#000b1b] hover:bg-blue-200/70"
    >
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 dark:brightness-200">
        {typeof icon === "string" ? <img src={icon} alt="" /> : icon}
      </div>

      <span
        className={`font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 text-textColor dark:text-[#007AF8] ${
          open ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
        }`}
      >
        {label}
      </span>
    </button>
  );
}