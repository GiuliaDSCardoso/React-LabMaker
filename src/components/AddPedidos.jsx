import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import InputRed from "../assets/styles/InputRed";
import InputSelect from "../assets/styles/InputSelect";
import InputFile from "../assets/styles/InputFile";
import DatePickerInput from "../assets/styles/DatePickerInput";

export default function AddPedidos() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [solicitante, setSolicitante] = useState("");
  const [email, setEmail] = useState("");
  const [cursoETurma, setCursoETurma] = useState("");
  const [contato, setContato] = useState("");
  const [centroDeCusto, setCentroDeCusto] = useState("");

  const [cargo, setCargo] = useState("");
  const [enviarArquivo, setEnviarArquivo] = useState(null);
  const [dataEntrega, setDataEntrega] = useState(null);
  const [material, setMaterial] = useState("");
  const [sobreProjeto, setSobreProjeto] = useState("");
  const [detalhe, setDetalhe] = useState("");

  

  useEffect(() => {
    // Sempre que acessar uma página pública, desloga qualquer sessão
    supabase.auth.signOut();
  }, []);
  // ===============================
  // FORMATA TELEFONE
  // ===============================
  function formatarTelefone(valor) {
    let numero = valor.replace(/\D/g, "").slice(0, 11);
    if (numero.length === 0) return "";
    if (numero.length < 3) return `(${numero}`;
    if (numero.length < 4)
      return `(${numero.slice(0, 2)}) ${numero.slice(2)}`;
    if (numero.length < 8)
      return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(3)}`;
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(
      3,
      7
    )}-${numero.slice(7)}`;
  }

  // ===============================
  // VALIDAÇÃO STEP 1
  // ===============================
  function validarStep1() {
    const newErrors = {};

    if (!solicitante)
      newErrors.solicitante = "Informe o nome completo.";

    if (!email)
      newErrors.email = "Informe o email.";

    if (!cursoETurma)
      newErrors.cursoETurma = "Informe curso/turma ou setor.";

    if (!contato)
      newErrors.contato = "Informe o telefone.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ===============================
  // VALIDAÇÃO COMPLETA
  // ===============================
  function validarFormulario() {
      const newErrors = {};

      if (!cargo) newErrors.cargo = "Informe o seu Cargo.";
      if (!material) newErrors.material = "Informe o Material.";
      if (!sobreProjeto)
        newErrors.sobreProjeto = "Descreva o projeto.";
      if (!detalhe)
        newErrors.detalhe = "Informe detalhes do pedido.";

      // ===============================
      // Validação da data de entrega
      // ===============================
      if (!dataEntrega) {
        newErrors.dataEntrega = "Informe a data de entrega.";
      } else {
        const hojeMais10 = new Date();
        hojeMais10.setDate(hojeMais10.getDate() + 10);

        // Compara só a data (ignora horário)
        if (dataEntrega < hojeMais10) {
          newErrors.dataEntrega =
            "A data deve ser pelo menos 10 dias a partir de hoje.";
        }
      }

      if (!enviarArquivo)
        newErrors.enviarArquivo = "Anexe um arquivo.";

      // 🔥 NOVA REGRA
      if (cargo === "Administrativo" && !centroDeCusto) {
        newErrors.centroDeCusto = "Informe o Centro de Custo.";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    const arquivoBase64 = await fileToBase64(enviarArquivo);

    const { error } = await supabase.from("pedidos").insert([
        {
          solicitante,
          email,
          curso_turma: cursoETurma,
          contato,
          cargo,
          centro_custo: cargo === "Administrativo" ? centroDeCusto : null,
          material,
          sobre_projeto: sobreProjeto,
          detalhe,
             data_entrega: dataEntrega.toISOString().split("T")[0],
          arquivo: arquivoBase64,
          is_completed: false,
        },
      ]);

    if (error) {
      setErrors({
        supabase: "Erro ao enviar pedido. Tente novamente.",
      });
      return;
    }

    alert("✅ Pedido enviado com sucesso!");
    setStep(1);
    setErrors({});
  }
  useEffect(() => {
      if (cargo !== "Administrativo") {
        setCentroDeCusto("");
      }
    }, [cargo]);

    const hoje = new Date();
    const dataMinima = new Date();
    dataMinima.setDate(hoje.getDate() + 10);  

  return (
    <div className="flex flex-col items-center w-full px-4">
      <form className="flex flex-col gap-6 w-full max-w-6xl">

        {/* ===== ETAPA 1 ===== */}
        {step === 1 && (
          <div className="flex flex-col gap-6">

            <div className="flex flex-col lg:flex-row gap-6 w-full">

              <div className="w-full flex flex-col gap-4">
                <InputRed
                  title="Solicitante:"
                  value={solicitante}
                  placeholder="Informe seu nome completo"
                  onChange={(e) =>
                    setSolicitante(e.target.value)
                  }
                  error={errors.solicitante}
                />

                <InputRed
                  title="Email:"
                  type="email"
                  placeholder="Informe seu email institucional"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  error={errors.email}
                />
              </div>

              <div className="w-full flex flex-col gap-4">
                <InputRed
                  title="Curso & Turma / Setor:"
                  value={cursoETurma}
                  placeholder="Informe seu curso e turma ou setor"
                  onChange={(e) =>
                    setCursoETurma(e.target.value)
                  }
                  error={errors.cursoETurma}
                />

                <InputRed
                  title="Telefone:"
                  value={contato}
                  placeholder="Insira o seu telefone Ex.: (DDD) 9 00000000"
                  onChange={(e) =>
                    setContato(formatarTelefone(e.target.value))
                  }
                  error={errors.contato}
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

        {/* ===== ETAPA 2 ===== */}
        {step === 2 && (
          <div className="flex flex-col gap-6">

            <div className="flex flex-col lg:flex-row gap-6 w-full">

              <div className="w-full flex flex-col gap-4">
                <InputSelect
                  title="Material:"
                  value={material}
                  onChange={(e) =>
                    setMaterial(e.target.value)
                  }
                  options={[
                    "Impressão 3D",
                    "Acrílico 3mm",
                    "Acrílico 4mm",
                    "Acrílico 6mm",
                    "Acrílico 8mm",
                  ]}
                  error={errors.material}
                />

                <InputRed
                  title="Descreva o projeto:"
                  value={sobreProjeto}
                  placeholder="Informe brevemente sobre o projeto"
                  onChange={(e) =>
                    setSobreProjeto(e.target.value)
                  }
                  error={errors.sobreProjeto}
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
                  error={errors.cargo}
                />
                {cargo === "Administrativo" && (
                <InputRed
                  title="Centro de Custo:"
                  value={centroDeCusto}
                  placeholder="Informe o centro de custo disponível"
                  onChange={(e) =>
                    setCentroDeCusto(e.target.value)
                  }
                  error={errors.centroDeCusto}
                />
              )}
              </div>
              

              <div className="w-full flex flex-col gap-4">
                <InputFile
                  title="Anexar arquivo"
                  accept=".dxf,.png,.gcode,.3mf,.svg,.pdf,.jpg,.jpeg"
                  onChange={setEnviarArquivo}
                  error={errors.enviarArquivo}
                />

               <DatePickerInput
                  title="Data de Entrega:"
                  selected={dataEntrega}
                  onChange={setDataEntrega}
                  error={errors.dataEntrega}
                  minDate={dataMinima}
                />

                <InputRed
                  title="Detalhe do pedido:"
                  placeholder="Informe cor, tamanho, materiais adicionais"
                  value={detalhe}
                  onChange={(e) =>
                    setDetalhe(e.target.value)
                  }
                  error={errors.detalhe}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-[50px] hover:bg-blue-50 w-full bg-blue-300 rounded"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="h-[50px] hover:bg-[#001438] w-full bg-[#0E4194] text-white rounded"
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