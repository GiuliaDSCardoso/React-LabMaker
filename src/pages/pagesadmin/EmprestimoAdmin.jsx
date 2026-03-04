import { useEffect, useState } from "react";
import Body from "../../assets/styles/Body";

import { DeleteIcon, PhoneIcon } from "lucide-react";

import { supabase } from "../../services/supabase";
import MenuLateralAdmin from "../../assets/styles/MenuLateralAdmin.jsx";

export default function EmprestimoAdmin() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | completed | pending
  const [historicoAberto, setHistoricoAberto] = useState(null);

  // 📦 Carregar dados do Supabase
  useEffect(() => {
    carregarSolicitacoes();
  }, []);


  async function carregarSolicitacoes() {
    const { data, error } = await supabase
      .from("emprestimos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar empréstimos:", error);
      return;
    }

    setSolicitacoes(data || []);
  }

  // 🔍 Busca + filtros
  const solicitacoesFiltradas = solicitacoes.filter((item) => {
    const textoBusca = search.toLowerCase();

    const matchTexto =
      item.solicitante?.toLowerCase().includes(textoBusca) ||
      item.contato?.toLowerCase().includes(textoBusca) ||
      item.item?.toLowerCase().includes(textoBusca);

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && item.is_completed) ||
      (statusFilter === "pending" && !item.is_completed);

    return matchTexto && matchStatus;
  });

  // ✅ Concluir
  async function marcarComoConcluido(id, historicoAtual = []) {
    const agora = new Date().toLocaleString();

    const novoHistorico = [
      ...historicoAtual,
      { data: agora, acao: "Empréstimo concluído" },
    ];

    await supabase
      .from("emprestimos")
      .update({
        is_completed: true,
        historico: novoHistorico,
      })
      .eq("id", id);

    carregarSolicitacoes();
  }

  // 🔄 Desconcluir
  async function desmarcarComoConcluido(id, historicoAtual = []) {
    const agora = new Date().toLocaleString();

    const novoHistorico = [
      ...historicoAtual,
      { data: agora, acao: "Empréstimo reaberto" },
    ];

    await supabase
      .from("emprestimos")
      .update({
        is_completed: false,
        historico: novoHistorico,
      })
      .eq("id", id);

    carregarSolicitacoes();
  }

function renderComponentes(componentes) {
  if (!componentes) return "Nenhum componente";

  if (!Array.isArray(componentes)) return componentes;

  return (
    <div className="flex flex-col gap-2">
      {componentes.map((comp, index) => (
        <div
          key={index}
          className="
            bg-blue-100 dark:bg-[#102c4d]
            text-blue-900 dark:text-blue-200
            px-3 py-2
            rounded-md
            text-sm
            w-full
          "
        >
          • {comp.nome} ({comp.quantidade})
        </div>
      ))}
    </div>
  );
}


  function abrirWhatsApp(telefone) {
    const numeroLimpo = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numeroLimpo}`, "_blank");
  }

  // 🗑️ Excluir
  async function onDeleteSolicitacao(id) {
    if (!window.confirm("Tem certeza que deseja excluir esta solicitação?")) return;

    await supabase.from("emprestimos").delete().eq("id", id);
    carregarSolicitacoes();
  }
  
  return (
  <Body>
    <MenuLateralAdmin />

    <div className="flex flex-col md:mt-12 mt-24  p-6 sm:p-8 lg:p-10 gap-8 md:ml-20
                    min-h-screen transition-colors duration-300">

      <h1 className="text-xl sm:text-2xl font-bold
                     text-[#1976d2] dark:text-blue-400">
        Solicitações de Empréstimo
      </h1>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">

        <input
          type="text"
          placeholder="Pesquisar solicitações..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[300px] h-[50px] px-3 py-2 border text-lg
                     bg-white dark:bg-transparent
                     text-gray-800 dark:text-gray-100
                     border-gray-300 dark:border-white/40
                     focus:outline-none focus:ring-1 focus:ring-blue-500
                     transition"
        />

        <div className="flex flex-wrap gap-2 text-lg">
          {["all", "pending", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`min-w-[100px] h-10 px-4 rounded transition
                ${
                  statusFilter === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                }`}
            >
              {s === "all"
                ? "Todas"
                : s === "pending"
                ? "Pendentes"
                : "Concluídas"}
            </button>
          ))}
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto shadow">
        <table className="min-w-[1200px] w-full border text-lg
                          bg-white dark:bg-transparent
                          text-gray-800 dark:text-gray-200
                          transition-colors duration-300">

          <thead className="bg-blue-100 text-blue-800
                             dark:bg-[#1e3a8a] dark:text-blue-200">
            <tr>
              {[
                "Solicitante",
                "Email",
                "Contato",
                "Curso/setor",
                "Componente",
                "Empréstimo",
                "Devolução",
                "Termos",
                "Status",
                "Ações",
              ].map((h) => (
                <th
                  key={h}
                  className="border border-gray-200 dark:border-blue-400/40 px-2 py-4 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {solicitacoesFiltradas.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Nenhuma solicitação encontrada
                </td>
              </tr>
            ) : (
              solicitacoesFiltradas.map((item) => (
                <tr
                  key={item.id}
                  className="text-center hover:bg-blue-50
                             dark:hover:bg-[#011b3f]
                             transition"
                >
                  <td className="border border-gray-200 dark:border-blue-400/40 px-2 py-4">
                    {item.solicitante}
                  </td>

                  <td className="border border-gray-200 dark:border-blue-400/40 px-2 py-4">
                    {item.email}
                  </td>

                  <td className="border border-gray-200 dark:border-blue-400/40 px-2 py-4">
                    {item.contato}
                  </td>

                  <td className="border border-gray-200 dark:border-blue-400/40 px-2 py-4">
                    {item.curso_turma}
                  </td>

                  <td className="border border-gray-200 dark:border-blue-400/40 px-2 py-4">
                    {renderComponentes(item.item)}
                  </td>

                  <td className="border border-gray-200 dark:border-blue-400/40 px-2 py-4">
                    {item.data_saida}
                  </td>

                  <td className="border border-gray-200 dark:border-blue-400/40 px-2 py-4">
                    {item.data_retorno}
                  </td>

                  <td className="border border-gray-200 dark:border-blue-400/40 px-2 py-4">
                    {item.termos_aceitos ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        Aceito
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        Não aceito
                      </span>
                    )}
                  </td>

                  <td className="border border-gray-200 dark:border-blue-400/40 px-2 py-4">
                    {item.is_completed ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        Concluído
                      </span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        Pendente
                      </span>
                    )}
                  </td>

                  <td className="border border-gray-200 dark:border-blue-400/40 px-2 py-4">
                    <div className="flex flex-wrap gap-2 justify-center">

                      {!item.is_completed ? (
                        <button
                          onClick={() =>
                            marcarComoConcluido(item.id, item.historico)
                          }
                          className="bg-green-500 hover:bg-green-700
                                     text-white px-3 py-2 rounded transition"
                        >
                          Concluir
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            desmarcarComoConcluido(item.id, item.historico)
                          }
                          className="bg-yellow-500 hover:bg-yellow-700
                                     text-white px-3 py-2 rounded transition"
                        >
                          Reabrir
                        </button>
                      )}

                      <button
                        onClick={() => abrirWhatsApp(item.contato)}
                        className="bg-green-600 hover:bg-green-800
                                   text-white p-2 rounded transition"
                      >
                        <PhoneIcon size={14} />
                      </button>

                      <button
                        onClick={() => setHistoricoAberto(item)}
                        className="bg-blue-500 hover:bg-blue-700
                                   text-white px-3 py-2 rounded transition"
                      >
                        Histórico
                      </button>

                      <button
                        onClick={() => onDeleteSolicitacao(item.id)}
                        className="bg-red-500 hover:bg-red-700
                                   text-white p-2 rounded transition"
                      >
                        <DeleteIcon size={16} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* MODAL HISTÓRICO */}
    {historicoAberto && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white dark:bg-[#1e293b]
                        text-gray-800 dark:text-gray-200
                        w-full max-w-[500px]
                        p-6 rounded shadow-lg
                        transition-colors duration-300">

          <h2 className="font-bold mb-4 text-[#1976d2] dark:text-blue-400">
            Histórico – {historicoAberto.solicitante}
          </h2>

          <ul className="space-y-2 text-sm max-h-[300px] overflow-y-auto">
            {historicoAberto.historico?.map((h, i) => (
              <li
                key={i}
                className="border-b border-gray-200 dark:border-gray-700 pb-1"
              >
                <strong>{h.data}</strong> — {h.acao}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setHistoricoAberto(null)}
            className="mt-4 bg-[#1976d2] hover:bg-blue-800
                       text-white px-4 py-2 rounded w-full transition"
          >
            Fechar
          </button>
        </div>
      </div>
    )}
  </Body>
);
}
