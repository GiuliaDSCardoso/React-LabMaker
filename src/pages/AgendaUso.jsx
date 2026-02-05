import { useEffect, useState } from "react";
import InputDate from "../assets/styles/InputDate";
import Body from "../assets/styles/Body";
import Nav from "../assets/styles/Nav";
import { supabase } from "../services/supabase";
import InputRed from "../assets/styles/InputRed";

export default function AgendaUso() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [motivo, setMotivo] = useState("");
  const [arrumacao, setArrumacao] = useState("");
  const [data, setData] = useState("");

  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("09:00");

  // 🔹 NOVOS ESTADOS
  const [diaInteiro, setDiaInteiro] = useState(false);
  const [turno, setTurno] = useState("manha");

  const [agendamentos, setAgendamentos] = useState([]);

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
  // TURNOS (SEM MEXER NOS INPUTS)
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
  // ENVIAR
  // ===============================
  async function enviar() {
    if (!nome || !email || !telefone || !motivo || !arrumacao || !data) {
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
    // 🚫 CONFLITO
    // ===============================
    const conflitos = agendamentos.filter((ag) => {
      if (ag.data !== data) return false;
      if (ag.dia_inteiro) return true;

      if (diaInteiro) return true;

      return horaInicio < ag.hora_fim && horaFim > ag.hora_inicio;
    });

    if (conflitos.length > 0) {
      alert("❌ Dia ou horário ocupado");
      return;
    }

    // ===============================
    // INSERÇÃO
    // ===============================
    const { error } = await supabase.from("agendamentos").insert({
      tipo: "USUARIO",
      data,
      hora_inicio: diaInteiro ? "00:00" : horaInicio,
      hora_fim: diaInteiro ? "23:59" : horaFim,
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
    });

    if (error) {
      alert("Erro ao enviar solicitação");
      return;
    }

    alert("Solicitação enviada!");

    setNome("");
    setEmail("");
    setTelefone("");
    setMotivo("");
    setArrumacao("");
    setData("");
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
          {/* 🔒 TODOS OS INPUTS ABAIXO ESTÃO IGUAIS */}
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

          <InputRed
            type="date"
            title="Data do agendamento:"
            min={new Date().toISOString().split("T")[0]}
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          {/* 🔹 BLOCO NOVO (SEM MEXER NOS INPUTS EXISTENTES) */}
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

          {/* ⏰ INPUTS ORIGINAIS DE HORA (NÃO MEXIDOS) */}
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
                 <div key={idx} className="border-b last:border-none pb-1" > <p> ⏰ {i.hora_inicio} - {i.hora_fim}{" "} 
                 {i.tipo === "ADMIN" ? "🔴 ADMIN" : "🟡 USUÁRIO"} </p> 
                 {i.historico?.nome && ( <p className="text-gray-700"> 👤 <strong>{i.historico.nome}</strong> </p> )}
                  {i.motivo && ( <p className="text-gray-600 italic"> 📝 {i.motivo} </p> )} </div>
                ))}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </Body>
  );
}
