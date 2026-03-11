import { useState, useRef, useEffect } from "react";
import { supabase } from "../services/supabase";
import InputRed from "../assets/styles/InputRed";
import ComponenteInput from "../assets/styles/ComponenteInput.jsx";
import DatePickerInput from "../assets/styles/DatePickerInput.jsx";

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

  useEffect(() => {
    supabase.auth.signOut();
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

  function emailValido(email) {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    const dominiosPermitidos = [
      "@ba.estudante.senai.br",
      "@fieb.org.br",
      "@fbest.org.br",
    ];

    if (email.length > 60) return false;

    const parteUsuario = email.split("@")[0];
    if (parteUsuario.length < 3 || parteUsuario.length > 30) return false;

    if (!emailRegex.test(email)) return false;

    return dominiosPermitidos.some((dominio) =>
      email.toLowerCase().endsWith(dominio)
    );
  }

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

    if (!componenteValido(componenteInput)) {
      setErrors((prev) => ({
        ...prev,
        componentes: "O nome do componente não pode conter caracteres especiais.",
      }));
      return;
    }

    setComponentes((prev) => [
      ...prev,
      { nome: componenteInput.trim(), quantidade: 1 },
    ]);

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
  function cursoValido(curso) {
     const regex = /^[A-Za-zÀ-ÿ\s]+$/;
    return regex.test(curso);
  }

  function nomeValido(nome) {
    const regex = /^[A-Za-zÀ-ÿ\s]+$/;
    return regex.test(nome);
  }

  function componenteValido(nome) {
    const regex = /^[A-Za-zÀ-ÿ0-9\s]+$/;
    return regex.test(nome);
  } 

  function validarStep1() {
    const newErrors = {};

   if (!solicitante) {
  newErrors.solicitante = "Informe o nome completo.";
    } else if (solicitante.trim().length < 15) {
      newErrors.solicitante = "Insira seu nome completo.";
    } else if (!nomeValido(solicitante)) {
      newErrors.solicitante = "Nome não pode conter caracteres especiais.";
    }

    if (!email) {
      newErrors.email = "Informe o email.";
    } else if (!emailValido(email)) {
      newErrors.email = "Email inválido ou domínio não permitido.";
    }

    if (!cursoETurma) {
      newErrors.cursoETurma = "Informe curso e turma ou setor.";
    } else if (!cursoValido(cursoETurma)) {
      newErrors.cursoETurma =
        "Curso/Turma não pode conter caracteres especiais.";
    }
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
     
    if (dataEmprestimo && dataDevolucao) {
      const dataEmp = new Date(dataEmprestimo + "T12:00:00");
      const dataDev = new Date(dataDevolucao + "T12:00:00");

      if (dataDev < dataEmp) {
        newErrors.dataDevolucao = "A data de devolução não pode ser anterior à data de retirada.";
      }
    }
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
    setSolicitante("");
    setEmail("");
    setCursoETurma("");
    setContato("");
    setComponentes([]);
    setComponenteInput("");
    setDataEmprestimo("");
    setDataDevolucao("");
    setTermosAceitos(false);
    setErrors({});
    setStep(1);
  }

  return (
   <div className="w-full max-w-6xl mx-auto px-4 md:px-24 md:justify-center ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 ">
        {/* ===== ETAPA 1 ===== */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row  w-full gap-4">
              <div className="flex flex-col w-full  gap-4">
                <InputRed
                  title="Solicitante:"
                  value={solicitante}
                  placeholder="Insira seu nome completo"
                  onChange={(e) => {
                    const valor = e.target.value;

                    if (/^[A-Za-zÀ-ÿ\s]*$/.test(valor)) {
                      setSolicitante(valor);
                    }
                  }}
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
                  
                  onChange={(e) => {
                    const valor = e.target.value;

                    if (/^[A-Za-zÀ-ÿ0-9\s\-/]*$/.test(valor)) {
                      setCursoETurma(valor);
                    }
                  }}
                  error={errors.cursoETurma}
                />
                <InputRed
                  title="Telefone:"
                  value={contato}
                  placeholder="Insira o seu telefone Ex.: (DDD) 9 00000000"
                  onChange={(e) => setContato(formatarTelefone(e.target.value))}
                  error={errors.contato}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => validarStep1() && setStep(2)}
              className="h-[50px] hover:bg-[#001438] bg-[#0E4194] text-white rounded mt-4"
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
              onChange={(valor) => {
                if (/^[A-Za-zÀ-ÿ0-9\s]*$/.test(valor)) {
                  setComponenteInput(valor);
                }
              }}
              onAdd={adicionarComponente}
              items={componentes}
              onRemove={removerComponente}
              onUpdateQuantidade={atualizarQuantidade}
              title="Lista de Itens Emprestados:"
              descricao="Digite o nome do item *Dica: Clique no botão de + azul para adicionar o componente na lista e adicionar a quantidade"
              error={errors.componentes}
            />

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Empréstimo */}
              <div className="flex flex-col gap-1">
                <DatePickerInput
                  title="Data do Empréstimo"
                  selected={dataEmprestimo ? new Date(dataEmprestimo + "T12:00:00") : null}
                  onChange={(date) => {
                    if (!date) {
                      setDataEmprestimo("");
                      return;
                    }
                    const dataLocal = new Date(date);
                    dataLocal.setHours(12, 0, 0, 0);
                    const ano = dataLocal.getFullYear();
                    const mes = String(dataLocal.getMonth() + 1).padStart(2, "0");
                    const dia = String(dataLocal.getDate()).padStart(2, "0");
                    setDataEmprestimo(`${ano}-${mes}-${dia}`);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecione a data"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.dataEmprestimo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {/* Exibição do erro de empréstimo */}
                {errors.dataEmprestimo && <span className="text-red-500 text-sm">{errors.dataEmprestimo}</span>}
              </div>

              {/* Devolução */}
              <div className="flex flex-col gap-1">
                <DatePickerInput
                  title="Data de Devolução"
                  selected={dataDevolucao ? new Date(dataDevolucao + "T12:00:00") : null}
                  onChange={(date) => {
                    if (!date) {
                      setDataDevolucao("");
                      return;
                    }
                    const dataLocal = new Date(date);
                    dataLocal.setHours(12, 0, 0, 0);
                    const ano = dataLocal.getFullYear();
                    const mes = String(dataLocal.getMonth() + 1).padStart(2, "0");
                    const dia = String(dataLocal.getDate()).padStart(2, "0");
                    setDataDevolucao(`${ano}-${mes}-${dia}`);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecione a data"
                  // --- BLOQUEIA DATAS ANTERIORES NO CALENDÁRIO ---
                  minDate={dataEmprestimo ? new Date(dataEmprestimo + "T12:00:00") : null}
                  // ----------------------------------------------
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.dataDevolucao ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {/* Exibição do erro de devolução */}
                {errors.dataDevolucao && <span className="text-red-500 text-sm">{errors.dataDevolucao}</span>}
              </div>
            </div>
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
              <button type="button" onClick={() => setStep(1)} className="h-[50px] hover:bg-blue-500 w-full text-white bg-blue-400 rounded"> 
                Voltar
              </button>
              <button type="submit" className="h-[50px] hover:bg-[#001438] w-full bg-[#0E4194] text-white rounded">
                Enviar
              </button>
            </div>
            <h1 className="text-md text-justify text-red-600 ">
              *Aguarde a confirmação da página antes de enviar uma nova Solicitação
            </h1>
          </div>
        )}
      </form>
    </div>
  );
}