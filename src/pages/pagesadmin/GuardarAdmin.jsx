import { useEffect, useState } from "react";
import Body from "../../assets/styles/Body.jsx";
import { Trash2, MessageCircle, History, CheckCircle, RotateCcw, Download } from "lucide-react";
import { supabase } from "../../services/supabase";
import MenuLateralAdmin from "../../assets/styles/MenuLateralAdmin.jsx";

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
    carregarProjetos();
  }, []);

  async function carregarProjetos() {
    const { data, error } = await supabase
      .from("projetos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProjetos(data || []);
  }

  const projetosFiltrados = projetos
    .filter((item) => {
      const texto = search.toLowerCase();
      return (
        item.solicitante?.toLowerCase().includes(texto) ||
        item.email?.toLowerCase().includes(texto) ||
        item.curso_turma?.toLowerCase().includes(texto) ||
        item.sobre_projeto?.toLowerCase().includes(texto)
      ) && (
        statusFilter === "all" ||
        (statusFilter === "completed" && item.is_completed) ||
        (statusFilter === "pending" && !item.is_completed)
      );
    })
    .sort((a, b) => (a.is_completed === b.is_completed ? 0 : a.is_completed ? 1 : -1));

  async function alternarStatus(id, historicoAtual, statusAtual) {
    const acao = statusAtual ? "Projeto reaberto" : "Projeto concluído";
    await supabase
      .from("projetos")
      .update({
        is_completed: !statusAtual,
        historico: [...(historicoAtual || []), novoEventoHistorico(acao)],
      })
      .eq("id", id);
    carregarProjetos();
  }

  async function excluirProjeto(id) {
    if (!window.confirm("Deseja excluir este projeto?")) return;
    await supabase.from("projetos").delete().eq("id", id);
    carregarProjetos();
  }

  function abrirWhatsApp(telefone) {
    if (!telefone) return;
    const numeroLimpo = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numeroLimpo}`, "_blank");
  }

  return (
    <Body>
      <MenuLateralAdmin />

      <div className="flex flex-col md:mt-4 mt-20 p-4 lg:p-8 gap-6 md:ml-20 transition-all duration-300">
        <header className="flex flex-col gap-1 text-center md:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Solicitações de Armazenagem
          </h1>
          <p className="text-sm text-slate-500">Controle os projetos físicos guardados no Maker Lab.</p>
        </header>

        {/* FILTROS CLEAN */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <input
            type="text"
            placeholder="Pesquisar projetos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 h-10 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          />

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {["all", "pending", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  statusFilter === s 
                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {s === "all" ? "Todas" : s === "pending" ? "Pendentes" : "Concluídos"}
              </button>
            ))}
          </div>
        </div>

        {/* TABELA CLEAN */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1300px] w-full border-collapse table-fixed text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-center">
                  <th className="w-[180px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Solicitante</th>
                  <th className="w-[130px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Curso/Turma</th>
                  <th className="w-[100px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Cargo</th>
                  <th className="w-[220px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Projeto</th>
                  <th className="w-[120px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Arquivo</th>
                  <th className="w-[110px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Retirada</th>
                  <th className="w-[110px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Status</th>
                  <th className="w-[160px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-center text-xs">
                {projetosFiltrados.map((item) => (
                  <tr
                    key={item.id}
                    className={`group transition-colors duration-200 ${
                      item.is_completed 
                        ? "bg-slate-50/40 dark:bg-slate-900/40 opacity-75 grayscale-[0.2]" 
                        : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-slate-700 dark:text-slate-200 truncate w-full">{item.solicitante}</span>
                        <span className="text-[10px] text-slate-400 truncate w-full">{item.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400 truncate">{item.curso_turma}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400 italic">{item.cargo}</td>
                    <td className="px-4 py-4">
                       <span className="font-medium text-slate-700 dark:text-slate-200 truncate w-full block" title={item.sobre_projeto}>
                         {item.sobre_projeto}
                       </span>
                    </td>

                    {/* COLUNA DE DOWNLOAD COM SUPORTE A ARRAY E LIMPEZA */}
                    <td className="px-4 py-4">
                      {item.arquivo_url ? (() => {
                        let lista = [];
                        try {
                          if (Array.isArray(item.arquivo_url)) {
                            lista = item.arquivo_url;
                          } else {
                            // Caso esteja salvo como string suja (ex: com aspas extras)
                            const cleanStr = item.arquivo_url.replace(/^"|"$/g, '').replace(/\\"/g, '"');
                            const parsed = JSON.parse(cleanStr);
                            lista = Array.isArray(parsed) ? parsed : [parsed];
                          }
                        } catch {
                           // Fallback se não for JSON válido
                           if (typeof item.arquivo_url === 'string' && item.arquivo_url.includes('http')) {
                             lista = [item.arquivo_url.replace(/[\]"']/g, '')];
                           }
                        }

                        if (lista.length === 0) return <span className="text-slate-300">Nenhum</span>;

                        return (
                          <div className="flex flex-col gap-1.5 items-center">
                            {lista.map((url, idx) => (
                              <a 
                                key={idx}
                                href={url.trim().replace(/[\]'"]+$/, "")} 
                                target="_blank" rel="noopener noreferrer" download 
                                className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md transition-colors"
                              >
                                <Download size={12} /> 
                                <span className="text-[9px] font-bold uppercase">
                                  {lista.length > 1 ? `ARQ ${idx+1}` : "Baixar"}
                                </span>
                              </a>
                            ))}
                          </div>
                        );
                      })() : <span className="text-slate-300">Nenhum</span>}
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-600 dark:text-slate-300">
                      {item.data_saida}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.is_completed 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {item.is_completed ? "Concluído" : "Pendente"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-1.5 justify-center">
                        <button
                          onClick={() => alternarStatus(item.id, item.historico, item.is_completed)}
                          className={`p-2 rounded-lg transition-all ${
                            item.is_completed ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={item.is_completed ? "Reabrir" : "Concluir"}
                        >
                          {item.is_completed ? <RotateCcw size={16}/> : <CheckCircle size={16}/>}
                        </button>
                        <button onClick={() => abrirWhatsApp(item.contato)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                          <MessageCircle size={16}/>
                        </button>
                        <button onClick={() => setHistoricoAberto(item)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all">
                          <History size={16}/>
                        </button>
                        <button onClick={() => excluirProjeto(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL HISTÓRICO */}
      {historicoAberto && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden text-center md:text-left">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Linha do Tempo</h2>
              <p className="text-xs text-slate-500">{historicoAberto.solicitante}</p>
            </div>
            <div className="p-6 max-h-[300px] overflow-y-auto">
              <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-2 space-y-6 text-left">
                {historicoAberto.historico?.map((h, i) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-500"></div>
                    <time className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{h.data}</time>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{h.acao}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button onClick={() => setHistoricoAberto(null)} className="px-6 py-2 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl text-sm font-bold hover:opacity-90">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </Body>
  );
}