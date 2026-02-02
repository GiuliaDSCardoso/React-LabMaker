import { useEffect, useState } from "react";
import Body from "../../assets/styles/Body.jsx";
import { DeleteIcon, PhoneIcon } from "lucide-react";
import { supabase } from "../../services/supabase";
import NavAdminBlue from "../../assets/styles/NavAdminBlue.jsx";

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
    return {
      data: new Date().toLocaleString("pt-BR"),
      acao,
    };
  }

  async function marcarComoConcluido(id) {
    const pedido = pedidos.find((p) => p.id === id);
    const historicoAtual = pedido?.historico || [];

    await supabase.from("pedidos").update({
      is_completed: true,
      historico: [...historicoAtual, novoEvento("Pedido concluído")],
    }).eq("id", id);

    carregarPedidos();
  }

  async function desmarcarComoConcluido(id) {
    const pedido = pedidos.find((p) => p.id === id);
    const historicoAtual = pedido?.historico || [];

    await supabase.from("pedidos").update({
      is_completed: false,
      historico: [...historicoAtual, novoEvento("Pedido reaberto")],
    }).eq("id", id);

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
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
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
      <NavAdminBlue />

      <div className="flex flex-col p-10 gap-10">
        <h1 className="text-2xl font-bold text-[#1976d2]">
          Solicitações de Confecção
        </h1>

        {/* FILTROS */}
        <div className="flex flex-wrap justify-between gap-4">
          <input
            type="text"
            placeholder="Pesquisar pedidos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px] h-[50px] px-3 py-2 border text-lg"
          />

          <div className="flex gap-2">
            {["all", "pending", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 h-9 rounded text-xl ${
                  statusFilter === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
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
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white text-xl">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                {[
                  "Solicitante",
                  "Email",
                  "Curso",
                  "Contato",
                  "Detalhe",
                  "Projeto",
                  "Cargo",
                  "Arquivo",
                  "Entrega",
                  "Material",
                  "Status",
                  "Ações",
                ].map((h) => (
                  <th key={h} className="border px-2 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="12" className="py-6 text-center text-gray-500">
                    Nenhum pedido encontrado
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((item) => (
                  <tr key={item.id} className="text-center hover:bg-blue-50">
                    <td className="border px-2 py-4">{item.solicitante}</td>
                    <td className="border px-2 py-4">{item.email}</td>
                    <td className="border px-2 py-4">{item.curso_turma}</td>
                    <td className="border px-2 py-4">{item.contato}</td>
                    <td className="border px-2 py-4">{item.detalhe}</td>
                    <td className="border px-2 py-4">{item.sobre_projeto}</td>
                    <td className="border px-2 py-4">{item.cargo}</td>
                    <td className="border px-2 py-4">
                      {renderArquivo(item.arquivo)}
                    </td>
                    <td className="border px-2 py-4">{item.data_entrega}</td>
                    <td className="border px-2 py-4">{item.material}</td>
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
                          onClick={() => marcarComoConcluido(item.id)}
                          className="bg-green-500 active:bg-green-800 text-white px-2 py-2 rounded"
                        >
                          Concluir
                        </button>
                      ) : (
                        <button
                          onClick={() => desmarcarComoConcluido(item.id)}
                          className="bg-yellow-500 active:bg-yellow-800 text-white px-2 py-2 rounded"
                        >
                          Reabrir
                        </button>
                      )}

                      <button
                        onClick={() => abrirWhatsApp(item.contato)}
                        className="bg-green-600 text-white p-2 rounded "
                      >
                        <PhoneIcon size={14} />
                      </button>

                      <button
                        onClick={() => setHistoricoAberto(item)}
                        className="bg-blue-500 text-white px-2 py-2 rounded"
                      >
                        Histórico
                      </button>

                      <button
                        onClick={() => excluirPedido(item.id)}
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

            <ul className="space-y-2 text-sm max-h-[300px] overflow-y-auto">
              {historicoAberto.historico?.map((h, i) => (
                <li key={i} className="border-b pb-1">
                  <strong>{h.data}</strong> — {h.acao}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setHistoricoAberto(null)}
              className="mt-4 bg-[#1976d2] text-white px-4 py-2 rounded w-full"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </Body>
  );
}
