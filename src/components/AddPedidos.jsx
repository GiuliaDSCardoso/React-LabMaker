import { useState } from "react";

import { supabase } from "../services/supabase";
import InputRed from "../assets/styles/InputRed";

export default function AddPedidos() {
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

    const diffEmDias =
      (dataSelecionada - hoje) / (1000 * 60 * 60 * 24);

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
      alert("Preencha todos os campos!");
      return;
    }

    if (prazoMenorQue10Dias(dataEntrega)) {
      alert("⚠️ Prazo mínimo de 10 dias.");
      return;
    }

    const arquivoBase64 = await fileToBase64(enviarArquivo);

    const { error } = await supabase.from("pedidos").insert([
      {
        solicitante,
        email,
        curso_turma: cursoETurma,
        contato,
        cargo,
        material,
        sobre_projeto: sobreProjeto,
        detalhe,
        data_entrega: dataEntrega,
        arquivo_base64: arquivoBase64,
        is_completed: false,
        historico: [
          {
            data: new Date().toLocaleString("pt-BR"),
            acao: "Solicitação criada",
          },
        ],
      },
    ]);

    if (error) {
      console.error(error);
      alert("Erro ao enviar pedido");
      return;
    }

    alert("✅ Pedido enviado com sucesso!");

    setSolicitante("");
    setEmail("");
    setCursoETurma("");
    setContato("");
    setCargo("");
    setEnviarArquivo(null);
    setDataEntrega("");
    setMaterial("");
    setSobreProjeto("");
    setDetalhe("");
    setIsCompleted(false);
  }



  return (
   <div className="flex  flex-col items-center justify-center mb-20 gap-6 px-4 w-full">
   <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
    
    {/* COLUNA ESQUERDA */}
    <div className="w-full flex flex-col gap-4">
      <InputRed
        id="solicitante"
        title="Solicitante:"
        value={solicitante}
        disabled={isCompleted}
        placeholder="Insira o seu nome completo"
        onChange={(e) => setSolicitante(e.target.value)}
      />

      <div className="flex flex-col justify-center ">
        <label className="text-lg md:text-2xl font-medium text-gray-700 flex gap-1">
          Material de confecção:
          <span className="relative group cursor-help text-red-600">*</span>
        </label>

        <select
          value={material}
          disabled={isCompleted}
          onChange={(e) => setMaterial(e.target.value)}
          className="
            w-[100%] md:w-full h-[50px] px-3
            text-[#a7a7a7] bg-[#e5eeff]
            outline-none text-lg
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

      <InputRed
        id="email"
        title="Email:"
        type="email"
        value={email}
        disabled={isCompleted}
        placeholder="Insira o seu email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputRed
        id="cursoETurma"
        title="Curso e Turma:"
        value={cursoETurma}
        disabled={isCompleted}
        placeholder="Insira seu curso e turma"
        onChange={(e) => setCursoETurma(e.target.value)}
      />

      <InputRed
        id="contato"
        title="Telefone:"
        value={contato}
        placeholder="(11) 91234-5678"
        disabled={isCompleted}
        onChange={(e) => setContato(e.target.value)}
      />
    </div>

    {/* COLUNA DIREITA */}
    <div className="w-full flex flex-col gap-4">
      <InputRed
        id="sobreProjeto"
        title="Descreva o projeto:"
        value={sobreProjeto}
        disabled={isCompleted}
        placeholder="Descreva o seu projeto"
        onChange={(e) => setSobreProjeto(e.target.value)}
      />
      <div>
        <label className="text-lg md:text-2xl font-medium text-gray-700 flex gap-1" htmlFor="cargo">Cargo:</label>
         <select
        value={cargo}
        disabled={isCompleted}
        onChange={(e) => setCargo(e.target.value)}
        className="w-[100%] md:w-full h-[50px] text-[#a7a7a7] text-lg bg-[#e5eeff]
              file:mr-4 file:py-2 file:px-4 file:bg-[#0062c4] file:text-white"
      >
        <option value="">Selecione um cargo</option>
        <option value="Administrativo">Administrativo</option>
        <option value="Aluno">Aluno</option>
        <option value="Docente">Docente</option>
      </select>

      </div>  
      <div>
        <label className="text-lg md:text-2xl font-medium text-gray-700 flex gap-1" htmlFor="Arquivo">Arquivo:</label>
        <input
        type="file"
        disabled={isCompleted}
        onChange={(e) => setEnviarArquivo(e.target.files[0])}
        className="w-[100%] md:w-full h-[50px] text-[#a7a7a7] text-lg bg-[#e5eeff]
              file:mr-4 file:py-3 file:px-4 file:bg-[#0062c4] file:border-none file:text-white"
      />
      </div>
      

      <InputRed
        type="date"
        title="Data de Entrega (prazo mínimo 10 dias úteis):"
        value={dataEntrega}
        disabled={isCompleted}
        onChange={(e) => setDataEntrega(e.target.value)}
      />

      <InputRed
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
    className="h-[50px] w-[100%] md:w-[500px] mt-4 bg-[#0062c4] text-white  text-lg md:text-2xl rounded"
  >
    Enviar Solicitação
  </button>
</div>
  );
}
