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
  const [error, setError] = useState("");
  const [termosAceitos, setTermosAceitos] = useState(false); // ✅ checkbox
  function formatarTelefone(valor) {
  // remove tudo que não for número
  let numero = valor.replace(/\D/g, "");

  // limita a 11 dígitos (DDD + 9 + 8 números)
  numero = numero.slice(0, 11);

  if (numero.length <= 2) {
    return `(${numero}`;
  }

  if (numero.length <= 3) {
    return `(${numero.slice(0, 2)}) ${numero.slice(2)}`;
  }

  if (numero.length <= 7) {
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(3)}`;
  }

  return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(
    3,
    7
  )}-${numero.slice(7)}`;
}

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
    e.preventDefault();
    setError("");

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
    const telefoneValido = /^\(\d{2}\) 9 \d{4}-\d{4}$/;

    if (!telefoneValido.test(contato)) {
      setError("⚠️ Informe um telefone válido no formato (DDD) 9 XXXX-XXXX");
      return;
    }

    if (!emailValido(email)) {
      alert(
        "Use um email válido: @gmail.com, @ba.estudante.senai.br, @fieb.org.br ou @fbest.org.br"
      );
      return;
    }

    if (!termosAceitos) {
      alert(
        "Você precisa aceitar os termos sobre devolução do item emprestado."
      );
      return;
    }

   const { error: supaError } = await supabase.from("emprestimos").insert({
      solicitante,
      email,
      curso_turma: cursoETurma,
      contato,
      item: componentes.join(" | "),
      data_saida: dataEmprestimo,
      data_retorno: dataDevolucao,
      is_completed: false,
      termos_aceitos: termosAceitos, // ✅ salva o valor
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

    setSolicitante("");
    setEmail("");
    setCursoETurma("");
    setContato("");
    setComponentes([]);
    setComponenteInput("");
    setDataEmprestimo("");
    setDataDevolucao("");
    setIs_Completed(false);
    setTermosAceitos(false);
  }

  return (
    <div className="flex flex-col items-center justify-center mb-20 gap-6 px-4 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-6xl">
        {/* COLUNAS de inputs */}
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
              onChange={(e) => setContato(formatarTelefone(e.target.value))}
            />
          </div>

          {/* COLUNA DIREITA */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <label className="text-lg md:text-xl font-medium text-gray-700">
                Componente(s) a ser(em) emprestado(s):
              </label>
              <div className="flex gap-2">
                <input
                  value={componenteInput}
                  disabled={is_completed}
                  placeholder="Digite o componente e a quantidade Ex. 2 Led azul"
                  onChange={(e) => setComponenteInput(e.target.value)}
                  className="w-[100%] h-[50px] px-3 placeholder:text-[#000000] bg-[#e5eeff] outline-none text-lg focus:ring-1 focus:ring-[#4c82e6]"
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

        {/* Checkbox de termos */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="termos"
            checked={termosAceitos}
            onChange={(e) => setTermosAceitos(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="termos" className="text-gray-700 text-sm">
            Li e aceito que o item emprestado deve ser devolvido no mesmo estado que foi retirado e que quaisquer danos serão de minha responsabilidade.
          </label>
        </div>

        {error && (
          <p className="text-red-600 text-center text-lg font-medium">{error}</p>
        )}

        <button
          type="submit"
          className="h-[50px] w-[100%] md:w-[500px] mt-4 bg-[#0062c4] text-xl text-white rounded"
        >
          Enviar Solicitação
        </button>
      </form>
    </div>
  );
}
