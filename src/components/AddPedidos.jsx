
import { useEffect, useState} from "react";
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

  // 🔥 ALTERADO: agora é lista
  const [arquivos, setArquivos] = useState([]);

  const [dataEntrega, setDataEntrega] = useState(null);
  const [material, setMaterial] = useState("");
  const [sobreProjeto, setSobreProjeto] = useState("");
  const [detalhe, setDetalhe] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.signOut();
  }, []);

 

 

  function formatarTelefone(valor) {
    let numero = valor.replace(/\D/g, "").slice(0, 11);

    if (numero.length === 0) return "";
    if (numero.length < 3) return `(${numero}`;
    if (numero.length < 4) return `(${numero.slice(0, 2)}) ${numero.slice(2)}`;
    if (numero.length < 8)
      return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(3)}`;

    return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(
      3,
      7
    )}-${numero.slice(7)}`;
  }

  function textoValido(texto) {
    const regex = /^[A-Za-zÀ-ÿ0-9\s]+$/;
    return regex.test(texto);
  }

  function validarStep1() {
    const newErrors = {};

    if (!solicitante) newErrors.solicitante = "Informe o nome completo.";
    else if (solicitante.trim().length < 8)
      newErrors.solicitante = "Insira seu nome completo.";
    else if (!textoValido(solicitante))
      newErrors.solicitante = "O nome não pode conter caracteres especiais.";

    if (!email) newErrors.email = "Informe o email.";

    if (!cursoETurma)
      newErrors.cursoETurma = "Informe curso/turma ou setor.";
    else if (!textoValido(cursoETurma))
      newErrors.cursoETurma =
        "Curso/Turma não pode conter caracteres especiais.";

    if (!contato) newErrors.contato = "Informe o telefone.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validarFormulario() {
    const newErrors = {};

    if (!cargo) newErrors.cargo = "Informe o seu Cargo.";
    if (!material) newErrors.material = "Informe o Material.";
    if (!sobreProjeto) newErrors.sobreProjeto = "Descreva o projeto.";
    if (!detalhe) newErrors.detalhe = "Informe detalhes do pedido.";

    if (!dataEntrega) {
      newErrors.dataEntrega = "Informe a data de entrega.";
    } else {
      const hojeMais10 = new Date();
      hojeMais10.setDate(hojeMais10.getDate() + 20);

      if (dataEntrega < hojeMais10) {
        newErrors.dataEntrega =
          "A data deve ser pelo menos 20 dias a partir de hoje, não aceitamos pedidos fora desse prazo mínimo.";
      }
    }

    // 🔥 ALTERADO
    if (arquivos.length === 0)
      newErrors.enviarArquivo = "Anexe ao menos um arquivo.";

    if (cargo === "Administrativo" && !centroDeCusto) {
      newErrors.centroDeCusto = "Informe o Centro de Custo.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validarFormulario()) return;

    setIsSubmitting(true);

    try {
      const urlsArquivos = [];

      // 🔥 upload múltiplo
      for (const arquivo of arquivos) {
        const filePath = `${Date.now()}-${arquivo.name.replace(
          /[^a-zA-Z0-9.-]/g,
          "_"
        )}`;

        const { error: uploadError } = await supabase.storage
          .from("pedidos")
          .upload(filePath, arquivo, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          setErrors({ supabase: uploadError.message });
          setIsSubmitting(false);
          return;
        }

        const { data } = supabase.storage
          .from("pedidos")
          .getPublicUrl(filePath);

        urlsArquivos.push(data.publicUrl);
      }

      const { error } = await supabase.from("pedidos").insert([
        {
          solicitante,
          email,
          curso_turma: cursoETurma || "",
          contato,
          cargo: cargo || "",
          centro_custo:
            cargo === "Administrativo" ? centroDeCusto || "" : "",
          material,
          sobre_projeto: sobreProjeto || "",
          detalhe,
          data_entrega: dataEntrega
            ? dataEntrega.toISOString().split("T")[0]
            : null,
          
          // 🔥 CORREÇÃO AQUI: Envie o array puro, sem JSON.stringify
          arquivos: urlsArquivos, 

          is_completed: false,
          historico: [
            {
              acao: "Solicitação criada",
              data: new Date().toLocaleString("pt-BR"),
            },
          ],
        },
      ]);

      if (error) {
        setErrors({ supabase: "Erro ao salvar pedido." });
        setIsSubmitting(false);
        return;
      }

      alert("✅ Pedido enviado com sucesso!");

      setStep(1);
      setSolicitante("");
      setEmail("");
      setCursoETurma("");
      setContato("");
      setCentroDeCusto("");
      setCargo("");
      setMaterial("");
      setSobreProjeto("");
      setDetalhe("");
      setDataEntrega(null);
      setArquivos([]); // 🔥 reset
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors({ supabase: "Erro inesperado." });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (cargo !== "Administrativo") setCentroDeCusto("");
  }, [cargo]);

  const hoje = new Date();
  const dataMinima = new Date();
  dataMinima.setDate(hoje.getDate() + 10);

  return (
   <div className="flex flex-col  max-w-6xl mx-auto mt-5  md:px-24 items-center w-full px-4 mb-20">
      <form className="flex flex-col gap-6 w-full ">

        {/* ===== ETAPA 1 ===== */}
        {step === 1 && (
          <div className="flex flex-col gap-6">

            <div className="flex flex-col lg:flex-row gap-6 w-full">

              <div className="w-full flex flex-col gap-4">
                <InputRed
                  title="Solicitante:"
                  value={solicitante}
                  placeholder="Informe seu nome completo"
                  onChange={(e) => {
                    const valor = e.target.value;

                    if (/^[A-Za-zÀ-ÿ\s]*$/.test(valor)) {
                      setSolicitante(valor);
                    }
                  }}
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
                  onChange={(e) => {
                    const valor = e.target.value;

                    if (/^[A-Za-zÀ-ÿ0-9\s]*$/.test(valor)) {
                      setCursoETurma(valor);
                    }
                  }}
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
                  title="Materiais Disponíveis:"
                  value={material}
                  onChange={(e) =>
                    setMaterial(e.target.value)
                  }
                  options={[
                    "Impressão 3D",
                    "Acrílico 2mm",
                    "Acrílico 3mm",
                    "Acrílico 4mm",
                    "Acrílico 6mm",
                    "Acrílico 8mm",
                    "Outro Material (especificar em Detalhe do pedido)",
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
               <>
                {/* Dentro do AddPedidos.jsx */}
                  <InputFile
                    title="Anexar arquivos"
                    accept=".dxf,.png,.gcode,.3mf,.svg,.pdf,.stl,.mp4,.mp3,.jpg,.jpeg, .pwj5"
                    files={arquivos} // Passa a lista atual
                    onChange={setArquivos} // Atualiza a lista completa de uma vez
                    error={errors.enviarArquivo}
                  />



               
              </>

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
                className="h-[50px] hover:bg-blue-500 w-full text-white bg-blue-400 rounded"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`h-[50px] w-full rounded text-white ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0E4194] hover:bg-[#001438]"
                }`}
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
            </div>
            <h1 className="text-md text-justify text-red-600 ">
              *Aguarde a confirmação da página antes de enviar uma nova Solicitação
            </h1>
          </div>
        )}
      </form>
    </div>
  );
}
