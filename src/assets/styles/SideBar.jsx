import { useState } from "react";
import {
  CalendarSearchIcon,
  FileBoxIcon,
  PackagePlusIcon,
  ReplaceIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useAdminBadges } from "../../hooks/useAdminBadges.jsx";

export default function Sidebar() {
  const [aberto, setAberto] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const badges = useAdminBadges();

  return (
    <>
      {/* NAV MOBILE */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0f2a44] text-white flex items-center px-4 z-50">
        <button onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </button>
        <span className="ml-4 font-bold">Lab Maker Admin</span>
      </div>

      {/* OVERLAY MOBILE */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50 h-screen bg-[#0f2a44] text-white
          transition-all duration-300 flex flex-col
          ${aberto ? "w-64" : "w-20"}
          ${mobileOpen ? "left-0" : "-left-full"} md:left-0
        `}
      >
        {/* TOPO */}
        <div className="h-14 flex items-center justify-between px-4">
          <button
            onClick={() => setAberto(!aberto)}
            className="hidden md:block"
          >
            <MenuIcon />
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden"
          >
            <XIcon />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-1 mt-4">
          <NavItem
            href="/agendaadmin"
            icon={<CalendarSearchIcon size={20} />}
            label="Agenda"
            badge={badges.agenda}
            aberto={aberto}
            onClick={() => setMobileOpen(false)}
          />

          <NavItem
            href="/emprestimoadmin"
            icon={<ReplaceIcon size={20} />}
            label="Empréstimos"
            badge={badges.emprestimos}
            aberto={aberto}
            onClick={() => setMobileOpen(false)}
          />

          <NavItem
            href="/pedidosadmin"
            icon={<PackagePlusIcon size={20} />}
            label="Pedidos"
            badge={badges.pedidos}
            aberto={aberto}
            onClick={() => setMobileOpen(false)}
          />

          <NavItem
            href="/guardaradmin"
            icon={<FileBoxIcon size={20} />}
            label="Projetos"
            badge={badges.projetos}
            aberto={aberto}
            onClick={() => setMobileOpen(false)}
          />
        </nav>
      </aside>
    </>
  );
}

function NavItem({ href, icon, label, badge, aberto, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-800 transition-colors"
    >
      {icon}

      {aberto && <span className="flex-1">{label}</span>}

      {badge > 0 && (
        <span className="bg-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </a>
  );
}
