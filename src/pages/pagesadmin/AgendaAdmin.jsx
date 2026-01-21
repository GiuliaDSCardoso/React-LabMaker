import { useEffect, useState } from "react";
import AddAgendamento from "../../components/AddAgendamento";
import { MoveLeftIcon, Phone } from "lucide-react";
import Body from "../../assets/styles/Body";
import { useNavigate } from "react-router-dom";

export default function AgendaAdmin() {
  const navigate = useNavigate();
  const [todosDados, setTodosDados] = useState([]);
  const [filtro, setFiltro] = useState("recentes"); 
// recentes | semana

  function carregar() {
    const admin =
      JSON.parse(localStorage.getItem("agendamentos_admin")) || [];
    const usuarios =
      JSON.parse(localStorage.getItem("solicitacoes_usuario")) || [];

    const hoje = new Date().toISOString().slice(0, 10);

    const ativos = [...admin, ...usuarios].filter(
      (a) => a.data >= hoje
    );

    const historico = [...admin, ...usuarios].filter(
      (a) => a.data < hoje
    );

    localStorage.setItem(
      "historico_agendamentos",
      JSON.stringify(historico)
    );

    setTodosDados(ativos);
}

  function onBackClick() {
    navigate(-1);
  }
  useEffect(() => {
  carregar();

  function onStorageChange() {
    carregar();
  }

  window.addEventListener("storage", onStorageChange);

  return () => {
    window.removeEventListener("storage", onStorageChange);
  };
}, []);
 function inicioDaSemana() {
  const hoje = new Date();
  const dia = hoje.getDay(); // 0 = domingo
  const diff = hoje.getDate() - dia + (dia === 0 ? -6 : 1);
  return new Date(hoje.setDate(diff));
}

function fimDaSemana(inicio) {
  const fim = new Date(inicio);
  fim.setDate(inicio.getDate() + 6);
  return fim;
}

function aplicarFiltro() {
  if (filtro === "recentes") {
    return [...todosDados].sort(
      (a, b) => b.createdAt - a.createdAt
    );
  }

  if (filtro === "semana") {
    const inicio = inicioDaSemana();
    const fim = fimDaSemana(inicio);

    return todosDados.filter((item) => {
      const dataItem = new Date(item.data);
      return dataItem >= inicio && dataItem <= fim;
    });
  }

  return todosDados;
}

function formatarDataHora(timestamp) {
  if (!timestamp) return "";

  const data = new Date(timestamp);

  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }) + " às " + data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
function isExpirado(item) {
  const agora = new Date();

  // Data do agendamento no final do dia (23:59:59)
  const fimDoDia = new Date(item.data + "T23:59:59");

  return agora > fimDoDia;
}

  return (
     <Body>
      <header className="flex items-center bg-gradient-to-r mb-[2%] from-[#1976d2] to-blue-800 h-40 px-6">
        <button
          onClick={onBackClick}
          className="text-white bg-[#0062c4] p-2 rounded-full"
        >
          <MoveLeftIcon />
        </button>

        <h1 className="text-3xl text-white font-bold text-center w-full">
          Solicitação de empréstimo <br /> de componentes
        </h1>
      </header>

    <div className="flex flex-col justify-center items-center p-6 w-full  space-y-6">
      <AddAgendamento onAdd={carregar} />

      <h2 className="text-xl font-bold">Solicitações / Ocupações</h2>
      <div className="flex gap-4 mb-4">
      <button
        onClick={() => setFiltro("recentes")}
        className={`px-4 py-2 rounded ${
          filtro === "recentes"
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        Mais recentes
      </button>

      <button
        onClick={() => setFiltro("semana")}
        className={`px-4 py-2 rounded ${
          filtro === "semana"
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        Esta semana
      </button>
    </div>

      {aplicarFiltro().map((item) => (

        <div
          key={item.id}
          className={`w-[50%] p-4 rounded shadow space-y-1
            ${isExpirado(item)
              ? "bg-gray-200 text-gray-500 opacity-80"
              : "bg-white"}
          `}

        >
          <p><b>Data:</b> {item.data}</p>
          <p>
            <b>Horário:</b>{" "}
            {item.diaInteiro
              ? "Dia inteiro"
              : `${item.horaInicio} - ${item.horaFim}`}
          </p>
          {isExpirado(item) && (
              <p className="text-sm font-semibold text-gray-600">
                ⚠️ Alocação expirada
              </p>
            )}

          <p className="text-sm text-[#2756ac]">
            <b>Solicitado em:</b> {formatarDataHora(item.createdAt)}
          </p>
          <p><b>Motivo:</b> {item.motivo}</p>
          {item.tipo === "ADMIN" && (
            <p className="text-sm text-[#2756ac] font-semibold">
              Solicitado pelo administrador
            </p>
          )}

          {item.tipo === "USUARIO" && (
            <>
              <p><b>Solicitante:</b> {item.nome}</p>
              <p><b>Email:</b> {item.email}</p>

              <a
                href={`https://wa.me/55${item.telefone.replace(/\D/g, "")}`}
                target="_blank"
                className="inline-flex items-center gap-2 text-green-600"
              >
                <Phone size={18} /> WhatsApp
              </a>
            </>
          )}
          

        </div>
      ))}
    </div>
    </Body>
  );
}
