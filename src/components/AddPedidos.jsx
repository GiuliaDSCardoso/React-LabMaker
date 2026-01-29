import { useState } from "react";
import { supabase } from "../services/supabase";
import InputRed from "../assets/styles/InputRed";
import InputNO from "../assets/styles/InputNO.jsx";


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
  const [is_completed, setIsCompleted] = useState(false);
  const [error, setError] = useState(""); // <-- mensagem de erro
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
  function prazoMenorQue10Dias(dataEntrega) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(dataEntrega);
    dataSelecionada.setHours(0, 0, 0, 0);
    const diffEmDias = (dataSelecionada - hoje) / (1000 * 60 * 60 * 24);
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

  // Validação de email
  function emailValido(email) {
    const dominiosPermitidos = ["@gmail.com", "@fieb.org.br","@ba.estudante.senai.br", "@fbest.org.br"];
    return dominiosPermitidos.some((dominio) =>
      email.toLowerCase().endsWith(dominio)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validação de campos obrigatórios
    if (
      !solicitante ||
      !email ||
      !contato ||
      !cargo ||
      !enviarArquivo ||
      !dataEntrega ||
      !material ||
      !detalhe
    ) {
      setError("Preencha todos os campos!");
      return;
    }

    // Validação do email
    if (!emailValido(email)) {
      alert(
        "Use um email válido: @gmail.com, @ba.estudante.senai.br, @fieb.org.br ou @fbest.org.br"
      );
      return;
    }
    const telefoneValido = /^\(\d{2}\) 9 \d{4}-\d{4}$/;

    if (!telefoneValido.test(contato)) {
      setError("⚠️ Informe um telefone válido no formato (DDD) 9 XXXX-XXXX");
      return;
    }

    // Validação de prazo mínimo
    if (prazoMenorQue10Dias(dataEntrega)) {
      setError("⚠️ Prazo mínimo de 10 dias.");
      return;
    }

    const arquivoBase64 = await fileToBase64(enviarArquivo);

    const { error: insertError } = await supabase.from("pedidos").insert([
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
        arquivo: arquivoBase64,
        is_completed: false,
        historico: [
          {
            data: new Date().toLocaleString("pt-BR"),
            acao: "Solicitação criada",
          },
        ],
      },
    ]);

    if (insertError) {
      console.error(insertError);
      alert("Erro ao enviar pedido");
      return;
    }

    alert("✅ Pedido enviado com sucesso!");

    // Resetar campos
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
    <div className="flex flex-col items-center justify-center mb-20 gap-6 px-4 w-full">
      {error && (
        <p className="text-red-600 text-center text-lg font-medium">{error}</p>
      )}

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {/* COLUNA ESQUERDA */}
        <div className="w-full flex flex-col gap-4">
          <InputRed
            id="solicitante"
            title="Solicitante:"
            value={solicitante}
            disabled={is_completed}
            placeholder="Insira o seu nome completo"
            onChange={(e) => setSolicitante(e.target.value)}
          />

          <div className="flex flex-col gap-4 justify-center">
            <label className="text-lg md:text-xl font-medium text-gray-700 flex gap-1">
              Material de confecção:
              <span className="relative group cursor-help text-red-600">*</span>
            </label>
            <select
              value={material}
              disabled={is_completed}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-[100%] placeholder:text-[#000000] md:w-full h-[50px] px-3  bg-[#e5eeff] outline-none text-lg focus:ring-1 focus:ring-[#4c82e6]"
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
            disabled={is_completed}
            placeholder="Insira o seu email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputNO
            id="cursoETurma"
            title="Curso&Turma/Setor:"
            value={cursoETurma}
            disabled={is_completed}
            placeholder="Insira seu curso e turma ou o seu setor"
            onChange={(e) => setCursoETurma(e.target.value)}
          />

          <InputRed
            id="contato"
            title="Telefone:"
            value={contato}
            placeholder="Use esse formato ex: (11)912345678"
            disabled={is_completed}
            onChange={(e) => setContato(formatarTelefone(e.target.value))}
          />
        </div>

        {/* COLUNA DIREITA */}
        <div className="w-full flex flex-col gap-4">
          <InputNO
            id="sobreProjeto"
            title="Descreva o projeto:"
            value={sobreProjeto}
            disabled={is_completed}
            placeholder="Descreva o seu projeto"
            onChange={(e) => setSobreProjeto(e.target.value)}
          />

          <div className="flex flex-col gap-4">
            <label className="text-lg md:text-xl font-medium text-gray-700 flex gap-1">
              Cargo:
              <span className="relative group cursor-help text-red-600">
        *
        <span
          className="
            absolute left-1/2 -translate-x-1/2 top-6
            hidden group-hover:block
            bg-black text-white text-xs md:text-sm
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
              disabled={is_completed}
              onChange={(e) => setCargo(e.target.value)}
              className="w-[100%] md:w-full h-[50px] focus:ring-1 focus:ring-[#4c82e6] placeholder:text-[#000000] text-lg bg-[#e5eeff]"
            >
              <option value="">Selecione um cargo</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Aluno">Aluno</option>
              <option value="Docente">Docente</option>
            </select>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-lg md:text-xl font-medium text-gray-700 flex gap-1">
              Arquivo do projeto (Envie uma imagem do protótipo):
             <span className="relative group cursor-help text-red-600">
        *
        <span
          className="
            absolute left-1/2 -translate-x-1/2 top-6
            hidden group-hover:block
            bg-black text-white text-xs md:text-sm
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
              disabled={is_completed}
              onChange={(e) => setEnviarArquivo(e.target.files[0])}
              className="w-[100%] md:w-full h-[50px] placeholder:text-[#000000] text-lg bg-[#e5eeff] file:mr-4 file:py-3 file:px-4 file:bg-[#0062c4] file:border-none file:text-white"
            />
          </div>

          <InputRed
            type="date"
            title="Data de Entrega (prazo mínimo 10 dias úteis):"
            value={dataEntrega}
            disabled={is_completed}
            onChange={(e) => setDataEntrega(e.target.value)}
          />

          <InputRed
            id="componente"
            title="Detalhe sobre o pedido:"
            value={detalhe}
            disabled={is_completed}
            placeholder="Cor amarela, tamanho 30x30cm"
            onChange={(e) => setDetalhe(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={is_completed}
        className="h-[50px] w-[100%] md:w-[500px] mt-4 bg-[#0062c4] text-white text-lg md:text-xl rounded"
      >
        Enviar Solicitação
      </button>
    </div>
  );
}
