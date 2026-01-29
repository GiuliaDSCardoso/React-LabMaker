import { useState } from "react";
import { Plus, X } from "lucide-react";
import { supabase } from "../services/supabase";
import InputRed from "../assets/styles/InputRed";

export default function AddSolicitacao() {
  const [solicitante, setSolicitante] = useState("");
  const [email, setEmail] = useState("");
  const [cursoETurma, setCursoETurma] = useState("");
  const [contato, setContato] = useState("");
  const [componenteInput, setComponenteInput] = useState("");
  const [componentes, setComponentes] = useState([]);
  const [dataEmprestimo, setDataEmprestimo] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [is_completed, setIs_Completed] = useState(false);
  const [error, setError] = useState(""); // Para mostrar mensagens de erro

  // Função para validar email
  function emailValido(email) {
    const dominiosPermitidos = [
      "@gmail.com",
      "@fieb.org.br",
      "@ba.estudante.senai.br",
      "@fbest.org.br",
    ];
    return dominiosPermitidos.some((dominio) =>
      email.toLowerCase().endsWith(dominio)
    );
  }

  function adicionarComponente() {
    if (!componenteInput.trim()) return;
    setComponentes((prev) => [...prev, componenteInput.trim()]);
    setComponenteInput("");
  }

  function removerComponente(index) {
    setComponentes(componentes.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault(); // Previne envio padrão do formulário
    setError("");

    // Validação de campos
    if (
      !solicitante ||
      !email ||
      !cursoETurma ||
      !contato ||
      componentes.length === 0 ||
      !dataEmprestimo ||
      !dataDevolucao
    ) {
      setError("Preencha todos os campos!");
      return;
    }

    // Validação do email
    if (!emailValido(email)) {
      alert(
        "Use um email válido: @gmail.com, @ba.estudante.senai.br, @fieb.org.br ou @fbest.org.br"
      );
      return;
    }

    // Inserção no Supabase
    const { error: supaError } = await supabase.from("emprestimos").insert({
      solicitante,
      email,
      curso_turma: cursoETurma,
      contato,
      item: componentes.join(" | "),
      data_saida: dataEmprestimo,
      data_retorno: dataDevolucao,
      is_completed: false,
      historico: [
        {
          data: new Date().toLocaleString("pt-BR"),
          acao: "Solicitação criada",
        },
      ],
    });

    if (supaError) {
      console.error(supaError);
      setError("Erro ao enviar solicitação");
      return;
    }

    alert("✅ Solicitação enviada com sucesso!");

    // Resetar campos
    setSolicitante("");
    setEmail("");
    setCursoETurma("");
    setContato("");
    setComponentes([]);
    setComponenteInput("");
    setDataEmprestimo("");
    setDataDevolucao("");
    setIs_Completed(false);
  }

  return (
    <div className="flex flex-col items-center justify-center mb-20 gap-6 px-4 w-full">
      <form
        onSubmit={handleSubmit} // Importante usar onSubmit do form
        className="flex flex-col gap-6 w-full max-w-6xl"
      >
        <div className="flex md:flex-row flex-col md:justify-center gap-6 w-full">
          {/* COLUNA ESQUERDA */}
          <div className="w-full flex flex-col gap-4">
            <InputRed
              title="Solicitante:"
              placeholder="Insira o seu nome completo"
              value={solicitante}
              onChange={(e) => setSolicitante(e.target.value)}
            />
            <InputRed
              title="Email:"
              type="email"
              placeholder="Insira o seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputRed
              title="Curso e Turma:"
              placeholder="Insira seu curso e turma"
              value={cursoETurma}
              onChange={(e) => setCursoETurma(e.target.value)}
            />
            <InputRed
              title="Telefone:"
              placeholder="Use esse formato ex: (11)912345678"
              value={contato}
              onChange={(e) => setContato(e.target.value)}
            />
          </div>

          {/* COLUNA DIREITA */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <label className="text-lg md:text-xl font-medium text-gray-700">
                Componente(s) a ser(em) emprestado(s):
                <span className="relative group cursor-help text-red-600">
                    *
                    <span
                      className="
                        absolute left-1/2 -translate-x-1/2 top-6
                        hidden group-hover:block
                        bg-black text-white text-xs md:text-sm
                        px-2 py-1 rounded
                        whitespace-nowrap
                        z-50
                      "
                    >
                      item obrigatório
                    </span>
                  </span>
              </label>
              <div className="flex gap-2">
                <input
                  value={componenteInput}
                  disabled={is_completed}
                  placeholder="Digite o componente e a quantidade Ex. 2 Led azul"
                  onChange={(e) => setComponenteInput(e.target.value)}
                  className="
                    w-[100%] h-[50px] px-3
                    text-[#2756ac] bg-[#e5eeff]
                    outline-none text-lg
                    focus:ring-1 focus:ring-[#4c82e6]
                  "
                />
                <button
                  type="button"
                  onClick={adicionarComponente}
                  className="w-[40px] h-[50px] bg-[#0062c4] text-white flex items-center justify-center rounded hover:bg-[#0257ac]"
                >
                  <Plus size={18} />
                </button>
              </div>
              {componentes.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {componentes.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-blue-50 px-3 py-1 rounded text-lg"
                    >
                      {item}
                      <button
                        onClick={() => removerComponente(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <InputRed
              id="dataEmprestimo"
              title="Data do empréstimo:"
              type="date"
              value={dataEmprestimo}
              disabled={is_completed}
              onChange={(e) => setDataEmprestimo(e.target.value)}
            />
            <InputRed
              id="dataDevolucao"
              title="Data de devolução:"
              type="date"
              value={dataDevolucao}
              disabled={is_completed}
              onChange={(e) => setDataDevolucao(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-center text-lg font-medium">{error}</p>
        )}

        <button
          type="submit" // importante: botão submit
          className="h-[50px] w-[100%] md:w-[500px] mt-4 bg-[#0062c4] text-xl text-white rounded"
        >
          Enviar Solicitação
        </button>
      </form>
    </div>
  );
}
