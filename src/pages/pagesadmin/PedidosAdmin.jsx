import { useEffect, useState } from "react";
import Body from "../../assets/styles/Body.jsx";
import { DeleteIcon, PhoneIcon, FileIcon } from "lucide-react";
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

    setPedidos(data);
  }

  function novoEvento(acao) {
    return {
      data: new Date().toLocaleString("pt-BR"),
      acao,
    };
  }

  async function marcarComoConcluido(id) {
    const pedido = pedidos.find((p) => p.id === id);

    await supabase
      .from("pedidos")
      .update({
        is_completed: true,
        historico: [...(pedido.historico || []), novoEvento("Pedido concluído")],
      })
      .eq("id", id);

    carregarPedidos();
  }

  async function desmarcarComoConcluido(id) {
    const pedido = pedidos.find((p) => p.id === id);

    await supabase
      .from("pedidos")
      .update({
        is_completed: false,
        historico: [...(pedido.historico || []), novoEvento("Pedido reaberto")],
      })
      .eq("id", id);

    carregarPedidos();
  }

  async function excluirPedido(id) {
    if (!window.confirm("Deseja excluir?")) return;

    await supabase.from("pedidos").delete().eq("id", id);
    carregarPedidos();
  }

  function renderArquivo(base64) {
    if (!base64) return "Sem arquivo";

    return (
      <a
        href={base64}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline flex gap-1 justify-center"
      >
        <FileIcon size={14} /> Baixar
      </a>
    );
  }
  function abrirWhatsApp(telefone) {
     const numeroLimpo = telefone.replace(/\D/g, ""); 
    window.open(`https://wa.me/55${numeroLimpo}`, "_blank"); }

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
      <NavAdminBlue/>
      <div className="flex flex-col p-10 gap-10">
        {/* HEADER */}
        <div className="flex items-center  justify-between">
          
          <h1 className="text-2xl font-bold w-[95%] text-[#1976d2]">
            Solicitações de Confecção
          </h1>
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap justify-between gap-4">
          <input
            type="text"
            placeholder="Pesquisar pedidos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px] h-[50px] px-3 py-2 border text-lg
                focus:outline-none
                focus:ring-1
                focus:border-blue-50"
          />

         
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`min-w-[90px] h-9 px-3 rounded text-xl flex items-center justify-center ${
                statusFilter === "all"
                   ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`min-w-[90px] h-9 px-3 rounded text-xl ${
                statusFilter === "pending"
                   ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
              }`}
            >
              Pendentes
            </button>

            <button
              onClick={() => setStatusFilter("completed")}
              className={`min-w-[90px] h-9 px-3 rounded text-xl ${
                statusFilter === "completed"
                   ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
              }`}
            >
              Concluídos
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
                <th className="border px-2 py-4">Curso</th>
                <th className="border px-2 py-4">Contato</th>
                <th className="border px-2 py-4">Detalhe</th>
                <th className="border px-2 py-4">Sobre</th>
                <th className="border px-2 py-4">Cargo</th>
                <th className="border px-2 py-4">Arquivo</th>
                <th className="border px-2 py-4">Entrega</th>
                <th className="border px-2 py-4">Material</th>
                <th className="border px-2 py-4">Status</th>
                <th className="border px-2 py-4">Ações</th>
              </tr>
            </thead>

            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center py-4 text-gray-500">
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
                          className="bg-green-500 text-white px-2 py-2 rounded text-xl"
                        >
                          Concluir
                        </button>
                      ) : (
                        <button
                          onClick={() => desmarcarComoConcluido(item.id)}
                          className="bg-yellow-500 text-white px-2 py-2 rounded text-xl"
                        >
                          Reabrir
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
                        onClick={() => excluirPedido(item.id)}
                        className="bg-red-500 text-white px-2 py-2 rounded"
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
