import { useEffect, useState , useRef} from "react";
import InputDate from "../assets/styles/InputDate";
import Body from "../assets/styles/Body";
import { supabase } from "../services/supabase";
import InputRed from "../assets/styles/InputRed";
import CalendarAgenda from "../components/CalendarAgenda";
import { PlusIcon } from "lucide-react";
import MenuLateral from "../assets/styles/MenuLateral";
import Header from "../assets/styles/Header";
import InputSelect from "../assets/styles/InputSelect";
import DatePickerInput from "../assets/styles/DatePickerInput";
import emailjs from "@emailjs/browser";


export default function AgendaUso() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [motivo, setMotivo] = useState("");
  const [arrumacao, setArrumacao] = useState("");
  const [data, setData] = useState(null);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("09:00");
  const [diaInteiro, setDiaInteiro] = useState(false);
  const [turno, setTurno] = useState("manha");
  const [agendamentos, setAgendamentos] = useState([]);
  const [turma, setTurma] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [step, setStep] = useState(1);
  const [datasSelecionadas, setDatasSelecionadas] = useState([]);
  const [modoHorario, setModoHorario] = useState("igual");
  const [errors, setErrors] = useState({});
  const [enviando, setEnviando] = useState(false);

  const datasRef = useRef(datasSelecionadas);

  useEffect(() => {
    datasRef.current = datasSelecionadas;
  }, [datasSelecionadas]);

 useEffect(() => {
  if (datasRef.current.length > 0) {
    const confirmar = window.confirm(
      "Ao trocar o modo de horário, as datas adicionadas serão removidas. Deseja continuar?"
    );

    if (!confirmar) return;
  }

  setDatasSelecionadas([]);
}, [modoHorario]);

 useEffect(() => {
  supabase.auth.signOut(); // desloga sempre que acessar página pública
}, []);

  useEffect(() => {
    if (diaInteiro) {
      setHoraInicio("00:00");
      setHoraFim("23:59");
    } else {
      aplicarTurno(turno);
    }
  }, [diaInteiro, turno]);

  function horaParaMinutos(hora) {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  }

  function dataEhPassada(date) {
    if (!date) return true;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(date);
    dataSelecionada.setHours(0, 0, 0, 0);
    return dataSelecionada < hoje;
  }

  function turmaValida(valor) {
    const regex = /^[A-Za-z0-9\s-]+$/;
    return regex.test(valor);
  }

  function precisaResponsavel(email) {
    return email.toLowerCase().endsWith("@ba.estudante.senai.br");
  }

  async function carregarAgenda() {
    const { data, error } = await supabase
      .from("agendamentos")
      .select("*")
      .order("data", { ascending: true });

    if (!error) setAgendamentos(data || []);
  }

  useEffect(() => {
    carregarAgenda();
  }, []);

  function aplicarTurno(t) {
    setTurno(t);
    if (t === "manha") {
      setHoraInicio("07:00");
      setHoraFim("12:00");
    }
    if (t === "tarde") {
      setHoraInicio("13:00");
      setHoraFim("17:00");
    }
    if (t === "noite") {
      setHoraInicio("18:00");
      setHoraFim("21:40");
    }
  }
function horarioConflita(data, inicio, fim, diaInteiro) {
  const inicioNovo = horaParaMinutos(inicio);
  const fimNovo = horaParaMinutos(fim);

  return agendamentos.some((ag) => {

    if (ag.data !== data) return false;

    if (ag.dia_inteiro || diaInteiro) return true;

    const inicioExistente = horaParaMinutos(ag.hora_inicio || "08:00");
    const fimExistente = horaParaMinutos(ag.hora_fim || "21:59");

    return inicioNovo < fimExistente && fimNovo > inicioExistente;
  });
}

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
    return ["@ba.estudante.senai.br","@fieb.org.br", "@fbest.org.br"].some((d) =>
      email.toLowerCase().endsWith(d)
    );
  }
  function nomeValido(nome) {
    const regex = /^[A-Za-zÀ-ÿ\s]+$/;
    return regex.test(nome);
  }

  function motivoValido(texto) {
    const regex = /^[A-Za-zÀ-ÿ0-9\s.,-]+$/;
    return regex.test(texto);
  }

 function formatarDataBr(date) {
  if (!date) return "";

  // se vier como string do banco (YYYY-MM-DD)
  if (typeof date === "string") {
    const [ano, mes, dia] = date.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  // se vier como objeto Date
  if (date instanceof Date) {
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  return "";
}

  function adicionarData() {
    const newErrors = {};

    if (!data) newErrors.data = "Selecione uma data.";
    else if (dataEhPassada(data)) newErrors.data = "Não é permitido agendar para datas anteriores.";

    // Checa duplicidade
    if (modoHorario === "igual") {
      const existe = datasSelecionadas.some(
        (d) => new Date(d).getTime() === new Date(data).getTime()
      );
      if (existe) newErrors.data = "Data já adicionada.";
    } else {
      const existe = datasSelecionadas.some(
        (d) => d.data.getTime() === data.getTime()
      );
      if (existe) newErrors.data = "Data já adicionada.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (modoHorario === "igual") {
      setDatasSelecionadas([...datasSelecionadas, new Date(data)]);
    } else {
      setDatasSelecionadas([
        ...datasSelecionadas,
        { data: new Date(data), diaInteiro, turno, horaInicio, horaFim },
      ]);
    }

    setData(null);
  }

  function removerData(valor) {
    if (modoHorario === "igual") {
      setDatasSelecionadas(
        datasSelecionadas.filter((d) => d.getTime() !== new Date(valor).getTime())
      );
    } else {
      setDatasSelecionadas(
        datasSelecionadas.filter((d) => d.data.getTime() !== new Date(valor).getTime())
      );
    }
  }

  async function enviar() {

  if (enviando) return;
  setEnviando(true);

  const newErrors = {};

  if (!nome) {
    newErrors.nome = "Informe seu nome.";
  } else if (!nomeValido(nome)) {
    newErrors.nome = "O nome não pode conter caracteres especiais.";
  }
  if (!email) newErrors.email = "Informe seu email.";
  if (!telefone) newErrors.telefone = "Informe seu telefone.";
  if (!motivo) {
      newErrors.motivo = "Informe o motivo.";
    } else if (!motivoValido(motivo)) {
      newErrors.motivo = "O motivo contém caracteres inválidos.";
    }
  if (!arrumacao) newErrors.arrumacao = "Selecione a arrumação.";
  if (datasSelecionadas.length === 0)
    newErrors.datas = "Adicione ao menos uma data.";

  if (email && !emailValido(email))
    newErrors.email = "Usuário não credenciado.";

  const telefoneRegex = /^\(\d{2}\) 9 \d{4}-\d{4}$/;
  if (telefone && !telefoneRegex.test(telefone))
    newErrors.telefone = "Telefone inválido.";

  // valida horário
  if (!diaInteiro && horaInicio >= horaFim) {
    newErrors.horaFim =
      "O horário de término deve ser depois do horário de início.";
  }
  if (precisaResponsavel(email) && !responsavel) {
    newErrors.responsavel =
    "Informe o responsável que acompanhará.";
}

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setEnviando(false);
    return;
  }

  setErrors({});

  // checar conflitos antes de salvar
  for (const item of datasSelecionadas) {

    const dataCheck =
      modoHorario === "igual"
        ? item.toISOString().split("T")[0]
        : item.data.toISOString().split("T")[0];

    const inicioCheck =
      modoHorario === "igual" ? horaInicio : item.horaInicio;

    const fimCheck =
      modoHorario === "igual" ? horaFim : item.horaFim;

    const diaInteiroCheck =
      modoHorario === "igual" ? diaInteiro : item.diaInteiro;

    if (horarioConflita(dataCheck, inicioCheck, fimCheck, diaInteiroCheck)) {
      setErrors({
        datas: `A data ${formatarDataBr(
          dataCheck
        )} já possui um agendamento neste horário.`,
      });

      setEnviando(false);
      return;
    }
  }

  const novosRegistros = datasSelecionadas.map((item) => ({
    nome,
    email,
    telefone,
    motivo,
    arrumacao,
    turma,
    responsavel: precisaResponsavel(email)
      ? responsavel
      : null,
    turno,
    tipo: "USUÁRIO",
    status: "pendente",
    historico: [],
    data:
      modoHorario === "igual"
        ? item.toISOString().split("T")[0]
        : item.data.toISOString().split("T")[0],
    hora_inicio:
      modoHorario === "igual" ? horaInicio : item.horaInicio,
    hora_fim:
      modoHorario === "igual" ? horaFim : item.horaFim,
    dia_inteiro:
      modoHorario === "igual" ? diaInteiro : item.diaInteiro,
  }));

  const { error } = await supabase
    .from("agendamentos")
    .insert(novosRegistros);

  if (error) {
    alert("Erro ao salvar: " + error.message);
    setEnviando(false);
    return;
  }

  const datasFormatadas = datasSelecionadas
    .map((item) => {
      const d = modoHorario === "igual" ? item : item.data;

      return `${formatarDataBr(d)} - ${
        modoHorario === "igual"
          ? diaInteiro
            ? "Dia inteiro"
            : `${horaInicio} às ${horaFim}`
          : item.diaInteiro
          ? "Dia inteiro"
          : `${item.horaInicio} às ${item.horaFim}`
      }`;
    })
    .join("\n");

  try {
    await emailjs.send(
    "service_seiz71a",
    "template_va5k0hr",
    {
      nome,
      email,
      telefone,
      turma,
      responsavel,
      arrumacao,
      motivo,
      datas: datasFormatadas,
    },
    "SZWf2utdw8nJQKtjZ"
  );

    alert("Solicitação enviada com sucesso!");
  } catch (err) {
    alert("Erro ao enviar email.");
    console.error(err);
  }

  // resetar formulário
  setNome("");
  setEmail("");
  setTelefone("");
  setMotivo("");
  setArrumacao("");
  setDatasSelecionadas([]);
  setDiaInteiro(false);
  aplicarTurno("manha");

  setEnviando(false);
  setStep(1);
}

  function validarEtapa1() {
    const newErrors = {};

    if (!nome) {
      newErrors.nome = "Informe seu nome.";
    } else if (!nomeValido(nome)) {
      newErrors.nome = "O nome não pode conter caracteres especiais.";
    }
    if (!email) newErrors.email = "Informe seu email.";
    if (!telefone) newErrors.telefone = "Informe seu telefone.";
    if (!arrumacao) newErrors.arrumacao = "Selecione a arrumação.";

    if (email && !emailValido(email))
      newErrors.email = "Email inválido.";
    if (!turma) {
      newErrors.turma = "Informe o código da turma.";
    } else if (!turmaValida(turma)) {
      newErrors.turma = "Código da turma inválido.";
    }
    const telefoneRegex = /^\(\d{2}\) 9 \d{4}-\d{4}$/;
    if (telefone && !telefoneRegex.test(telefone))
      newErrors.telefone = "Telefone inválido.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  return (
    <Body>
      <MenuLateral />
      <Header
        title="Agendamento do Laboratório Maker"
        descricao="* Restrito a colaboradores"
      />

      <div className="flex flex-col lg:flex-row md:flex-col  mt-16 mb-20 gap-20 px-4 w-full max-w-6xl mx-auto justify-center">

        <div className="md:w-[40%] w-full space-y-4">
          {step === 1 && (
            <>
              <InputRed
                title="Solicitante:"
                placeholder="Digite seu nome completo"
                value={nome}
                error={errors.nome}
                onChange={(e) => {
                  const valor = e.target.value;

                  if (/^[A-Za-zÀ-ÿ\s]*$/.test(valor)) {
                    setNome(valor);
                  }
                }}
              />
              <InputRed
                title="Insira seu email:"
                placeholder="Digite seu email institucional"
                value={email}
                error={errors.email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputRed
                title="Insira seu telefone:"
                placeholder="Insira o seu telefone Ex.: (DDD) 9 00000000"
                value={telefone}
                error={errors.telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              />
              <InputRed
                  title="Código da turma:"
                  placeholder="Ex.: DS3M24"
                  value={turma}
                  error={errors.turma}
                  onChange={(e) => {
                    const valor = e.target.value;

                    if (/^[A-Za-z0-9\s-]*$/.test(valor)) {
                      setTurma(valor.toUpperCase());
                    }
                  }}
                />
              <InputSelect
                title="Arrumação da sala:"
                value={arrumacao}
                onChange={(e) => setArrumacao(e.target.value)}
                placeholder="Arrumação da sala"
                error={errors.arrumacao}
                options={[
                  "Mesas em formato reunião",
                  "Mesas em ilhas",
                  "Mesa em U",
                ]}
              />
              <button
                type="button"
                onClick={() => {
                  if (validarEtapa1()) setStep(2);
                }}
                className="bg-[#2756ac] hover:bg-[#001438] text-white h-[50px] text-lg rounded w-full"
              >
                Próximo
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={modoHorario === "igual"}
                    onChange={() => setModoHorario("igual")}
                  />
                  Mesmo horário para todas as datas
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={modoHorario === "diferente"}
                    onChange={() => setModoHorario("diferente")}
                  />
                  Horários diferentes por data
                </label>
              </div>

              <DatePickerInput
                title="Data do agendamento:"
                selected={data}
                placeholder="Toque para selecionar"
                onChange={(date) => setData(date)}
                minDate={new Date()}
                error={errors.datas && (
                <p className="text-red-500 text-sm">{errors.datas}</p>
              )}
              />

             

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-lg">
                  <input
                    type="checkbox"
                    checked={diaInteiro}
                    onChange={(e) => setDiaInteiro(e.target.checked)}
                  />
                  Dia inteiro
                </label>

                {!diaInteiro && (
                  <div className="flex gap-2">
                    {["manha", "tarde", "noite"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => aplicarTurno(t)}
                        className={`px-3 py-1 rounded ${
                          turno === t
                            ? "bg-[#2756ac] text-white dark:bg-[#001438]"
                            : "bg-[#e5eeff] dark:bg-[#001438]/40"
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {!diaInteiro &&(
              <div className="flex gap-2">
                <InputDate
                  type="time"
                  title="Hora Início:"
                  min="08:00"
                  max="21:00"
                  error={errors.horaInicio}
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
                <InputDate
                  type="time"
                  title="Hora Fim:"
                  min="09:00"
                  max="22:00"
                  error={errors.horaFim}
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </div>
              )}

              <button
                type="button"
                onClick={adicionarData}
                className="bg-[#2756ac] hover:bg-[#001438] flex gap-2 text-white items-center w-full justify-center pr-4 pl-2 h-[45px] rounded text-lg"
              >
                <PlusIcon className="w-5 font-bold" />
                Adicionar data à lista
              </button>

              {datasSelecionadas.length > 0 && (
                <div className="bg-white dark:bg-textColor p-3 rounded shadow space-y-2">
                  <h4 className="font-semibold">📋 Datas selecionadas</h4>

                  {datasSelecionadas.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b pb-1"
                    >
                      <span>
                        {modoHorario === "igual"
                          ? formatarDataBr(item) + (diaInteiro ? " — Dia inteiro" : ` — ${horaInicio}–${horaFim}`)
                          : `${formatarDataBr(item.data)} — ${
                              item.diaInteiro
                                ? "Dia inteiro"
                                : `${item.horaInicio}–${item.horaFim}`
                            }`}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removerData(modoHorario === "igual" ? item : item.data)
                        }
                        className="text-red-600"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {precisaResponsavel(email) && (
                <InputRed
                  title="Nome do responsável acompanhante:"
                  placeholder="Digite o nome do responsável"
                  value={responsavel}
                  error={errors.responsavel}
                  onChange={(e) => {
                    const valor = e.target.value;

                    if (/^[A-Za-zÀ-ÿ\s]*$/.test(valor)) {
                      setResponsavel(valor);
                    }
                  }}
                />
              )}
              <InputRed
                type="text"
                title="Motivo da Solicitação:"
                className="input w-full resize-none text-lg h-[80px] px-3 pt-2 bg-[#e5eeff]"
                placeholder="Motivo"
                value={motivo}
                error={errors.motivo}
                onChange={(e) => {
                  const valor = e.target.value;

                  if (/^[A-Za-zÀ-ÿ0-9\s.,-]*$/.test(valor)) {
                    setMotivo(valor);
                  }
                }}
              />

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-[50px] hover:bg-blue-500 w-full text-white bg-blue-400 rounded">              
                  Voltar
                </button>

                <button
                  onClick={enviar}
                  disabled={enviando}
                  className="bg-[#2756ac] hover:bg-[#001438] text-white h-[50px] text-lg rounded w-full"
                >
                  {enviando ? "Enviando..." : "Enviar solicitação"}
                </button>
              </div>
              <h1 className="text-md text-red-600 ">
                  *Aguarde a confirmação da página antes de enviar uma nova Solicitação, após o envio, recarregue a página para atualizar o calendário
                </h1>
            </>
          )}
        </div>

        <aside className="lg:w-[40%]  justify-center w-full p-2 rounded-xl h-fit sticky top-6">
          <CalendarAgenda agendamentos={agendamentos} />
        </aside>
      </div>
    </Body>
  );
}