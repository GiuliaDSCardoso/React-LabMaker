import { useEffect, useState } from "react";
import Body from "../../assets/styles/Body";

import { DeleteIcon, PhoneIcon } from "lucide-react";
import NavAdminBlue from "../../assets/styles/NavAdminBlue.jsx";


export default function EmprestimoAdmin() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | completed | pending
  const [historicoAberto, setHistoricoAberto] = useState(null);



  // 🔙 Voltar
  

  // 📦 Carregar dados
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("solicitacoes")) || [];
    setSolicitacoes(dados);
  }, []);

  // 💾 Atualizar LocalStorage
  function atualizarSolicitacoes(novas) {
    setSolicitacoes(novas);
    localStorage.setItem("solicitacoes", JSON.stringify(novas));
  }


  // 🔍 Busca + filtros
  const solicitacoesFiltradas = solicitacoes.filter((item) => {
    const textoBusca = search.toLowerCase();

    const matchTexto =
      item.solicitante?.toLowerCase().includes(textoBusca) ||
      item.email?.toLowerCase().includes(textoBusca) ||
      item.cursoETurma?.toLowerCase().includes(textoBusca) ||
      item.contato?.toLowerCase().includes(textoBusca) ||
      item.componente?.toLowerCase().includes(textoBusca);


    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && item.isCompleted) ||
      (statusFilter === "pending" && !item.isCompleted);

    return matchTexto  && matchStatus;
  });

  // ✅ Concluir
  function marcarComoConcluido(id) {
    const agora = new Date().toLocaleString();

    atualizarSolicitacoes(
      solicitacoes.map((item) =>
        item.id === id
          ? {
              ...item,
              isCompleted: true,
              historico: [
                ...(item.historico || []),
                { data: agora, acao: "Empréstimo concluído" },
              ],
            }
          : item
      )
    );
  }
    function renderComponentes(componentes) {
      if (!componentes || componentes.length === 0) {
        return "Nenhum componente";
      }

      // Se por acaso for string (dados antigos)
      if (typeof componentes === "string") {
        return componentes;
      }

      return (
        <ul className="space-y-1 text-left">
          {componentes.map((item, index) => (
            <li
              key={index}
              className="bg-blue-50 px-2 py-1 rounded text-xs"
            >
              • {item}
            </li>
          ))}
        </ul>
      );
    }
  useEffect(() => {
        const isAuth = localStorage.getItem("auth");
        if (!isAuth) {
        window.location.href = "/";
        }
    }, []);

    
  // 🔄 Desconcluir
  function desmarcarComoConcluido(id) {
    const agora = new Date().toLocaleString();

    atualizarSolicitacoes(
      solicitacoes.map((item) =>
        item.id === id
          ? {
              ...item,
              isCompleted: false,
              historico: [
                ...(item.historico || []),
                { data: agora, acao: "Empréstimo reaberto" },
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
  function onDeleteSolicitacao(id) {
    if (!window.confirm("Tem certeza que deseja excluir esta solicitação?")) return;
    atualizarSolicitacoes(solicitacoes.filter((s) => s.id !== id));
  }

  return (
    <Body>
      <NavAdminBlue/>
      <div className="flex flex-col p-10 gap-10 ">
         <div className="flex items-center text-[#1769bb] justify-between "> 
            
             <h1 className="text-2xl font-bold w-[95%] text-[#1976d2]"> Solicitações de Empréstimo </h1>
       </div>

        {/* FILTROS */}
        <div className="flex flex-wrap justify-between gap-4">
          <input
            type="text"
            placeholder="Pesquisar solicitações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px] px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex flex-wrap gap-2">
            

            {/* Filtro por status */}
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
              className={`min-w-[90px] h-9 px-3 rounded text-sm flex items-center justify-center ${
                statusFilter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              Pendentes
            </button>

            <button
              onClick={() => setStatusFilter("completed")}
              className={`min-w-[90px] h-9 px-3 rounded text-sm flex items-center justify-center ${
                statusFilter === "completed"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-700"
              }`}
            >
              Concluídas
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
                <th className="border px-2 py-2">Componente</th>
                <th className="border px-2 py-2">Empréstimo</th>
                <th className="border px-2 py-2">Devolução</th>
                <th className="border px-2 py-2">Status</th>
                <th className="border px-2 py-2">Ações</th>
              </tr>
            </thead>

            <tbody>
              {solicitacoesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    Nenhuma solicitação encontrada
                  </td>
                </tr>
              ) : (
                solicitacoesFiltradas.map((item) => (
                  <tr key={item.id} className="text-center hover:bg-blue-50">
                    <td className="border px-2 py-1">{item.solicitante}</td>
                    <td className="border px-2 py-1">{item.email}</td>
                    <td className="border px-2 py-1">{item.cursoETurma}</td>
                    <td className="border px-2 py-1">{item.contato}</td>
                    <td className="border px-2 py-1">
                      {renderComponentes(item.componentes)}
                    </td>

                    <td className="border px-2 py-1">{item.dataEmprestimo}</td>
                    <td className="border px-2 py-1">{item.dataDevolucao}</td>
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
                          Desconcluir
                        </button>
                      )}

                      <button
                        onClick={() => setHistoricoAberto(item)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Histórico
                      </button>
                      <button
                        onClick={() => abrirWhatsApp(item.contato)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      >
                        <PhoneIcon size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteSolicitacao(item.id)}
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
