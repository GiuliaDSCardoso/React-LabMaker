import { useState, useRef, useEffect } from "react";
import { supabase } from "../services/supabase";
import InputRed from "../assets/styles/InputRed";
import ComponenteInput from "../assets/styles/ComponenteInput.jsx";

export default function AddSolicitacao() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showTermos, setShowTermos] = useState(false);
  const [solicitante, setSolicitante] = useState("");
  const [email, setEmail] = useState("");
  const [cursoETurma, setCursoETurma] = useState("");
  const [contato, setContato] = useState("");
  const [componenteInput, setComponenteInput] = useState("");
  const [componentes, setComponentes] = useState([]);
  const [dataEmprestimo, setDataEmprestimo] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [termosAceitos, setTermosAceitos] = useState(false);

  const hoje = new Date().toISOString().split("T")[0];
  const termosRef = useRef(null); // ref para overlay de termos

  // Fecha overlay ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (termosRef.current && !termosRef.current.contains(event.target)) {
        setShowTermos(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function formatarTelefone(valor) {
    let numero = valor.replace(/\D/g, "").slice(0, 11);
    if (numero.length === 0) return "";
    if (numero.length < 3) return `(${numero}`;
    if (numero.length < 4) return `(${numero.slice(0, 2)}) ${numero.slice(2)}`;
    if (numero.length < 8) return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(3)}`;
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(3, 7)}-${numero.slice(7)}`;
  }

  function adicionarComponente() {
    if (!componenteInput.trim()) return;
    setComponentes((prev) => [...prev, { nome: componenteInput.trim(), quantidade: 1 }]);
    setComponenteInput("");
  }

  function atualizarQuantidade(index, novaQuantidade) {
    setComponentes((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantidade: novaQuantidade } : item))
    );
  }

  function removerComponente(index) {
    setComponentes(componentes.filter((_, i) => i !== index));
  }

  function validarStep1() {
    const newErrors = {};
    if (!solicitante) newErrors.solicitante = "Informe o nome completo.";
    if (!email) newErrors.email = "Informe o email.";
    if (!cursoETurma) newErrors.cursoETurma = "Informe curso e turma ou setor.";
    if (!contato) newErrors.contato = "Informe o telefone.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (componentes.length === 0) newErrors.componentes = "Adicione ao menos um componente.";
    if (!dataEmprestimo) newErrors.dataEmprestimo = "Informe a data do empréstimo.";
    if (!dataDevolucao) newErrors.dataDevolucao = "Informe a data de devolução.";
    if (!termosAceitos) newErrors.termos = "Você precisa aceitar os termos.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

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
    });

    if (error) {
      setErrors({ supabase: "Erro ao enviar solicitação." });
      return;
    }

    alert("✅ Solicitação enviada!");
    setStep(1);
  }

  return (
    <div className="flex flex-col items-center w-full px-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-6xl">
        {/* ===== ETAPA 1 ===== */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row w-full gap-4">
              <div className="flex flex-col w-full gap-4">
                <InputRed
                  title="Solicitante:"
                  value={solicitante}
                  placeholder="Insira seu nome completo"
                  onChange={(e) => setSolicitante(e.target.value)}
                  error={errors.solicitante}
                />
                <InputRed
                  title="Email:"
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder="Insira seu email institucional"
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />
              </div>

              <div className="flex flex-col w-full gap-4">
                <InputRed
                  title="Curso e Turma / Setor:"
                  value={cursoETurma}
                  placeholder="Insira seu curso e sua turma"
                  onChange={(e) => setCursoETurma(e.target.value)}
                  error={errors.cursoETurma}
                />
                <InputRed
                  title="Telefone:"
                  value={contato}
                  placeholder="Ex.: (11) 9 1234-5678"
                  onChange={(e) => setContato(formatarTelefone(e.target.value))}
                  error={errors.contato}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => validarStep1() && setStep(2)}
              className="h-[50px] bg-[#0E4194] text-white rounded mt-4"
            >
              Próximo
            </button>
          </div>
        )}

        {/* ===== ETAPA 2 ===== */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <ComponenteInput
              value={componenteInput}
              onChange={setComponenteInput}
              onAdd={adicionarComponente}
              items={componentes}
              onRemove={removerComponente}
              onUpdateQuantidade={atualizarQuantidade}
              title="Componentes:"
              descricao="Digite o nome do componente"
              error={errors.componentes}
            />

            <InputRed
              title="Data do empréstimo:"
              type="date"
              min={hoje}
              value={dataEmprestimo}
              onChange={(e) => setDataEmprestimo(e.target.value)}
              error={errors.dataEmprestimo}
            />

            <InputRed
              title="Data de devolução:"
              type="date"
              min={dataEmprestimo || hoje}
              value={dataDevolucao}
              onChange={(e) => setDataDevolucao(e.target.value)}
              error={errors.dataDevolucao}
            />

            {/* ===== Termos de Responsabilidade ===== */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={termosAceitos}
                  onChange={(e) => setTermosAceitos(e.target.checked)}
                  id="termos"
                />
                <label htmlFor="termos" className="text-sm relative">
                  Concordo que Li e Aceito os termos de responsabilidade{" "}
                  <span
                    className="text-[#0062ff]  font-medium cursor-pointer relative"
                    onClick={() => setShowTermos(!showTermos)}
                  >
                    *ler mais*
                  </span>
                </label>
              </div>

              {/* Overlay com os termos */}
              {showTermos && (
                <div
                  ref={termosRef}
                  className="
                    absolute
      
                   
                    w-[100%]
                    max-h-80
                    
                    bg-white dark:bg-blue-900/40 dark:backdrop-blur-2xl
                    border border-gray-300 dark:border-none
                    p-4 dark:text-white
                    rounded-lg
                    shadow-lg
                    z-50
                  "
                >
                  <h3 className="font-bold mb-2">Termos de Responsabilidade</h3>
                  <p className="text-sm leading-relaxed">
                    1. O solicitante se compromete a devolver os equipamentos
                    no prazo estabelecido.<br />
                    2. Qualquer dano ou perda será de responsabilidade do
                    solicitante.<br />
                    3. É proibida a transferência do equipamento para terceiros.<br />
                    4. O uso do equipamento deve seguir as normas de segurança da instituição.<br />
                    5. Outros termos podem ser aplicáveis conforme política interna.
                  </p>
                </div>
              )}

              {errors.termos && <p className="text-red-500 text-sm mt-2">{errors.termos}</p>}
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="h-[50px] w-full bg-blue-300 rounded">
                Voltar
              </button>
              <button type="submit" className="h-[50px] w-full bg-[#0E4194] text-white rounded">
                Enviar
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}