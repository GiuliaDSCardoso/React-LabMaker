import { useState } from "react";
import { useNavigate } from "react-router-dom";

<<<<<<< Updated upstream
export default function MenuLateral() {
=======
export default function MenuLateral({darkMode}) {
>>>>>>> Stashed changes
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* ================= MOBILE - NAVBAR TOPO ================= */}
<<<<<<< Updated upstream
      <header className="md:hidden fixed top-0 left-0 w-full h-16 dark:bg-[#001028] bg-[#D9E5FA] z-50 flex items-center justify-between px-4 shadow-md">
        <img
          src="/logos/IconsNav/SenaiLogoAzul.svg"
          alt="Senai"
          className="h-8"
        />

        <div className="flex gap-6">
          <NavIcon
            src="/logos/IconsNav/IconHome.svg"
=======
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
>>>>>>> Stashed changes
            onClick={() => navigate("/")}
          />
          <NavIcon
            src="/logos/IconsNav/IconEmprestimo.svg"
            onClick={() => navigate("/emprestimo")}
          />
          <NavIcon
            src="/logos/IconsNav/IconAgenda.svg"
<<<<<<< Updated upstream
            onClick={() => navigate("/agendamento")}
          />
          <NavIcon
            src="/logos/IconsNav/IconArmazem.svg"
            onClick={() => navigate("/armazenagem")}
=======
            onClick={() => navigate("/agendauso")}
          />
          <NavIcon
            src="/logos/IconsNav/IconArmazem.svg"
            onClick={() => navigate("/guardarprojetos")}
>>>>>>> Stashed changes
          />
          <NavIcon
            src="/logos/IconsNav/IconPedidos.svg"
            onClick={() => navigate("/pedidos")}
          />
          <NavIcon
<<<<<<< Updated upstream
            src="/logos/IconsNav/IconLogin.svg"
=======
            src="/logos/IconsNav/IconContato.png"
            onClick={() => navigate("/contact")}
          />
          <NavIcon
            src="/logos/IconsNav/IconLogout.svg"
>>>>>>> Stashed changes
            onClick={() => navigate("/login")}
          />
        </div>
      </header>

      {/* ================= DESKTOP - MENU LATERAL ================= */}
      <aside
        className={`
          hidden md:flex
<<<<<<< Updated upstream
          fixed top-0  left-0
          h-screen
          bg-[#D9E5FA]
          dark:bg-[#001028]
          transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
=======
          fixed top-0 left-0
          h-screen
          transition-[width] duration-300
>>>>>>> Stashed changes
          flex-col justify-between
          z-50
          ${open ? "w-64" : "w-18"}
        `}
<<<<<<< Updated upstream
=======
        style={{
          backgroundColor: darkMode ? "#001028" : "#D9E5FA",
        }}
>>>>>>> Stashed changes
      >
        <div>
          {/* Header */}
          <div className="flex items-center p-4 h-20">
            <button
              onClick={() => setOpen(!open)}
              className="relative w-8 h-8 flex items-center justify-center"
            >
              <img
<<<<<<< Updated upstream
                src="/logos/IconsNav/MenuSenaiRecolhido.svg"
=======
                src="/logos/IconsNav/LogoFechado.svg"
>>>>>>> Stashed changes
                alt=""
                className={`absolute w-5 h-8 transition-all duration-200
                  ${open ? "opacity-0 scale-75" : "opacity-100 scale-100"}
                `}
              />

              <img
<<<<<<< Updated upstream
                src="/logos/IconsNav/MenuSenaiExpandido.svg"
=======
                src="/logos/IconsNav/LogoAberto.svg"
>>>>>>> Stashed changes
                alt=""
                className={`absolute w-5 h-8 transition-all duration-200
                  ${open ? "opacity-100 scale-100" : "opacity-0 scale-125"}
                `}
              />
            </button>

            <img
<<<<<<< Updated upstream
              src="/logos/IconsNav/SenaiLogoAzul.svg"
=======
              src="/logos/IconsNav/LogoSenai.svg"
>>>>>>> Stashed changes
              alt="Senai"
              className={`h-8 transition-all duration-300 ${
                open ? "opacity-100" : "opacity-0 w-0"
              }`}
            />
          </div>

          {/* Links */}
          <nav className="mt-10 flex flex-col gap-6 px-4">
<<<<<<< Updated upstream
            <MenuItem icon="/logos/IconsNav/IconHome.svg" label="Início" open={open} onClick={() => navigate("/")} />
            <MenuItem icon="/logos/IconsNav/IconEmprestimo.svg" label="Empréstimo" open={open} onClick={() => navigate("/emprestimo")} />
            <MenuItem icon="/logos/IconsNav/IconAgenda.svg" label="Agendamento" open={open} onClick={() => navigate("/agendamento")} />
            <MenuItem icon="/logos/IconsNav/IconArmazem.svg" label="Armazenagem" open={open} onClick={() => navigate("/armazenagem")} />
=======
            <MenuItem icon="/logos/IconsNav/IconInicio.svg" label="Início" open={open} onClick={() => navigate("/")} />
            <MenuItem icon="/logos/IconsNav/IconEmprestimo.svg" label="Empréstimo" open={open} onClick={() => navigate("/emprestimo")} />
            <MenuItem icon="/logos/IconsNav/IconAgenda.svg" label="Agendamento" open={open} onClick={() => navigate("/agendauso")} />
            <MenuItem icon="/logos/IconsNav/IconArmazem.svg" label="Armazenagem" open={open} onClick={() => navigate("/guardarprojetos")} />
>>>>>>> Stashed changes
            <MenuItem icon="/logos/IconsNav/IconPedidos.svg" label="Pedidos" open={open} onClick={() => navigate("/pedidos")} />
          </nav>
        </div>

        <div className="p-4 mb-16">
<<<<<<< Updated upstream
          <MenuItem icon="/logos/IconsNav/IconLogin.svg" label="Login" open={open} onClick={() => navigate("/login")} />
=======
          <MenuItem icon="/logos/IconsNav/IconLogout.svg" label="Login" open={open} onClick={() => navigate("/login")} />
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      <img src={src} alt="" className="w-6 h-6" />
=======
      <img src={src} alt="" className="w-6 h-6 rounded-full dark:active:bg-[#01245a] active:bg-blue-200/70" />
>>>>>>> Stashed changes
    </button>
  );
}