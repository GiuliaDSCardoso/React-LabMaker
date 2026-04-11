import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { CloudMoon, CloudSun } from "lucide-react";

export default function MenuLateralAdmin({ darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);

  const [qtdEmprestimos, setQtdEmprestimos] = useState(0);
  const [qtdProjetos, setQtdProjetos] = useState(0);
  const [qtdPedidos, setQtdPedidos] = useState(0);
  const [qtdAgendamentos, setQtdAgendamentos] = useState(0);

  const navigate = useNavigate();

  const menuRef = useRef(null);
  const buttonMobileRef = useRef(null);
  const buttonDesktopRef = useRef(null);

  async function logout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  // ===============================
  // CARREGAR CONTADORES
  // ===============================
  async function carregarContadores() {
    const { count: emprestimos } = await supabase
      .from("emprestimos")
      .select("*", { count: "exact", head: true })
      .eq("is_completed", false);

    const { count: projetos } = await supabase
      .from("projetos")
      .select("*", { count: "exact", head: true })
      .eq("is_completed", false);

    const { count: pedidos } = await supabase
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .eq("is_completed", false);

    const { count: agendamentos } = await supabase
      .from("agendamentos")
      .select("*", { count: "exact", head: true })
      .eq("status", "ocupado");

    setQtdEmprestimos(emprestimos || 0);
    setQtdProjetos(projetos || 0);
    setQtdPedidos(pedidos || 0);
    setQtdAgendamentos(agendamentos || 0);
  }

  // ===============================
  // REALTIME
  // ===============================
  useEffect(() => {
    carregarContadores();

    const channel = supabase
      .channel("notificacoes-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "emprestimos" },
        carregarContadores
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projetos" },
        carregarContadores
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pedidos" },
        carregarContadores
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agendamentos" },
        carregarContadores
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ===============================
  // CLICK OUTSIDE
  // ===============================
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
      {/* MOBILE */}
    {/* MOBILE */}
      <header
        className="md:hidden fixed top-0 left-0 w-full h-16 z-50 flex items-center px-4 shadow-md"
        style={{
          backgroundColor: darkMode ? "#001028" : "#D9E5FA",
        }}
      >
        {/* 1. Botão Hambúrguer agora na ESQUERDA */}
        <button
          ref={buttonMobileRef}
          onClick={() => setOpen(!open)}
          className="text-2xl font-bold text-textColor dark:text-[#007AF8] z-50 w-8"
        >
          ☰
        </button>

        {/* 2. Logo Centralizada */}
        <div className="flex-1 flex justify-center">
          <img
            src="/logos/IconsNav/LogoSenai.svg"
            alt="Senai"
            className="h-8"
          />
        </div>

        {/* 3. Espaçador na DIREITA para manter a logo matematicamente no centro */}
        <div className="w-8" /> 
      </header>

      {/* MENU MOBILE (Lateral Esquerda) */}
      {open && (
        <div
          ref={menuRef}
          className="md:hidden fixed top-16 left-0 h-full w-64 z-50 shadow-lg flex flex-col justify-between pb-32 p-6"
          style={{
            backgroundColor: darkMode ? "#001028" : "#D9E5FA",
          }}
        >
          <div className="flex flex-col gap-4">
            <MenuItem icon="/logos/IconsNav/IconInicio.svg" label="Home" open badge={0} onClick={() => navigate("/admin")} />
            <MenuItem icon="/logos/IconsNav/IconEmprestimo.svg" label="Empréstimos" open badge={qtdEmprestimos} onClick={() => navigate("/emprestimoadmin")} />
            <MenuItem icon="/logos/IconsNav/IconAgenda.svg" label="Agenda" open badge={qtdAgendamentos} onClick={() => navigate("/agendaadmin")} />
            <MenuItem icon="/logos/IconsNav/IconArmazem.svg" label="Projetos" open badge={qtdProjetos} onClick={() => navigate("/guardaradmin")} />
            <MenuItem icon="/logos/IconsNav/IconPedidos.svg" label="Pedidos" open badge={qtdPedidos} onClick={() => navigate("/pedidosadmin")} />
          </div>

          <div>
            <MenuItem
              icon={darkMode ? <CloudSun /> : <CloudMoon />}
              label={darkMode ? "Modo claro" : "Modo escuro"}
              open
              onClick={() => setDarkMode(!darkMode)}
            />
            <MenuItem icon="/logos/IconsNav/IconLogout.svg" label="Sair" open onClick={logout} />
          </div>
        </div>
      )}
      {/* DESKTOP */}
      <aside
        ref={menuRef}
        className={`hidden md:flex fixed top-0 left-0 h-screen transition-[width] duration-300 flex-col justify-between z-50 ${open ? "w-64" : "w-18"}`}
        style={{
          backgroundColor: darkMode ? "#001028" : "#D9E5FA",
        }}
      >
        <div>

          <div className="flex items-center p-6 h-20">
            <button
              ref={buttonDesktopRef}
              onClick={() => setOpen(!open)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <img src="/logos/IconsNav/LogoFechado.svg" className="w-5 h-8" />
            </button>

            {open && (
              <img src="/logos/IconsNav/LogoSenai.svg" className="h-8 ml-4" />
            )}
          </div>

          <nav className="mt-10 flex flex-col gap-6 px-4">

            <MenuItem icon="/logos/IconsNav/IconInicio.svg" label="Home" open={open} onClick={() => navigate("/admin")} />

            <MenuItem icon="/logos/IconsNav/IconEmprestimo.svg" label="Empréstimo" open={open} badge={qtdEmprestimos} onClick={() => navigate("/emprestimoadmin")} />

            <MenuItem icon="/logos/IconsNav/IconAgenda.svg" label="Agenda" open={open} badge={qtdAgendamentos} onClick={() => navigate("/agendaadmin")} />

            <MenuItem icon="/logos/IconsNav/IconArmazem.svg" label="Guardar Projetos" open={open} badge={qtdProjetos} onClick={() => navigate("/guardaradmin")} />

            <MenuItem icon="/logos/IconsNav/IconPedidos.svg" label="Pedidos" open={open} badge={qtdPedidos} onClick={() => navigate("/pedidosadmin")} />



          </nav>
        </div>

        <div className="p-4 flex flex-col gap-6 px-4 mb-16">
          <MenuItem
            icon={darkMode ? <CloudSun /> : <CloudMoon />}
            label={darkMode ? "Modo claro" : "Modo escuro"}
            open={open}
            onClick={() => setDarkMode(!darkMode)}
          />
          <MenuItem icon="/logos/IconsNav/IconLogout.svg" label="Sair" open={open} onClick={logout} />

          

        </div>
      </aside>
    </>
  );
}

/* ================= COMPONENTE ================= */

function MenuItem({ icon, label, open, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center w-full gap-4 px-2 py-2 rounded-lg text-blue-900 hover:bg-blue-200/70"
    >
      <div className="relative w-6 h-6 flex items-center justify-center dark:brightness-200">

        {typeof icon === "string" ? <img src={icon} alt="" /> : icon}

        {badge > 0 && (
          <span className="absolute -top-1 w-4 h-4 flex items-center justify-center -right-2 bg-red-600/70 text-white text-xs font-bold rounded-full">
            {badge}
          </span>
        )}

      </div>

      {open && (
        <span className="font-semibold text-[#007AF8]">
          {label}
        </span>
      )}
    </button>
  );
}