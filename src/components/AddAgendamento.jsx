import { useEffect, useState } from "react";
import { AlarmClockPlus } from "lucide-react";
import { supabase } from "../services/supabase";

export default function AddAgendamento({ onAdd }) {
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("12:00");
  const [diaInteiro, setDiaInteiro] = useState(false);
  const [turno, setTurno] = useState("manha");
  const [motivo, setMotivo] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);

  // ===============================
  // BUSCAR AGENDAMENTOS
  // ===============================
  async function carregarAgenda() {
    const { data, error } = await supabase
      .from("agendamentos")
      .select("data, turno, dia_inteiro");

    if (!error) setAgendamentos(data || []);
  }

  useEffect(() => {
    carregarAgenda();
  }, []);

  // ===============================
  // TURNOS
  // ===============================
  function aplicarTurno(turnoSelecionado) {
    setTurno(turnoSelecionado);

    if (turnoSelecionado === "manha") {
      setHoraInicio("07:00");
      setHoraFim("12:00");
    }

    if (turnoSelecionado === "tarde") {
      setHoraInicio("13:00");
      setHoraFim("17:00");
    }

    if (turnoSelecionado === "noite") {
      setHoraInicio("18:00");
      setHoraFim("21:40");
    }
  }

  // ===============================
  // CONFLITO POR TURNO
  // ===============================
  function existeConflitoPorTurno(lista, data, turno, diaInteiro) {
    return lista.some((ag) => {
      if (ag.data !== data) return false;
      if (ag.dia_inteiro || diaInteiro) return true;
      return ag.turno === turno;
    });
  }

  // ===============================
  // SALVAR
  // ===============================
  async function salvar() {
    if (!data || !motivo) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    if (
      existeConflitoPorTurno(
        agendamentos,
        data,
        turno,
        diaInteiro
      )
    ) {
      alert("❌ Já existe agendamento para esse dia e turno");
      return;
    }

    const { error } = await supabase.from("agendamentos").insert({
      tipo: "ADMIN",
      data,
      hora_inicio: diaInteiro ? "00:00" : horaInicio,
      hora_fim: diaInteiro ? "23:59" : horaFim,
      dia_inteiro: diaInteiro,
      turno: diaInteiro ? "integral" : turno,
      motivo,
      status: "ocupado",
    });

    if (error) {
      console.error(error);
      alert("Erro ao salvar agendamento");
      return;
    }

    onAdd();
    carregarAgenda();

    setData("");
    setHoraInicio("08:00");
    setHoraFim("12:00");
    setDiaInteiro(false);
    setTurno("manha");
    setMotivo("");
  }

  return (
    <div className="bg-white p-4 md:w-[50%] w-full rounded-xl shadow space-y-4">
      <h2 className="text-lg md:text-xl font-semibold flex gap-2 items-center">
        <AlarmClockPlus /> Bloquear laboratório
      </h2>

      <input
        type="date"
        className="w-full h-[50px] px-3 text-lg md:text-xl bg-[#e5eeff] focus:outline-none focus:ring-1"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div className="flex flex-wrap items-center gap-4 text-lg">
        <label className="flex items-center gap-2">
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

      {!diaInteiro && (
        <div className="flex gap-2">
          <input
            type="time"
            className="w-full h-[50px] px-3 text-lg bg-[#e5eeff] focus:outline-none"
            value={horaInicio}
            readOnly
          />
          <input
            type="time"
            className="w-full h-[50px] px-3 text-lg bg-[#e5eeff] focus:outline-none"
            value={horaFim}
            readOnly
          />
        </div>
      )}

      <div>
        <label className="text-lg md:text-xl">
          Insira o motivo da ocupação
        </label>
        <textarea
          placeholder="Motivo da ocupação"
          className="w-full p-2 text-lg bg-[#e5eeff] focus:outline-none focus:ring-1"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </div>

      <button
        onClick={salvar}
        className="w-full bg-[#2756ac] text-white text-lg md:text-xl h-[50px] rounded"
      >
        Bloquear
      </button>
    </div>
  );
}
