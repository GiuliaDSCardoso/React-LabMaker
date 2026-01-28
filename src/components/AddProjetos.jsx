import { useState } from "react";
import InputRed from "../assets/styles/InputRed.jsx";

import { supabase } from "../services/supabase";


export default function AddProjetos() {
  const [solicitante, setSolicitante] = useState("");
  const [email, setEmail] = useState("");
  const [cursoETurma, setCursoETurma] = useState("");
  const [contato, setContato] = useState("");
  const [enviarArquivo, setEnviarArquivo] = useState(null);
  const [dataSaida, setDataSaida] = useState("");
  const [sobreProjeto, setSobreProjeto] = useState("");
  const [cargo, setCargo] = useState("");


  async function handleSubmit() {
    if (!enviarArquivo) {
      alert("Envie um arquivo!");
      return;
    }

    const fileName = `${Date.now()}-${enviarArquivo.name}`;

    const { error: uploadError } = await supabase.storage
      .from("projetos")
      .upload(`arquivos/${fileName}`, enviarArquivo);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from("projetos")
      .getPublicUrl(`arquivos/${fileName}`);

    const arquivo_url = data.publicUrl;

    const { error } = await supabase.from("projetos").insert([
      {
        solicitante,
        email,
        cargo,
        curso_turma: cursoETurma,
        contato,
        sobre_projeto: sobreProjeto,
        data_saida: dataSaida,
        arquivo_url,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Projeto enviado com sucesso!");

    setSolicitante("");
    setEmail("");
    setCursoETurma("");
    setCargo("");
    setContato("");
    setSobreProjeto("");
    setEnviarArquivo(null);
    setDataSaida("");
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
            <InputRed
              title="Descreva o projeto:"
              value={sobreProjeto}
              placeholder="Descreva o seu projeto"
              onChange={(e) => setSobreProjeto(e.target.value)}
            />
            <div>
              <label className="text-lg md:text-2xl font-medium text-gray-700 flex gap-1" htmlFor="cargo">Enviar uma foto do projeto:</label>
              <input
              type="file"
              onChange={(e) => setEnviarArquivo(e.target.files[0])}
              className="w-[100%] md:w-full text-lg h-[50px] bg-[#e5eeff] file:text-lg
              file:mr-4 file:py-3 file:px-4 file:border-none file:bg-[#0062c4] text-[#a7a7a7] file:text-white"
            />
            </div>
            

            <InputRed
              type="date"
              title="Data de Retirada:"
              value={dataSaida}
              placeholder="Selecione a data de retirada"
              onChange={(e) => setDataSaida(e.target.value)}
            />
            <div>
              <label className="text-lg md:text-2xl font-medium text-gray-700 flex gap-1" htmlFor="cargo">Cargo:</label>
            <select
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-[100%] md:w-full text-lg h-[50px] px-3 text-[#616161] bg-[#e5eeff]"
            >
              <option value="">Selecione um cargo</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Aluno">Aluno</option>
              <option value="Docente">Docente</option>
            </select>
            </div>
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
