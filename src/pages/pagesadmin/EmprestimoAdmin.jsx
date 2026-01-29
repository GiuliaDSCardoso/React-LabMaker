import { useEffect, useState } from "react";
import Body from "../../assets/styles/Body";

import { DeleteIcon, PhoneIcon } from "lucide-react";
import NavAdminBlue from "../../assets/styles/NavAdminBlue.jsx";
import { supabase } from "../../services/supabase";

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

    // caso seja string (campo item)
    if (typeof componentes === "string") return componentes;

    return (
      <ul className="space-y-1 text-left">
        {componentes.map((item, index) => (
          <li key={index} className="bg-blue-50 px-2 py-1 rounded text-xs">
            • {item}
          </li>
        ))}
      </ul>
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
      <NavAdminBlue />
      <div className="flex flex-col p-10 gap-10 ">
        <div className="flex items-center text-[#1769bb] justify-between ">
          <h1 className="text-2xl font-bold w-[95%] text-[#1976d2]">
            Solicitações de Empréstimo
          </h1>
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap justify-between gap-4">
          <input
            type="text"
            placeholder="Pesquisar solicitações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px] h-[50px] px-3 py-2 border text-lg
                focus:outline-none
                focus:ring-1
                focus:border-blue-50"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`min-w-[90px] h-12 px-3 rounded text-xl ${
                statusFilter === "all"
                   ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
              }`}
            >
              Todas
            </button>

            <button
              onClick={() => setStatusFilter("pending")}
              className={`min-w-[90px] h-12 px-3 rounded text-xl ${
                statusFilter === "pending"
                   ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
              }`}
            >
              Pendentes
            </button>

            <button
              onClick={() => setStatusFilter("completed")}
              className={`min-w-[90px] h-12 px-3 rounded text-xl ${
                statusFilter === "completed"
                   ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
              }`}
            >
              Concluídas
            </button>
          </div>
        </div>

        {/* TABELA */}
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white text-xl">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="border px-2 py-4">Solicitante</th>
                <th className="border px-2 py-4">Email</th>
                <th className="border px-2 py-4">Contato</th>
                <th className="border px-2 py-4">Curso e Turma</th>
                <th className="border px-2 py-4">Componente</th>
                <th className="border px-2 py-4">Empréstimo</th>
                <th className="border px-2 py-4">Devolução</th>
                <th className="border px-2 py-4">Status</th>
                <th className="border px-2 py-4">Ações</th>
              </tr>
            </thead>

            <tbody>
              {solicitacoesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Nenhuma solicitação encontrada
                  </td>
                </tr>
              ) : (
                solicitacoesFiltradas.map((item) => (
                  <tr key={item.id} className="text-center hover:bg-blue-50">
                    <td className="border px-2 py-4">{item.solicitante}</td>
                    <td className="border px-2 py-4">{item.email}</td>
                    <td className="border px-2 py-4">{item.contato}</td>
                    <td className="border px-2 py-4">{item.curso_turma}</td>
                    <td className="border px-2 py-4">
                      {renderComponentes(item.item)}
                    </td>
                    <td className="border px-2 py-4">{item.data_saida}</td>
                    <td className="border px-2 py-4">{item.data_retorno}</td>
                    <td className="border px-2 py-4">
                      {item.is_completed ? (
                        <span className="text-green-600 font-semibold">
                          Concluído
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="border px-2 py-4 flex gap-2 justify-center">
                      {!item.is_completed ? (
                        <button
                          onClick={() =>
                            marcarComoConcluido(item.id, item.historico)
                          }
                          className="bg-green-500 text-white px-2 py-2 rounded text-xl"
                        >
                          Concluir
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            desmarcarComoConcluido(item.id, item.historico)
                          }
                          className="bg-yellow-500 text-white px-2 py-2 rounded text-xl"
                        >
                          Desconcluir
                        </button>
                      )} 
                      <button
                        onClick={() => abrirWhatsApp(item.contato)}
                        className="bg-green-600 text-white px-2 py-2 rounded text-xl"
                      >
                        <PhoneIcon size={14} />
                      </button>

                      <button
                        onClick={() => setHistoricoAberto(item)}
                        className="bg-blue-500 text-white px-2 py-2 rounded text-xl"
                      >
                        Histórico
                      </button>

                     

                      <button
                        onClick={() => onDeleteSolicitacao(item.id)}
                        className="bg-red-500 text-white p-2 rounded"
                      >
                        <DeleteIcon size={16} />
                      </button>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] p-6 rounded shadow">
            <h2 className="font-bold mb-4 text-[#1976d2]">
              Histórico – {historicoAberto.solicitante}
            </h2>

            <ul className="space-y-2 text-sm">
              {historicoAberto.historico?.map((h, i) => (
                <li key={i} className="border-b pb-1">
                  <strong>{h.data}</strong> — {h.acao}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setHistoricoAberto(null)}
              className="mt-4 bg-[#1976d2] text-white px-4 py-2 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </Body>
  );
}
