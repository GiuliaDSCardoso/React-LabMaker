import { useState } from "react";
import Input from "../assets/styles/Input";
import { Plus, X } from "lucide-react";

export default function AddSolicitacao({ onAddSolicitacaoClick }) {
  const [solicitante, setSolicitante] = useState("");
  const [email, setEmail] = useState("");
  const [cursoETurma, setCursoETurma] = useState("");
  const [contato, setContato] = useState("");

  const [componenteInput, setComponenteInput] = useState("");
  const [componentes, setComponentes] = useState([]);

  const [dataEmprestimo, setDataEmprestimo] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  function adicionarComponente() {
    if (!componenteInput.trim()) return;

    setComponentes((prev) => [...prev, componenteInput.trim()]);
    setComponenteInput(""); // 🔥 limpa o input
  }

  function removerComponente(index) {
    setComponentes(componentes.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (
      !solicitante ||
      !email ||
      !cursoETurma ||
      !contato ||
      componentes.length === 0 ||
      !dataEmprestimo ||
      !dataDevolucao
    ) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    onAddSolicitacaoClick({
      solicitante,
      email,
      cursoETurma,
      contato,
      componentes, // ✅ agora é lista
      dataEmprestimo,
      dataDevolucao,
      isCompleted,
      historico: [
        {
          data: new Date().toLocaleString(),
          acao: "Solicitação criada",
        },
      ],
    });

    alert("✅ Solicitação enviada com sucesso!");

    setSolicitante("");
    setEmail("");
    setCursoETurma("");
    setContato("");
    setComponentes([]);
    setComponenteInput("");
    setDataEmprestimo("");
    setDataDevolucao("");
    setIsCompleted(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full gap-6">
        {/* COLUNA ESQUERDA */}
        <div className="w-1/2 flex flex-col gap-4">
          <Input
            id="solicitante"
            title="Solicitante:"
            value={solicitante}
            disabled={isCompleted}
            placeholder="Insira o seu nome completo"
            onChange={(e) => setSolicitante(e.target.value)}
          />

          <Input
            id="email"
            title="Email:"
            type="email"
            value={email}
            disabled={isCompleted}
            placeholder="Insira o seu email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            id="cursoETurma"
            title="Curso e Turma:"
            value={cursoETurma}
            disabled={isCompleted}
            placeholder="Insira seu curso e turma"
            onChange={(e) => setCursoETurma(e.target.value)}
          />

          {/* COMPONENTES */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium text-gray-700">
              Componente(s) a ser(em) emprestado(s):
            </label>

            <div className="flex gap-2">
              <input
                value={componenteInput}
                disabled={isCompleted}
                placeholder="Digite o componente e a quantidade Ex. 2 Led azul"
                onChange={(e) => setComponenteInput(e.target.value)}
                className="
                  w-[420px] h-[40px] px-3
                  text-[#2756ac] bg-[#e5eeff]
                  outline-none
                  focus:ring-1 focus:ring-[#4c82e6]
                "
              />

              <button
                type="button"
                onClick={adicionarComponente}
                className="w-[40px] h-[40px] bg-[#0062c4] text-white flex items-center justify-center rounded hover:bg-[#0257ac]"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* LISTA DE COMPONENTES */}
            {componentes.length > 0 && (
              <ul className="mt-2 space-y-1">
                {componentes.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-blue-50 px-3 py-1 rounded text-sm"
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

          <button
            onClick={handleSubmit}
            disabled={isCompleted}
            className={`h-[40px] w-full mt-4
              ${
                isCompleted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0062c4] active:bg-[#0257ac] text-white"
              }`}
          >
            Enviar Solicitação
          </button>
        </div>

        {/* COLUNA DIREITA */}
        <div className="flex flex-col gap-4">
          <Input
            id="contato"
            title="Telefone:"
            value={contato}
            placeholder="Insira seu telefone ou outro meio de contato"
            disabled={isCompleted}
            onChange={(e) => setContato(e.target.value)}
          />

          <Input
            id="dataEmprestimo"
            title="Data do empréstimo:"
            type="date"
            value={dataEmprestimo}
            disabled={isCompleted}
            onChange={(e) => setDataEmprestimo(e.target.value)}
          />

          <Input
            id="dataDevolucao"
            title="Data de devolução:"
            type="date"
            value={dataDevolucao}
            disabled={isCompleted}
            onChange={(e) => setDataDevolucao(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
