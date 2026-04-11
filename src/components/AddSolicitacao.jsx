import { useState, useRef, useEffect } from "react";
import { supabase } from "../services/supabase";
import InputRed from "../assets/styles/InputRed";
import ComponenteInput from "../assets/styles/ComponenteInput.jsx";
import DatePickerInput from "../assets/styles/DatePickerInput.jsx";

export default function AddSolicitacao() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showTermos, setShowTermos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔥 Estado de bloqueio

  const [solicitante, setSolicitante] = useState("");
  const [email, setEmail] = useState("");
  const [cursoETurma, setCursoETurma] = useState("");
  const [contato, setContato] = useState("");
  const [componenteInput, setComponenteInput] = useState("");
  const [componentes, setComponentes] = useState([]);
  const [dataEmprestimo, setDataEmprestimo] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [termosAceitos, setTermosAceitos] = useState(false);

  useEffect(() => {
    supabase.auth.signOut();
    const hoje = new Date();
    const dataBrasil = hoje.toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
    setDataEmprestimo(dataBrasil);
  }, []);

  const termosRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (termosRef.current && !termosRef.current.contains(event.target)) {
        setShowTermos(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Funções de validação permanecem as mesmas...
  function emailValido(email) {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    const dominiosPermitidos = ["@ba.estudante.senai.br", "@fieb.org.br", "@fbest.org.br"];
    return emailRegex.test(email) && dominiosPermitidos.some((d) => email.toLowerCase().endsWith(d));
  }

  function formatarTelefone(valor) {
    let numero = valor.replace(/\D/g, "").slice(0, 11);
    if (numero.length < 3) return `(${numero}`;
    if (numero.length < 4) return `(${numero.slice(0, 2)}) ${numero.slice(2)}`;
    if (numero.length < 8) return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(3)}`;
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(3, 7)}-${numero.slice(7)}`;
  }

  function validarStep1() {
    const newErrors = {};
    if (!solicitante.trim()) newErrors.solicitante = "Informe o nome completo.";
    if (!emailValido(email)) newErrors.email = "Email inválido ou domínio não permitido.";
    if (!cursoETurma.trim()) newErrors.cursoETurma = "Informe curso e turma ou setor.";
    if (!contato) newErrors.contato = "Informe o telefone.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return; // 🔥 Bloqueia clique duplo

    const newErrors = {};
    if (componentes.length === 0) newErrors.componentes = "Adicione ao menos um componente.";
    if (!dataDevolucao) newErrors.dataDevolucao = "Informe a data de devolução.";
    if (!termosAceitos) newErrors.termos = "Você precisa aceitar os termos.";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true); // 🔥 Ativa carregamento

    try {
      const agora = new Date().toLocaleString("pt-BR");
      const { error } = await supabase.from("emprestimos").insert({
        solicitante,
        email,
        curso_turma: cursoETurma,
        contato,
        item: componentes,
        data_saida: dataEmprestimo,
        data_retorno: dataDevolucao,
        termos_aceitos: termosAceitos,
        is_completed: false,
        historico: [{ data: agora, acao: "Solicitação criada" }],
      });

      if (error) throw error;

      alert("✅ Solicitação de empréstimo enviada!");

      // 🔥 LIMPEZA DO FORMULÁRIO
      setStep(1);
      setSolicitante("");
      setEmail("");
      setCursoETurma("");
      setContato("");
      setComponentes([]);
      setComponenteInput("");
      setDataDevolucao("");
      setTermosAceitos(false);
      setErrors({});

    } catch (error) {
      console.error(error);
      setErrors({ supabase: "Erro ao enviar solicitação." });
    } finally {
      setIsSubmitting(false); // 🔥 Libera o botão
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-24 md:justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {errors.supabase && <p className="text-red-600 text-center font-bold">{errors.supabase}</p>}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row w-full gap-4">
              <div className="flex flex-col w-full gap-4">
                <InputRed title="Solicitante:" value={solicitante} placeholder="Nome completo" onChange={(e) => setSolicitante(e.target.value)} error={errors.solicitante} />
                <InputRed title="Email:" type="email" value={email} placeholder="Email institucional" onChange={(e) => setEmail(e.target.value)} error={errors.email} />
              </div>
              <div className="flex flex-col w-full gap-4">
                <InputRed title="Curso e Turma / Setor:" value={cursoETurma} placeholder="Ex: Eletrotécnica 93633" onChange={(e) => setCursoETurma(e.target.value)} error={errors.cursoETurma} />
                <InputRed title="Telefone:" value={contato} placeholder="(DDD) 9 0000-0000" onChange={(e) => setContato(formatarTelefone(e.target.value))} error={errors.contato} />
              </div>
            </div>
            <button type="button" onClick={() => validarStep1() && setStep(2)} className="h-[50px] hover:bg-[#001438] bg-[#0E4194] text-white rounded mt-4 transition-colors">
              Próximo
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <ComponenteInput
              value={componenteInput}
              onChange={setComponenteInput}
              onAdd={() => {
                if(componenteInput.trim()){
                  setComponentes([...componentes, { nome: componenteInput.trim(), quantidade: 1 }]);
                  setComponenteInput("");
                }
              }}
              items={componentes}
              onRemove={(idx) => setComponentes(componentes.filter((_, i) => i !== idx))}
              onUpdateQuantidade={(idx, qtd) => setComponentes(componentes.map((c, i) => i === idx ? {...c, quantidade: qtd} : c))}
              title="Lista de Componentes:"
              descricao="Adicione os componentes que deseja emprestar. Ex: Resistor 220Ω, Placa Arduino, etc."
              error={errors.componentes}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputRed title="Data do Empréstimo" value={dataEmprestimo.split("-").reverse().join("/")} readOnly />
              <DatePickerInput
                title="Data de Devolução"
                selected={dataDevolucao ? new Date(dataDevolucao + "T12:00:00") : null}
                onChange={(date) => {
                  if (!date) return setDataDevolucao("");
                  setDataDevolucao(date.toISOString().split("T")[0]);
                }}
                minDate={new Date()}
                error={errors.dataDevolucao}
              />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={termosAceitos} onChange={(e) => setTermosAceitos(e.target.checked)} id="termos" />
                <label htmlFor="termos" className="text-sm">
                  Concordo com os termos de responsabilidade{" "}
                  <span className="text-[#0062ff] font-medium cursor-pointer" onClick={() => setShowTermos(!showTermos)}>*ler mais*</span>
                </label>
              </div>
              {showTermos && (
                <div ref={termosRef} className="absolute w-full max-h-80 bg-white dark:bg-slate-900 p-4 border rounded-lg shadow-xl z-50 overflow-y-auto">
                   <h3 className="font-bold mb-2">Termos de Responsabilidade</h3>
                   <p className="text-xs space-y-2">1. Devolver no prazo.<br/>2. Responsabilidade por danos.<br/>3. Uso institucional exclusivo.</p>
                </div>
              )}
              {errors.termos && <p className="text-red-500 text-sm mt-1">{errors.termos}</p>}
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} disabled={isSubmitting} className="h-[50px] hover:bg-blue-500 w-full text-white bg-blue-400 rounded disabled:opacity-50">
                Voltar
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className={`h-[50px] w-full rounded text-white font-bold transition-all ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#0E4194] hover:bg-[#001438]"}`}
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
              </button>
            </div>
            <h1 className={`text-sm text-center ${isSubmitting ? "text-blue-600 animate-pulse" : "text-red-600"}`}>
              {isSubmitting ? "🚀 Processando, aguarde a confirmação..." : "*Aguarde a confirmação antes de uma nova solicitação."}
            </h1>
          </div>
        )}
      </form>
    </div>
  );
}