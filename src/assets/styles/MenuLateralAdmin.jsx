import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function MenuLateralAdmin({ darkMode }) {
  const [open, setOpen] = useState(false);

  const [qtdEmprestimos, setQtdEmprestimos] = useState(0);
  const [qtdProjetos, setQtdProjetos] = useState(0);
  const [qtdPedidos, setQtdPedidos] = useState(0);
  const [qtdAgendamentos, setQtdAgendamentos] = useState(0); // 🔥 NOVO

  const navigate = useNavigate();
  const menuRef = useRef(null);

  async function logout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  // ===============================
  // 🔥 CARREGAR CONTADORES
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

    // 🔥 AGENDAMENTOS (status ocupado)
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
  // 🔥 REALTIME
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
  // FECHAR MENU AO CLICAR FORA
  // ===============================
  useEffect(() => {
    function handleClickOutside(event) {
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
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
      {/* ================= MOBILE ================= */}
      <header
        className="md:hidden fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-4 shadow-md"
        style={{
          backgroundColor: darkMode ? "#001028" : "#D9E5FA",
        }}
      >
        <img src="/logos/IconsNav/LogoSenai.svg" alt="Senai" className="h-6" />

        <div className="flex gap-4">
          <NavIcon
            src="/logos/IconsNav/IconInicio.svg"
            onClick={() => navigate("/admin")}
          />

          

          <NavIcon
            src="/logos/IconsNav/IconEmprestimo.svg"
            badge={qtdEmprestimos}
            onClick={() => navigate("/emprestimoadmin")}
          />
          <NavIcon
            src="/logos/IconsNav/IconAgenda.svg" // 🔥 ÍCONE RESTAURADO
            badge={qtdAgendamentos}
            onClick={() => navigate("/agendaadmin")}
          />

          <NavIcon
            src="/logos/IconsNav/IconArmazem.svg"
            badge={qtdProjetos}
            onClick={() => navigate("/guardaradmin")}
          />

          <NavIcon
            src="/logos/IconsNav/IconPedidos.svg"
            badge={qtdPedidos}
            onClick={() => navigate("/pedidosadmin")}
          />

          <NavIcon
            src="/logos/IconsNav/IconLogout.svg"
            onClick={logout}
          />
        </div>
      </header>

      {/* ================= DESKTOP ================= */}
      <aside
        ref={menuRef}
        className={`
          hidden md:flex fixed top-0 left-0 h-screen
          transition-[width] duration-300
          flex-col justify-between z-50
          ${open ? "w-64" : "w-18"}
        `}
        style={{
          backgroundColor: darkMode ? "#001028" : "#D9E5FA",
        }}
      >
        <div>
          <div className="flex items-center p-6 h-20">
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <img
                src="/logos/IconsNav/LogoFechado.svg"
                alt=""
                className="w-5 h-8"
              />
            </button>

            {open && (
              <img
                src="/logos/IconsNav/LogoSenai.svg"
                alt="Senai"
                className="h-8 ml-4"
              />
            )}
          </div>

          <nav className="mt-10 flex flex-col gap-6 px-4">
            <MenuItem
              icon="/logos/IconsNav/IconInicio.svg"
              label="Home"
              open={open}
              onClick={() => navigate("/admin")}
            />

           

            <MenuItem
              icon="/logos/IconsNav/IconEmprestimo.svg"
              label="Empréstimo"
              open={open}
              badge={qtdEmprestimos}
              onClick={() => navigate("/emprestimoadmin")}
            />
             <MenuItem
              icon="/logos/IconsNav/IconAgenda.svg" // 🔥 RESTAURADO
              label="Agenda"
              open={open}
              badge={qtdAgendamentos}
              onClick={() => navigate("/agendaadmin")}
            />

            <MenuItem
              icon="/logos/IconsNav/IconArmazem.svg"
              label="Guardar Projetos"
              open={open}
              badge={qtdProjetos}
              onClick={() => navigate("/guardaradmin")}
            />

            <MenuItem
              icon="/logos/IconsNav/IconPedidos.svg"
              label="Pedidos"
              open={open}
              badge={qtdPedidos}
              onClick={() => navigate("/pedidosadmin")}
            />
          </nav>
        </div>

        <div className="p-4 mb-16">
          <MenuItem
            icon="/logos/IconsNav/IconLogout.svg"
            label="Sair"
            open={open}
            onClick={logout}
          />
        </div>
      </aside>
    </>
  );
}

/* ================= COMPONENTES ================= */

function MenuItem({ icon, label, open, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center w-full gap-4 px-2 py-2 rounded-lg text-blue-900 hover:bg-blue-200/70"
    >
      <div className="relative w-6 h-6 flex dark:brightness-200 items-center justify-center">
        <img src={icon} alt="" />

        {badge > 0 && (
          <span className="absolute -top-1 w-4 h-4 justify-center flex items-center -right-2 bg-red-600/70 text-white text-xs font-bold px-1.5 rounded-full">
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

function NavIcon({ src, onClick, badge }) {
  return (
    <button onClick={onClick} className="relative">
      <img src={src} alt="" className="w-5 h-9 dark:brightness-200" />

      {badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}