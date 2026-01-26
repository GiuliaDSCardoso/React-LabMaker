import { useEffect, useState } from "react";
import Body from "../../assets/styles/Body.jsx";
import {
  DeleteIcon,
  PhoneIcon,
  FileIcon,
} from "lucide-react";
import NavAdminBlue from "../../assets/styles/NavAdminBlue.jsx";

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | completed | pending
  const [historicoAberto, setHistoricoAberto] = useState(null);



  // 🔙 Voltar



  // 📦 Carregar pedidos
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("pedidos")) || [];
    setPedidos(dados);
  }, []);

  // 💾 Atualizar localStorage
  function atualizarPedidos(novos) {
    setPedidos(novos);
    localStorage.setItem("pedidos", JSON.stringify(novos));
  }

  useEffect(() => {
        const isAuth = localStorage.getItem("auth");
        if (!isAuth) {
        window.location.href = "/";
        }
    }, []);



  // 🔍 Busca + filtros
  const pedidosFiltrados = pedidos.filter((item) => {
    const texto = search.toLowerCase();

    const matchTexto =
      item.solicitante?.toLowerCase().includes(texto) ||
      item.email?.toLowerCase().includes(texto) ||
      item.cursoETurma?.toLowerCase().includes(texto) ||
      item.contato?.toLowerCase().includes(texto) ||
      item.material?.toLowerCase().includes(texto) ||
      item.sobreProjeto?.toLowerCase().includes(texto);



    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && item.isCompleted) ||
      (statusFilter === "pending" && !item.isCompleted);

    return matchTexto && matchStatus;
  });

  // ✅ Concluir
  function marcarComoConcluido(id) {
    const agora = new Date().toLocaleString();

    atualizarPedidos(
      pedidos.map((item) =>
        item.id === id
          ? {
              ...item,
              isCompleted: true,
              historico: [
                ...(item.historico || []),
                { data: agora, acao: "Pedido concluído" },
              ],
            }
          : item
      )
    );
  }

  // 🔄 Reabrir
  function desmarcarComoConcluido(id) {
    const agora = new Date().toLocaleString();

    atualizarPedidos(
      pedidos.map((item) =>
        item.id === id
          ? {
              ...item,
              isCompleted: false,
              historico: [
                ...(item.historico || []),
                { data: agora, acao: "Pedido reaberto" },
              ],
            }
          : item
      )
    );
  }

  function abrirWhatsApp(telefone) {
    const numeroLimpo = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numeroLimpo}`, "_blank");
  }

  // 🗑️ Excluir
  function onDeletePedido(id) {
    if (!window.confirm("Deseja excluir este pedido?")) return;
    atualizarPedidos(pedidos.filter((p) => p.id !== id));
  }

  // 📎 Renderizar arquivo (BASE64)
  function renderArquivo(arquivo) {
    if (!arquivo || !arquivo.base64) {
      return "Nenhum arquivo";
    }

    return (
      <a
        href={arquivo.base64}
        download={arquivo.nome}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 flex items-center gap-1 justify-center underline"
      >
        <FileIcon size={14} />
        {arquivo.nome}
      </a>
    );
  }

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
            className="w-[300px] px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />

         
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`min-w-[90px] h-9 px-3 rounded text-sm flex items-center justify-center ${
                statusFilter === "all"
                  ? "bg-gray-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`min-w-[90px] h-9 px-3 rounded text-sm ${
                statusFilter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              Pendentes
            </button>

            <button
              onClick={() => setStatusFilter("completed")}
              className={`min-w-[90px] h-9 px-3 rounded text-sm ${
                statusFilter === "completed"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-700"
              }`}
            >
              Concluídos
            </button>
          </div>
        </div>

        {/* TABELA */}
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white text-sm">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="border px-2 py-2">Solicitante</th>
                <th className="border px-2 py-2">Email</th>
                <th className="border px-2 py-2">Curso</th>
                <th className="border px-2 py-2">Contato</th>
                <th className="border px-2 py-2">Detalhe</th>
                <th className="border px-2 py-2">Sobre</th>
                <th className="border px-2 py-2">Cargo</th>
                <th className="border px-2 py-2">Arquivo</th>
                <th className="border px-2 py-2">Entrega</th>
                <th className="border px-2 py-2">Material</th>
                <th className="border px-2 py-2">Status</th>
                <th className="border px-2 py-2">Ações</th>
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
                    <td className="border px-2 py-1">{item.solicitante}</td>
                    <td className="border px-2 py-1">{item.email}</td>
                    <td className="border px-2 py-1">{item.cursoETurma}</td>
                    <td className="border px-2 py-1">{item.contato}</td>
                    <td className="border px-2 py-1">{item.detalhe}</td>
                    <td className="border px-2 py-1">{item.sobreProjeto}</td>
                    <td className="border px-2 py-1">{item.cargo}</td>
                    <td className="border px-2 py-1">
                      {renderArquivo(item.arquivo)}
                    </td>
                    <td className="border px-2 py-1">{item.dataEntrega}</td>
                    <td className="border px-2 py-1">{item.material}</td>
                    <td className="border px-2 py-1">
                      {item.isCompleted ? (
                        <span className="text-green-600 font-semibold">
                          Concluído
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="border px-2 py-1 flex gap-2 justify-center">
                      {!item.isCompleted ? (
                        <button
                          onClick={() => marcarComoConcluido(item.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Concluir
                        </button>
                      ) : (
                        <button
                          onClick={() => desmarcarComoConcluido(item.id)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Reabrir
                        </button>
                      )}

                      <button
                        onClick={() => abrirWhatsApp(item.contato)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      >
                        <PhoneIcon size={14} />
                      </button>

                      <button
                        onClick={() => setHistoricoAberto(item)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Histórico
                      </button>

                      <button
                        onClick={() => onDeletePedido(item.id)}
                        className="bg-red-500 text-white p-1 rounded"
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
