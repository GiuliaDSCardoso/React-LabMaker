import { useEffect, useState } from "react";
import Body from "../../assets/styles/Body";
import { Trash2, MessageCircle, History, CheckCircle, RotateCcw } from "lucide-react";
import { supabase } from "../../services/supabase";
import MenuLateralAdmin from "../../assets/styles/MenuLateralAdmin.jsx";

export default function EmprestimoAdmin() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); 
  const [historicoAberto, setHistoricoAberto] = useState(null);

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

  const solicitacoesFiltradas = solicitacoes
    .filter((item) => {
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
    })
    .sort((a, b) => (a.is_completed === b.is_completed ? 0 : a.is_completed ? 1 : -1));

  async function marcarComoConcluido(id, historicoAtual = []) {
    const agora = new Date().toLocaleString();
    const novoHistorico = [...(historicoAtual || []), { data: agora, acao: "Empréstimo concluído" }];

    await supabase.from("emprestimos").update({
      is_completed: true,
      historico: novoHistorico,
    }).eq("id", id);

    carregarSolicitacoes();
  }

  async function desmarcarComoConcluido(id, historicoAtual = []) {
    const agora = new Date().toLocaleString();
    const novoHistorico = [...(historicoAtual || []), { data: agora, acao: "Empréstimo reaberto" }];

    await supabase.from("emprestimos").update({
      is_completed: false,
      historico: novoHistorico,
    }).eq("id", id);

    carregarSolicitacoes();
  }

  function renderComponentes(componentes) {
    if (!componentes) return <span className="text-slate-400 italic">Nenhum</span>;
    if (!Array.isArray(componentes)) return componentes;

    return (
      <div className="flex flex-col gap-1">
        {componentes.map((comp, index) => (
          <div key={index} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded text-[10px] w-full text-left truncate border border-slate-200 dark:border-slate-700">
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

  async function onDeleteSolicitacao(id) {
    if (!window.confirm("Tem certeza que deseja excluir esta solicitação?")) return;
    await supabase.from("emprestimos").delete().eq("id", id);
    carregarSolicitacoes();
  }
  
  return (
    <Body>
      <MenuLateralAdmin />

      <div className="flex flex-col md:mt-4 mt-20 p-4 lg:p-8 gap-6 md:ml-20 transition-all duration-300">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Solicitações de Empréstimo
          </h1>
          <p className="text-sm text-slate-500">Gerencie a saída e retorno de componentes do laboratório.</p>
        </header>

        {/* FILTROS CLEAN */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <input
            type="text"
            placeholder="Pesquisar solicitante ou item..."
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
                {s === "all" ? "Todas" : s === "pending" ? "Pendentes" : "Concluídas"}
              </button>
            ))}
          </div>
        </div>

        {/* TABELA CLEAN */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full border-collapse table-fixed text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="w-[130px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-center">Solicitante</th>
                  <th className="w-[110px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-center">Contato</th>
                  <th className="w-[120px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-center">Curso/Setor</th>
                  <th className="w-[170px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-center">Componente</th>
                  <th className="w-[100px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-center">Retirada</th>
                  <th className="w-[100px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-center">Devolução</th>
                  <th className="w-[80px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-center">Termos</th>
                  <th className="w-[100px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-center">Status</th>
                  <th className="w-[160px] px-4 py-4 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-center">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {solicitacoesFiltradas.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-200 ${
                      item.is_completed 
                        ? "bg-slate-50/40 dark:bg-slate-900/40 opacity-75 grayscale-[0.2]" 
                        : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    }`}
                  >
                     <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-full">{item.solicitante}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-full">{item.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-400 text-center">{item.contato}</td>
                    <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-400 text-center truncate">{item.curso_turma}</td>
                    
                    <td className="px-4 py-4 text-center">
                      {renderComponentes(item.item)}
                    </td>

                    <td className="px-4 py-4 text-[11px] text-slate-500 text-center whitespace-nowrap">{item.data_saida}</td>
                    <td className="px-4 py-4 text-[11px] text-slate-500 text-center whitespace-nowrap font-medium">{item.data_retorno}</td>
                    
                    <td className="px-4 py-4 text-center">
                      <span className={`text-[10px] font-bold uppercase ${item.termos_aceitos ? "text-emerald-500" : "text-rose-500"}`}>
                        {item.termos_aceitos ? "Sim" : "Não"}
                      </span>
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
                          onClick={() => item.is_completed ? desmarcarComoConcluido(item.id, item.historico) : marcarComoConcluido(item.id, item.historico)}
                          className={`p-2 rounded-lg transition-all ${
                            item.is_completed 
                            ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20" 
                            : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          }`}
                          title={item.is_completed ? "Reabrir" : "Concluir"}
                        >
                          {item.is_completed ? <RotateCcw size={16}/> : <CheckCircle size={16}/>}
                        </button>

                        <button onClick={() => abrirWhatsApp(item.contato)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all" title="WhatsApp">
                          <MessageCircle size={16}/>
                        </button>

                        <button onClick={() => setHistoricoAberto(item)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all" title="Histórico">
                          <History size={16}/>
                        </button>

                        <button onClick={() => onDeleteSolicitacao(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all" title="Excluir">
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

      {/* MODAL HISTÓRICO CLEAN */}
      {historicoAberto && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Histórico</h2>
              <p className="text-xs text-slate-500">{historicoAberto.solicitante}</p>
            </div>
            <div className="p-6 max-h-[300px] overflow-y-auto">
              <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-2 space-y-6">
                {historicoAberto.historico?.map((h, i) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-500"></div>
                    <time className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{h.data}</time>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{h.action || h.acao}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button onClick={() => setHistoricoAberto(null)} className="px-6 py-2 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </Body>
  );
}