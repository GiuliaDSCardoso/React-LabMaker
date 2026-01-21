import { useState } from "react";
import Input from "../assets/styles/Input";

export default function AddProjetos({ onAddProjetosClick }) {
  const [solicitante, setSolicitante] = useState("");
  const [email, setEmail] = useState("");
  const [cursoETurma, setCursoETurma] = useState("");
  const [contato, setContato] = useState("");
  const [cargo, setCargo] = useState("");
  const [enviarArquivo, setEnviarArquivo] = useState(null);
  const [dataEntrega, setDataEntrega] = useState("");
  const [material, setMaterial] = useState("");
  
  const [sobreProjeto, setSobreProjeto] = useState("");
  const [detalhe, setDetalhe] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  function prazoMenorQue10Dias(dataEntrega) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataSelecionada = new Date(dataEntrega);
    dataSelecionada.setHours(0, 0, 0, 0);

    const diffEmMs = dataSelecionada - hoje;
    const diffEmDias = diffEmMs / (1000 * 60 * 60 * 24);

    return diffEmDias < 10;
    }

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
    !cargo ||
    !enviarArquivo ||
    !dataEntrega ||
    !material ||
    !detalhe
  ) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  if (prazoMenorQue10Dias(dataEntrega)) {
    alert("⚠️ Prazo mínimo de 10 dias.");
    return;
  }

  const base64 = await fileToBase64(enviarArquivo);

  onAddProjetosClick({
    solicitante,
    email,
    cursoETurma,
    contato,
    detalhe,
    sobreProjeto,
    cargo,
    arquivo: {
      nome: enviarArquivo.name,
      base64, // ✅ AGORA FUNCIONA
    },
    dataEntrega,
    material,
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
  setCargo("");
  setEnviarArquivo(null);
  setDataEntrega("");
  setMaterial("");
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
          <div className="flex flex-col justify-center w-full">
            <label className="text-lg font-medium text-gray-700 flex gap-1">
                Material de confecção:
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

            <select
              value={material}
              disabled={isCompleted}
              onChange={(e) => setMaterial(e.target.value)}
              className="
                w-[500px] h-[40px] px-3
                text-[#2756ac] bg-[#e5eeff]
                outline-none
                focus:text-[#4c82e6]
                focus:ring-1 focus:ring-[#4c82e6]
              "
            >
              <option value="">Selecione um material</option>
              <option value="Impressão 3D">Impressão 3D</option>
              <option value="Acrílico de 3mm">Acrílico de 3mm</option>
              <option value="Acrílico de 4mm">Acrílico de 4mm</option>
              <option value="Acrílico de 6mm">Acrílico de 6mm</option>
              <option value="Acrílico de 8mm">Acrílico de 8mm</option>
            </select>
          </div>
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

          {/* DROPDOWN CARGO */}
          <div className="flex flex-col justify-center w-full">
            <label className="text-lg font-medium text-gray-700 flex gap-1">
                Cargo/Função:
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

            <select
              value={cargo}
              disabled={isCompleted}
              onChange={(e) => setCargo(e.target.value)}
              className="
                w-[500px] h-[40px] px-3
                text-[#2756ac] bg-[#e5eeff]
                
                outline-none
                focus:text-[#4c82e6]
                focus:ring-1 focus:ring-[#4c82e6]
              "
            >
              <option value="">Selecione um cargo</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Aluno">Aluno</option>
              <option value="Docente">Docente</option>
            </select>
          </div>
          
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
                value={dataEntrega}
                disabled={isCompleted}
                onChange={(e) => setDataEntrega(e.target.value)}
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
