import { useState } from "react";
import Input from "../../assets/styles/Input.jsx";

export default function GuardarAdmin({ onAddGuardarClick }) {
  const [solicitante, setSolicitante] = useState("");
  const [email, setEmail] = useState("");
  const [cursoETurma, setCursoETurma] = useState("");
  const [contato, setContato] = useState("");
  const [enviarArquivo, setEnviarArquivo] = useState(null);
  const [dataSaida, setDataSaida] = useState("");
  
  
  const [sobreProjeto, setSobreProjeto] = useState("");
  const [detalhe, setDetalhe] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  async function handleSubmit() {
  if (
    !solicitante ||
    !email ||
    !cursoETurma ||
    !contato ||
    !sobreProjeto ||
    !enviarArquivo ||
    !dataSaida ||
    !detalhe
  ) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

 

  const base64 = await fileToBase64(enviarArquivo);

  onAddGuardarClick({
    solicitante,
    email,
    cursoETurma,
    contato,
    detalhe,
    sobreProjeto,
    arquivo: {
      nome: enviarArquivo.name,
      base64, // ✅ AGORA FUNCIONA
    },
    dataSaida,
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
  setSobreProjeto("");
  setDetalhe("");

  setEnviarArquivo(null);
  setDataSaida("");

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

          <Input
                id="contato"
                title="Telefone:"
                value={contato}
                placeholder="(11) 91234-5678"
                disabled={isCompleted}
                onChange={(e) => setContato(e.target.value)}
                />

        </div>

        {/* COLUNA DIREITA */}
        <div className="flex flex-col gap-4">
          <Input
            id="sobreProjeto"
            title="Descreva o projeto:"
            value={sobreProjeto}
            disabled={isCompleted}
            placeholder="Descreva o seu projeto"
            onChange={(e) => setSobreProjeto(e.target.value)}
          />
          
          <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-700 flex gap-1">
                Enviar Arquivo do Projeto
                <span className="relative group cursor-help text-red-600">
                  *
                  <span
                    className="
                      absolute left-1/2 -translate-x-1/2 top-6
                      hidden group-hover:block
                      bg-black text-white text-xs
                      px-2 py-1 rounded
                      whitespace-nowrap
                      z-50
                    "
                  >
                    item obrigatório
                  </span>
                </span>
              </label>

              <input
                type="file"
                disabled={isCompleted}
                onChange={(e) => setEnviarArquivo(e.target.files[0])}
                className="
                  w-[500px] h-[40px] pb-3
                  text-[#2756ac]
                  bg-[#e5eeff]
                 
                  file:mr-4 file:py-2 file:px-4
                  file:h-[42px]
                  file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#0062c4] file:text-white
                  hover:file:bg-[#0257ac]
                  cursor-pointer
                "
              />
            </div>


          {/* DATAS */}
          <Input
                className="w-full h-[40px] px-3 text-[#2756ac] bg-[#e5eeff] 
                outline-none focus:ring-1 focus:ring-[#4c82e6]"
                type="date"
                title="Data de Entrega  (prazo mínimo 10 dias úteis):"
                value={dataSaida}
                disabled={isCompleted}
                onChange={(e) => setDataSaida(e.target.value)}
              />
          
            
        
          <Input
                id="componente"
                title="Detalhe sobre o pedido:"
                value={detalhe}
                disabled={isCompleted}
                placeholder="Cor amarela, tamanho 30x30cm"
                onChange={(e) => setDetalhe(e.target.value)}
            />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isCompleted}
        className={`p-2 rounded-md w-[50%]
          ${
            isCompleted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0062c4] active:bg-[#0257ac] text-white"
          }`}
      >
        Enviar Solicitação
      </button>
    </div>
  );
}