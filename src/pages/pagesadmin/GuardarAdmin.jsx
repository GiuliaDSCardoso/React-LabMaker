import { useEffect, useState } from "react";
import Body from "../../assets/styles/Body.jsx";
import { DeleteIcon, PhoneIcon } from "lucide-react";
import { supabase } from "../../services/supabase";
import NavAdminBlue from "../../assets/styles/NavAdminBlue.jsx";

export default function GuardarAdmin() {
  const [projetos, setProjetos] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [historicoAberto, setHistoricoAberto] = useState(null);

  function novoEventoHistorico(acao) {
    return {
      data: new Date().toLocaleString("pt-BR"),
      acao,
    };
  }

  useEffect(() => {
    const channel = supabase
      .channel("realtime-projetos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projetos",
        },
        () => {
          carregarProjetos(); // 🔄 atualiza automaticamente
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function carregarProjetos() {
    const { data, error } = await supabase
      .from("projetos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Erro ao carregar projetos");
      return;
    }

    setProjetos(data);
  }

  
  const projetosFiltrados = projetos.filter((item) => {
    const texto = search.toLowerCase();

    const matchTexto =
      item.solicitante?.toLowerCase().includes(texto) ||
      item.email?.toLowerCase().includes(texto) ||
      item.curso_turma?.toLowerCase().includes(texto) ||
      item.contato?.toLowerCase().includes(texto) ||
      item.cargo?.toLowerCase().includes(texto) ||
      item.sobre_projeto?.toLowerCase().includes(texto);

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && item.is_completed) ||
      (statusFilter === "pending" && !item.is_completed);

    return matchTexto && matchStatus;
  });

  async function marcarComoConcluido(id) {
    const projeto = projetos.find((p) => p.id === id);
    const historicoAtual = projeto?.historico || [];

    await supabase.from("projetos").update({
      is_completed: true,
      historico: [...historicoAtual, novoEventoHistorico("Projeto concluído")],
    }).eq("id", id);

    carregarProjetos();
  }

  async function desmarcarComoConcluido(id) {
    const projeto = projetos.find((p) => p.id === id);
    const historicoAtual = projeto?.historico || [];

    await supabase.from("projetos").update({
      is_completed: false,
      historico: [...historicoAtual, novoEventoHistorico("Projeto reaberto")],
    }).eq("id", id);

    carregarProjetos();
  }

  function abrirWhatsApp(telefone) {
    const numeroLimpo = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numeroLimpo}`, "_blank");
  }

  async function onDeleteProjeto(id) {
    if (!window.confirm("Deseja excluir este projeto?")) return;
    await supabase.from("projetos").delete().eq("id", id);
    carregarProjetos();
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

  return (
    <Body>
      <NavAdminBlue />

      <div className="flex flex-col p-4 sm:p-6 lg:p-10 gap-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1976d2]">
          Solicitações de Armazenagem
        </h1>

        {/* FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Pesquisar projetos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[300px] h-[50px] px-3 py-2 border text-lg
                focus:outline-none
                focus:ring-1
                focus:border-blue-50"
          />

          <div className="flex flex-wrap text-xl gap-2">
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

        {/* TABELA RESPONSIVA */}
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border bg-white text-xl">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                {[
                  "Solicitante",
                  "Email",
                  "Curso",
                  "Contato",
                  "Cargo",
                  "Projeto",
                  "Arquivo",
                  "Retirada",
                  "Status",
                  "Ações",
                ].map((h) => (
                  <th key={h} className="border px-2 py-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {projetosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-6 text-gray-500">
                    Nenhum projeto encontrado
                  </td>
                </tr>
              ) : (
                projetosFiltrados.map((item) => (
                  <tr key={item.id} className="text-center  hover:bg-blue-50">
                    <td className="border px-2 py-4">{item.solicitante}</td>
                    <td className="border px-2 py-4">{item.email}</td>
                    <td className="border px-2 py-4">{item.curso_turma}</td>
                    <td className="border px-2 py-4">{item.contato}</td>
                    <td className="border px-2 py-4">{item.cargo}</td>
                    <td className="border px-2 py-4">{item.sobre_projeto}</td>
                    <td className="border px-2 py-4">
                      {renderArquivo(item.arquivo_url)}
                    </td>
                    <td className="border px-2 py-4">{item.data_saida}</td>
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
                    <td className="border px-2 py-1">
                      <div className="flex flex-wrap gap-2 justify-center">
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
                          className="bg-green-600 text-white p-2 rounded"
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
                          onClick={() => onDeleteProjeto(item.id)}
                          className="bg-red-500 text-white p-2 rounded"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-[500px] p-6 rounded shadow">
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
