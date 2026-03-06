import { useEffect, useState } from "react";
import Body from "../../assets/styles/Body.jsx";
import { DeleteIcon, PhoneIcon } from "lucide-react";
import { supabase } from "../../services/supabase";
import MenuLateralAdmin from "../../assets/styles/MenuLateralAdmin.jsx";

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [historicoAberto, setHistoricoAberto] = useState(null);

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Erro ao carregar pedidos");
      return;
    }

    setPedidos(data || []);
  }

  function novoEvento(acao) {
    return { data: new Date().toLocaleString("pt-BR"), acao };
  }

  async function marcarComoConcluido(id) {
    const pedido = pedidos.find((p) => p.id === id);
    const historicoAtual = pedido?.historico || [];
    await supabase
      .from("pedidos")
      .update({
        is_completed: true,
        historico: [...historicoAtual, novoEvento("Pedido concluído")],
      })
      .eq("id", id);
    carregarPedidos();
  }

  async function desmarcarComoConcluido(id) {
    const pedido = pedidos.find((p) => p.id === id);
    const historicoAtual = pedido?.historico || [];
    await supabase
      .from("pedidos")
      .update({
        is_completed: false,
        historico: [...historicoAtual, novoEvento("Pedido reaberto")],
      })
      .eq("id", id);
    carregarPedidos();
  }

  async function excluirPedido(id) {
    if (!window.confirm("Deseja excluir este pedido?")) return;
    await supabase.from("pedidos").delete().eq("id", id);
    carregarPedidos();
  }

  function abrirWhatsApp(telefone) {
    const numeroLimpo = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numeroLimpo}`, "_blank");
  }

  function renderArquivo(url) {
    if (!url) return "Sem arquivo";
    return (
      <a href={url} download target="_blank" className="text-blue-600 underline">
        Baixar
      </a>
    );
  }

  const pedidosFiltrados = pedidos.filter((p) => {
    const texto = search.toLowerCase();
    const matchTexto =
      p.solicitante?.toLowerCase().includes(texto) ||
      p.email?.toLowerCase().includes(texto) ||
      p.curso_turma?.toLowerCase().includes(texto);

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && p.is_completed) ||
      (statusFilter === "pending" && !p.is_completed);

    return matchTexto && matchStatus;
  });

  return (
  <Body>
    <MenuLateralAdmin />

    <div className="flex flex-col md:mt-1 mt-24  p-4 sm:p-6 lg:p-10 gap-8 md:ml-20
                    max-h-screen transition-colors duration-300">

      <h1 className="text-xl sm:text-2xl font-bold 
                     text-[#1976d2] dark:text-blue-400">
        Solicitações de Confecção
      </h1>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <input
          type="text"
          placeholder="Pesquisar pedidos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[300px] h-[50px] px-3 py-2 border text-lg
                     bg-white dark:bg-transparent
                     text-gray-800 dark:text-gray-100
                     border-gray-300 dark:border-white/50
                     focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <div className="flex flex-wrap gap-2 text-sm md:text-lg">
          {["all", "pending", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 h-9 rounded text-sm md:text-lg transition
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
                : "Concluídos"}
            </button>
          ))}
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto shadow max-h-[700px] overflow-y-auto">
        <table className="min-w-[1200px] w-full border text-sm md:text-lg
                           bg-white dark:bg-transparent
                           text-gray-800 dark:text-gray-200">

          <thead className="bg-blue-100 sticky text-blue-800 -top-1 z-10
                             dark:bg-[#1e3a8a] dark:text-blue-200">
            <tr>
              {[
                "Solicitante",
                "Email",
                "Curso",
                "Contato",
                "Detalhe",
                "Projeto",
                "Cargo",
                "Centro de Custo",
                "Arquivo",
                "Entrega",
                "Material",
                "Status",
                "Ações",
              ].map((h) => (
                <th
                  key={h}
                  className="border border-gray-200 dark:border-blue-400/50 px-2 py-4 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pedidosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Nenhum pedido encontrado
                </td>
              </tr>
            ) : (
              pedidosFiltrados.map((item) => (
                <tr
                  key={item.id}
                  className="text-center hover:bg-blue-50 dark:hover:bg-[#011b3f] transition"
                >
                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">{item.solicitante}</td>
                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">{item.email}</td>
                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">{item.curso_turma}</td>
                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">{item.contato}</td>
                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">{item.detalhe}</td>
                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">{item.sobre_projeto}</td>
                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">{item.cargo}</td>
                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">{item.centro_custo}</td>
                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">
                    {renderArquivo(item.arquivo)}
                  </td>
                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">{item.data_entrega}</td>
                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">{item.material}</td>

                  <td className="border border-gray-200 dark:border-blue-400/50 px-2 py-4">
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

                  <td className="border border-gray-200 dark:border-gray-700 px-2 py-2">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {!item.is_completed ? (
                        <button
                          onClick={() => marcarComoConcluido(item.id)}
                          className="bg-green-500 hover:bg-green-700 text-white px-2 py-2 rounded transition"
                        >
                          Concluir
                        </button>
                      ) : (
                        <button
                          onClick={() => desmarcarComoConcluido(item.id)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-2 rounded transition"
                        >
                          Reabrir
                        </button>
                      )}

                      <button
                        onClick={() => abrirWhatsApp(item.contato)}
                        className="bg-green-600 hover:bg-green-800 text-white p-2 rounded transition"
                      >
                        <PhoneIcon size={14} />
                      </button>

                      <button
                        onClick={() => setHistoricoAberto(item)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 rounded transition"
                      >
                        Histórico
                      </button>

                      <button
                        onClick={() => excluirPedido(item.id)}
                        className="bg-red-500 hover:bg-red-700 text-white p-2 rounded transition"
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
                        w-full max-w-[500px] p-6 rounded shadow-lg">

          <h2 className="font-bold mb-4 text-[#1976d2] dark:text-blue-400">
            Histórico – {historicoAberto.solicitante}
          </h2>

          <ul className="space-y-2 text-sm max-h-[300px] overflow-y-auto">
            {historicoAberto.historico?.map((h, i) => (
              <li key={i} className="border-b border-gray-200 dark:border-gray-700 pb-1">
                <strong>{h.data}</strong> — {h.acao}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setHistoricoAberto(null)}
            className="mt-4 bg-[#1976d2] hover:bg-blue-800 text-white px-4 py-2 rounded w-full transition"
          >
            Fechar
          </button>
        </div>
      </div>
    )}
  </Body>
);
}
