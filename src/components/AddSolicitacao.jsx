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

  function adicionarComponente() {
    if (!componenteInput.trim()) return;
    setComponentes((prev) => [...prev, componenteInput.trim()]);
    setComponenteInput("");
  }

  function removerComponente(index) {
    setComponentes(componentes.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
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

    const { error } = await supabase.from("emprestimos").insert({
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

    if (error) {
      console.error(error);
      alert("Erro ao enviar solicitação");
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
  }

  return (
    <div className="flex  flex-col items-center justify-center mb-20 gap-6 px-4 w-full">
             <div className="flex md:flex-row flex-col md:justify-center gap-6  w-full">
            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
              {/* COLUNA ESQUERDA */}
              <div className="w-full flex flex-col gap-4">
                <InputRed title="Solicitante:" placeholder="Insira o seu nome completo" value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />
                <InputRed title="Email:" type="email" placeholder="Insira o seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputRed title="Curso e Turma:" placeholder="Insira seu curso e turma" value={cursoETurma} onChange={(e) => setCursoETurma(e.target.value)} />
                <InputRed title="Telefone:" placeholder="(11) 91234-5678" value={contato} onChange={(e) => setContato(e.target.value)} />
    
               
              </div>
    
              {/* COLUNA DIREITA */}
              <div className="w-full flex flex-col gap-4">
                 <div className="flex flex-col ">
            <label className="text-lg md:text-2xl font-medium text-gray-700">
              Componente(s) a ser(em) emprestado(s):
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

            {/* LISTA DE COMPONENTES */}
              {componentes.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {componentes.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center   justify-between bg-blue-50 px-3 py-1 rounded text-lg"
                    >
                      {item}
                      <button
                        onClick={() => removerComponente(index)}
                        className="text-red-500   hover:text-red-700"
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
      
    </div>
    <button
                  onClick={handleSubmit}
                  className="h-[50px] w-[100%] md:w-[500px] mt-4 bg-[#0062c4] text-2xl text-white rounded"
                >
                  Enviar Solicitação
        </button>
    </div>
      );
}
