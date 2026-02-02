import { useEffect, useState } from "react";
import AddAgendamento from "../../components/AddAgendamento";
import { Phone, Trash2 } from "lucide-react";
import Body from "../../assets/styles/Body";
import NavAdmin from "../../assets/styles/NavAdmin";
import { supabase } from "../../services/supabase";

export default function AgendaAdmin() {
  const [todosDados, setTodosDados] = useState([]);
  const [filtro, setFiltro] = useState("recentes");

  async function carregar() {
    const { data, error } = await supabase
      .from("agendamentos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setTodosDados(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function removerAgendamento(id) {
    const confirmar = confirm("Tem certeza que deseja remover esta solicitação?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao remover");
      console.error(error);
      return;
    }

    carregar();
  }

  function formatarDataHora(timestamp) {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString("pt-BR");
  }

  function isExpirado(item) {
    const agora = new Date();
    const fimDoDia = new Date(item.data + "T23:59:59");
    return agora > fimDoDia;
  }

  function inicioDaSemana() {
    const hoje = new Date();
    const dia = hoje.getDay();
    const diff = hoje.getDate() - dia + (dia === 0 ? -6 : 1);
    return new Date(hoje.setDate(diff));
  }

  function fimDaSemana(inicio) {
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);
    return fim;
  }

  function aplicarFiltro(lista, filtro) {
    const hoje = new Date().toISOString().slice(0, 10);

    if (filtro === "hoje") {
      return lista.filter((i) => i.data === hoje);
    }

    if (filtro === "semana") {
      const inicio = inicioDaSemana();
      const fim = fimDaSemana(inicio);

      return lista.filter((item) => {
        const dataItem = new Date(item.data);
        return dataItem >= inicio && dataItem <= fim;
      });
    }

    return [...lista].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }

  return (
    <Body>
      <NavAdmin />

      <header
        className="
        flex items-center
        bg-gradient-to-r from-[#1976d2] to-blue-800
        py-10 md:py-16 lg:py-20
        px-6
      "
      >
        <h1 className="text-3xl text-white font-bold text-center w-full">
          Solicitação de Agendamento<br /> do LabMaker
        </h1>
      </header>

      <div className="flex flex-col justify-center items-center p-6 w-full space-y-6">
        <AddAgendamento onAdd={carregar} />

        <h2 className="text-xl md:text-2xl font-bold">
          Solicitações / Ocupações
        </h2>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setFiltro("recentes")}
            className={`px-4 py-2 text-lg md:text-xl rounded ${
              filtro === "recentes"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Mais recentes
          </button>

          <button
            onClick={() => setFiltro("hoje")}
            className={`px-4 py-2 text-lg md:text-xl rounded ${
              filtro === "hoje" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Hoje
          </button>

          <button
            onClick={() => setFiltro("semana")}
            className={`px-4 py-2 text-lg md:text-xl rounded ${
              filtro === "semana" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Esta semana
          </button>
        </div>

        {aplicarFiltro(todosDados, filtro).map((item) => (
          <div
            key={item.id}
            className={`md:w-[50%]w-[100%] p-4 rounded shadow space-y-1
              ${
                isExpirado(item)
                  ? "bg-gray-200 text-gray-500 opacity-80"
                  : "bg-white"
              }
            `}
          >
            <p className="text-lg md:text-xl">
              <b>Data:</b> {item.data}
            </p>

            <p className="text-lg md:text-xl">
              <b>Horário:</b>{" "}
              {item.dia_inteiro
                ? "Dia inteiro"
                : `${item.hora_inicio} - ${item.hora_fim}`}
            </p>

            {isExpirado(item) && (
              <p className="text-lg md:text-xl font-semibold text-gray-600">
                ⚠️ Alocação expirada
              </p>
            )}

            <p className="text-lg md:text-xl text-[#2756ac]">
              <b>Solicitado em:</b> {formatarDataHora(item.created_at)}
            </p>

            <p className="text-lg md:text-xl">
              <b>Motivo:</b> {item.motivo}
            </p>

            {item.tipo === "ADMIN" && (
              <p className="text-lg md:text-xl text-[#2756ac] font-semibold">
                Solicitado pelo administrador
              </p>
            )}

            {item.tipo === "USUARIO" && (
              <>
                <p className="text-lg md:text-xl">
                  <b>Solicitante:</b> {item.historico?.nome}
                </p>
                <p className="text-lg md:text-xl">
                  <b>Email:</b> {item.historico?.email}
                </p>

                <a
                  href={`https://wa.me/55${item.historico?.telefone?.replace(
                    /\D/g,
                    ""
                  )}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-green-600"
                >
                  <Phone size={18} /> WhatsApp
                </a>
              </>
            )}

            {/* BOTÃO REMOVER */}
            <button
              onClick={() => removerAgendamento(item.id)}
              className="mt-3 flex items-center gap-2 text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} /> Remover
            </button>
          </div>
        ))}
      </div>
    </Body>
  );
}
