import { useState } from "react";
import InputRed from "../assets/styles/InputRed.jsx";
import { supabase } from "../services/supabase";
import InputFile from "../assets/styles/InputFile.jsx";
import InputSelect from "../assets/styles/InputSelect.jsx";

export default function AddProjetos() {
  const [solicitante, setSolicitante] = useState("");
  const [email, setEmail] = useState("");
  const [cursoETurma, setCursoETurma] = useState("");
  const [contato, setContato] = useState("");
  const [enviarArquivo, setEnviarArquivo] = useState(null);
  const [dataSaida, setDataSaida] = useState("");
  const [sobreProjeto, setSobreProjeto] = useState("");
  const [cargo, setCargo] = useState("");
  const [error, setError] = useState("");

  // ===============================
  // DATA ATUAL (YYYY-MM-DD)
  // ===============================
  const hoje = new Date().toISOString().split("T")[0];

  function formatarTelefone(valor) {
    let numero = valor.replace(/\D/g, "");
    numero = numero.slice(0, 11);

    if (numero.length <= 2) return `(${numero}`;
    if (numero.length <= 3)
      return `(${numero.slice(0, 2)}) ${numero.slice(2)}`;
    if (numero.length <= 7)
      return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(3)}`;

    return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(
      3,
      7
    )}-${numero.slice(7)}`;
  }

  // ===============================
  // VALIDAÇÃO DE EMAIL
  // ===============================
  function emailValido(email) {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    const dominiosPermitidos = [
      "@gmail.com",
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !solicitante ||
      !email ||
      !cursoETurma ||
      !contato ||
      !sobreProjeto ||
      !cargo ||
      !dataSaida
    ) {
      setError("Por favor, preencha todos os campos!");
      return;
    }

    // ===============================
    // VALIDAÇÃO DE EMAIL
    // ===============================
    if (!emailValido(email)) {
      alert(
        "Informe um email válido, com até 60 caracteres e domínio permitido."
      );
      return;
    }

    const telefoneValido = /^\(\d{2}\) 9 \d{4}-\d{4}$/;
    if (!telefoneValido.test(contato)) {
      alert("⚠️ Informe um telefone válido no formato (DDD) 9 XXXX-XXXX");
      return;
    }

    // ===============================
    // VALIDAÇÃO DE DATA
    // ===============================
    if (dataSaida < hoje) {
      alert("A data de retirada não pode ser anterior a hoje.");
      return;
    }

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

    const { error: insertError } = await supabase.from("projetos").insert([
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

    if (insertError) {
      alert(insertError.message);
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
    <div className="flex flex-col items-center justify-center mb-20 gap-6 px-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-6xl"
      >
        {error && (
          <p className="text-red-600 text-center text-lg font-medium">
            {error}
          </p>
        )}

        <div className="flex md:flex-row flex-col md:justify-center gap-6 w-full">
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
              placeholder="Insira o seu email institucional"
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
              placeholder="Insira o seu telefone Ex.: (DDD) 9 00000000"
              value={contato}
              onChange={(e) => setContato(formatarTelefone(e.target.value))}
            />
          </div>

          <div className="w-full flex flex-col gap-4">
            <InputRed
              title="Descreva o projeto:"
              value={sobreProjeto}
              placeholder="Descreva o seu projeto"
              onChange={(e) => setSobreProjeto(e.target.value)}
            />

            <InputFile
                title="Anexar arquivo"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={setEnviarArquivo}
               
            />

            <InputRed
              type="date"
              title="Data de Retirada:"
              value={dataSaida}
              min={hoje}
              placeholder="Selecione a data de retirada"
              onChange={(e) => setDataSaida(e.target.value)}
            />

            <InputSelect
              title="Cargo:"
              value={cargo}
              onChange={(e) =>
                setCargo(e.target.value)
              }
              options={[
                "Administrativo",
                "Aluno",
                "Docente",
                "Estagiário",
              ]}
            
            />
          </div>
        </div>

        <button
          type="submit"
          className="h-[50px] w-[100%] hover:bg-[#001438]  md:w-[500px] mt-4 bg-[#0062c4] text-xl text-white rounded"
        >
          Enviar Solicitação
        </button>
      </form>
    </div>
  );
}
