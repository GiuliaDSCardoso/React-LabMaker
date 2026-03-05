import { useEffect, useState } from "react";
import InputRed from "../assets/styles/InputRed.jsx";
import { supabase } from "../services/supabase";
import InputFile from "../assets/styles/InputFile.jsx";
import InputSelect from "../assets/styles/InputSelect.jsx";
import DatePickerInput from "../assets/styles/DatePickerInput";

export default function AddProjetos() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [solicitante, setSolicitante] = useState("");
  const [email, setEmail] = useState("");
  const [cursoETurma, setCursoETurma] = useState("");
  const [contato, setContato] = useState("");
  const [cargo, setCargo] = useState("");

  const [enviarArquivo, setEnviarArquivo] = useState(null);
  const [dataSaida, setDataSaida] = useState(null);
  const [sobreProjeto, setSobreProjeto] = useState("");

  useEffect(() => {
    supabase.auth.signOut();
  }, []);

  function formatarTelefone(valor) {
    let numero = valor.replace(/\D/g, "").slice(0, 11);

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

  function validarStep1() {
    const newErrors = {};

    if (!solicitante) newErrors.solicitante = "Informe o nome completo.";
    if (!email) newErrors.email = "Informe o email.";
    if (!cursoETurma) newErrors.cursoETurma = "Informe curso e turma.";
    if (!contato) newErrors.contato = "Informe o telefone.";
    if (!cargo) newErrors.cargo = "Selecione o cargo.";

    if (email && !emailValido(email)) {
      newErrors.email = "Informe um email válido com domínio permitido.";
    }

    const telefoneValido = /^\(\d{2}\) 9 \d{4}-\d{4}$/;
    if (contato && !telefoneValido.test(contato)) {
      newErrors.contato = "Telefone inválido. Use (DDD) 9 XXXX-XXXX";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!sobreProjeto) newErrors.sobreProjeto = "Descreva o projeto.";
    if (!enviarArquivo) newErrors.enviarArquivo = "Anexe um arquivo.";

    if (!dataSaida) {
      newErrors.dataSaida = "Informe a data de retirada.";
    } else {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (dataSaida < hoje) {
        newErrors.dataSaida = "A data não pode ser anterior a hoje.";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const dataFormatada = dataSaida.toISOString().split("T")[0];

    const fileName = `${Date.now()}-${enviarArquivo.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;

    const { error: uploadError } = await supabase.storage
      .from("projetos")
      .upload(`arquivos_url/${fileName}`, enviarArquivo, {
        contentType: enviarArquivo.type,
      });

    if (uploadError) {
      setErrors({ supabase: uploadError.message });
      return;
    }

    const { data } = supabase.storage
      .from("projetos")
      .getPublicUrl(`arquivos_url/${fileName}`);

    const { error: insertError } = await supabase.from("projetos").insert([
      {
        solicitante,
        email,
        cargo,
        curso_turma: cursoETurma,
        contato,
        sobre_projeto: sobreProjeto,
        data_saida: dataFormatada,
        arquivo_url: data.publicUrl,
      },
    ]);

    if (insertError) {
      setErrors({ supabase: insertError.message });
      return;
    }

    alert("✅ Projeto enviado com sucesso!");

    setStep(1);
    setSolicitante("");
    setEmail("");
    setCursoETurma("");
    setCargo("");
    setContato("");
    setSobreProjeto("");
    setEnviarArquivo(null);
    setDataSaida(null);
    setErrors({});
  }

  return (
    <div className="flex flex-col max-w-6xl mx-auto mt-5 md:px-24 items-center w-full px-4 mb-20">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-6xl"
      >
        {errors.supabase && (
          <p className="text-red-600 text-center text-lg font-medium">
            {errors.supabase}
          </p>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex md:flex-row flex-col gap-6">
              <div className="w-full flex flex-col gap-4">
                <InputRed
                  title="Solicitante:"
                  placeholder="Insira o seu nome completo"
                  value={solicitante}
                  onChange={(e) => setSolicitante(e.target.value)}
                  error={errors.solicitante}
                />

                <InputRed
                  title="Email:"
                  type="email"
                  placeholder="Insira o seu email institucional"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />

                <InputRed
                  title="Curso e Turma:"
                  placeholder="Insira seu curso e turma"
                  value={cursoETurma}
                  onChange={(e) => setCursoETurma(e.target.value)}
                  error={errors.cursoETurma}
                />
              </div>

              <div className="w-full flex flex-col gap-4">
                <InputRed
                  title="Telefone:"
                  placeholder="Insira o seu telefone Ex.: (DDD) 9 0000-0000"
                  value={contato}
                  onChange={(e) =>
                    setContato(formatarTelefone(e.target.value))
                  }
                  error={errors.contato}
                />

                <InputSelect
                  title="Cargo:"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  options={[
                    "Administrativo",
                    "Aluno",
                    "Docente",
                    "Estagiário",
                  ]}
                  error={errors.cargo}
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

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <InputRed
              title="Descreva o projeto:"
              value={sobreProjeto}
              placeholder="Descreva o seu projeto *Dica: seja breve e objetivo*"
              onChange={(e) => setSobreProjeto(e.target.value)}
              error={errors.sobreProjeto}
            />

            <InputFile
              title="Anexar arquivo"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={setEnviarArquivo}
              error={errors.enviarArquivo}
            />

            <DatePickerInput
              title="Data de Retirada:"
              selected={dataSaida}
              onChange={setDataSaida}
              error={errors.dataSaida}
            />

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-[50px] hover:bg-blue-500 w-full bg-blue-400 rounded"
              >
                Voltar
              </button>

              <button
                type="submit"
                className="h-[50px] w-full bg-[#0E4194] text-white rounded hover:bg-[#001438]"
              >
                Enviar
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}