import { useEffect, useState } from "react";
import InputDate from "../assets/styles/InputDate";
import Body from "../assets/styles/Body";
import Nav from "../assets/styles/Nav";
import { supabase } from "../services/supabase";
import InputRed from "../assets/styles/InputRed";
import { PlusIcon } from "lucide-react";

export default function AgendaUso() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [motivo, setMotivo] = useState("");
  const [arrumacao, setArrumacao] = useState("");
  const [data, setData] = useState("");

  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("09:00");

  const [diaInteiro, setDiaInteiro] = useState(false);
  const [turno, setTurno] = useState("manha");

  const [agendamentos, setAgendamentos] = useState([]);

  // 🔹 LISTA DE DATAS
  const [datasSelecionadas, setDatasSelecionadas] = useState([]);

  // 🔹 MODO DE HORÁRIO
  const [modoHorario, setModoHorario] = useState("igual");
  // "igual" | "diferente"

  // ===============================
  // BUSCAR AGENDAMENTOS
  // ===============================
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

  // ===============================
  // TURNOS
  // ===============================
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

  // ===============================
  // FORMATAÇÕES
  // ===============================
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
    return ["@fieb.org.br", "@fbest.org.br"].some((d) =>
      email.toLowerCase().endsWith(d)
    );
  }

  // ===============================
  // ➕ ADICIONAR DATA
  // ===============================
  function adicionarData() {
    if (!data) {
      alert("Selecione uma data");
      return;
    }

    if (modoHorario === "igual") {
      if (datasSelecionadas.includes(data)) {
        alert("Data já adicionada");
        return;
      }

      setDatasSelecionadas([...datasSelecionadas, data]);
    } else {
      const existe = datasSelecionadas.some((d) => d.data === data);
      if (existe) {
        alert("Data já adicionada");
        return;
      }

      setDatasSelecionadas([
        ...datasSelecionadas,
        {
          data,
          diaInteiro,
          turno,
          horaInicio,
          horaFim,
        },
      ]);
    }

    setData("");
  }

  function removerData(valor) {
    if (modoHorario === "igual") {
      setDatasSelecionadas(datasSelecionadas.filter((d) => d !== valor));
    } else {
      setDatasSelecionadas(datasSelecionadas.filter((d) => d.data !== valor));
    }
  }

  // ===============================
  // ENVIAR
  // ===============================
  async function enviar() {
    if (
      !nome ||
      !email ||
      !telefone ||
      !motivo ||
      !arrumacao ||
      datasSelecionadas.length === 0
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    if (!emailValido(email)) {
      alert("Email inválido");
      return;
    }

    const telefoneValido = /^\(\d{2}\) 9 \d{4}-\d{4}$/;
    if (!telefoneValido.test(telefone)) {
      alert("Telefone inválido");
      return;
    }

    // ===============================
    // 🔴 VALIDA CONFLITOS
    // ===============================
    for (const item of datasSelecionadas) {
      const d = modoHorario === "igual" ? item : item.data;
      const hi = modoHorario === "igual" ? horaInicio : item.horaInicio;
      const hf = modoHorario === "igual" ? horaFim : item.horaFim;
      const di = modoHorario === "igual" ? diaInteiro : item.diaInteiro;

      const conflito = agendamentos.some((ag) => {
        if (ag.data !== d) return false;
        if (ag.dia_inteiro || di) return true;
        return hi < ag.hora_fim && hf > ag.hora_inicio;
      });

      if (conflito) {
        alert(`❌ Conflito na data ${d.split("-").reverse().join("/")}`);
        return;
      }
    }

    // ===============================
    // INSERÇÃO
    // ===============================
    const inserts =
      modoHorario === "igual"
        ? datasSelecionadas.map((d) => ({
            tipo: "USUARIO",
            data: d,
            hora_inicio: diaInteiro ? "08:00" : horaInicio,
            hora_fim: diaInteiro ? "21:59" : horaFim,
            dia_inteiro: diaInteiro,
            motivo,
            status: "pendente",
            historico: {
              nome,
              email,
              telefone,
              arrumacaoSala: arrumacao,
              turno: diaInteiro ? "integral" : turno,
            },
          }))
        : datasSelecionadas.map((d) => ({
            tipo: "USUARIO",
            data: d.data,
            hora_inicio: d.diaInteiro ? "00:00" : d.horaInicio,
            hora_fim: d.diaInteiro ? "23:59" : d.horaFim,
            dia_inteiro: d.diaInteiro,
            motivo,
            status: "pendente",
            historico: {
              nome,
              email,
              telefone,
              arrumacaoSala: arrumacao,
              turno: d.diaInteiro ? "integral" : d.turno,
            },
          }));

    const { error } = await supabase.from("agendamentos").insert(inserts);

    if (error) {
      alert("Erro ao enviar solicitações");
      return;
    }

    alert("Solicitações enviadas!");

    setNome("");
    setEmail("");
    setTelefone("");
    setMotivo("");
    setArrumacao("");
    setDatasSelecionadas([]);
    setDiaInteiro(false);
    aplicarTurno("manha");

    carregarAgenda();
  }

  // ===============================
  // AGRUPA POR DATA
  // ===============================
  const agendaPorDia = agendamentos.reduce((acc, item) => {
    if (!acc[item.data]) acc[item.data] = [];
    acc[item.data].push(item);
    return acc;
  }, {});

  return (
    <Body>
      <Nav />

      <header className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1976d2] to-blue-800 md:h-64 px-6">
        <h1 className="text-2xl sm:text-3xl text-white font-bold text-center w-full">
          Solicitação de agendamento <br /> do Laboratório Maker
        </h1>
        <h2 className="text-lg sm:text-xl text-[#90adff] font-bold text-center w-full">
          * Restrito a colaboradores
        </h2>
      </header>

      <div className="flex flex-col lg:flex-row mt-10 mb-20 gap-20 px-4 w-full justify-center">
        {/* FORMULÁRIO */}
        <div className="md:w-[40%] w-full space-y-4">
          <InputRed
            title="Solicitante:"
            placeholder="Digite seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <InputRed
            title="Insira seu email:"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputRed
            title="Insira seu telefone:"
            placeholder="Insira seu número de telefone Ex.:(11) 9 91234-5678"
            value={telefone}
            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
          />

          <div className="flex flex-col gap-4 w-full">
            <label className="text-lg font-medium md:text-xl text-gray-700">
              Arrumação da sala:
            </label>
            <select
              className="input w-full text-lg h-[50px] px-3 bg-[#e5eeff]"
              value={arrumacao}
              onChange={(e) => setArrumacao(e.target.value)}
            >
              <option value="">Arrumação da sala</option>
              <option>Mesas em formato reunião</option>
              <option>Mesas em ilhas</option>
              <option>Mesa em U</option>
            </select>
          </div>

          {/* 🔘 MODO DE HORÁRIO */}
          <div className="flex  gap-2">
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

          <InputRed
            type="date"
            title="Data do agendamento:"
            min={new Date().toISOString().split("T")[0]}
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

         
          {/* DIA INTEIRO + TURNO */}
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
                        ? "bg-[#2756ac] text-white"
                        : "bg-[#e5eeff]"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <InputDate
              type="time"
              title="Hora Início:"
              min="08:00"
              max="21:00"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
            />
            <InputDate
              type="time"
              title="Hora Fim:"
              min="09:00"
              max="22:00"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
            />
          </div>
             <button
            type="button"
            onClick={adicionarData}
            className="bg-[#2756ac] flex gap-2 text-white items-center justify-center pr-4 pl-2 h-[45px] rounded text-lg"
          >
            <PlusIcon className="w-5 font-bold"/> Adicionar data à lista
          </button>

          {datasSelecionadas.length > 0 && (
            <div className="bg-white p-3 rounded shadow space-y-2">
              <h4 className="font-semibold">📋 Datas selecionadas</h4>

              {datasSelecionadas.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span>
                    {modoHorario === "igual"
                      ? item.split("-").reverse().join("/")
                      : `${item.data.split("-").reverse().join("/")} — ${
                          item.diaInteiro
                            ? "Dia inteiro"
                            : `${item.horaInicio}–${item.horaFim}`
                        }`}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removerData(
                        modoHorario === "igual" ? item : item.data
                      )
                    }
                    className="text-red-600"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}

          <InputRed
            type="text"
            title="Motivo da Solicitação:"
            className="input w-full resize-none text-lg h-[80px] px-3 pt-2 bg-[#e5eeff]"
            placeholder="Motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />

          <button
            onClick={enviar}
            className="bg-[#2756ac] text-white h-[50px] text-lg rounded w-full"
          >
            Enviar solicitação
          </button>
        </div>

        {/* AGENDA */}
        <aside className="md:w-[35%] w-full bg-[#f4f7ff] p-4 rounded shadow h-fit sticky top-6">
          <h3 className="text-xl font-bold mb-4">📅 Agenda ocupada</h3>

          {Object.entries(agendaPorDia).map(([dia, itens]) => (
            <div key={dia} className="mb-3 group">
              <div className="font-semibold text-blue-700 cursor-pointer">
                {dia.split("-").reverse().join("/")}
              </div>

              <div className="hidden group-hover:block ml-3 text-sm bg-white p-2 rounded shadow space-y-2">
                {itens.map((i, idx) => (
                  <div key={idx} className="border-b last:border-none pb-1">
                    <p>
                      ⏰ {i.hora_inicio} - {i.hora_fim}{" "}
                      {i.tipo === "ADMIN" ? "🔴 ADMIN" : "🟡 USUÁRIO"}
                    </p>
                    {i.historico?.nome && (
                      <p className="text-gray-700">
                        👤 <strong>{i.historico.nome}</strong>
                      </p>
                    )}
                    {i.motivo && (
                      <p className="text-gray-600 italic">📝 {i.motivo}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </Body>
  );
}
