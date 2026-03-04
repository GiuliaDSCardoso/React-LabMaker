import { useEffect, useState } from "react";
import { AlarmClockPlus } from "lucide-react";
import { supabase } from "../services/supabase";

import DatePickerInput from "../assets/styles/DatePickerInput";
import InputDate from "../assets/styles/InputDate";
import InputRed from "../assets/styles/InputRed";

export default function AddAgendamento({ onAdd }) {
  const [data, setData] = useState(null);
  const [horaInicio, setHoraInicio] = useState("07:00");
  const [horaFim, setHoraFim] = useState("12:00");
  const [diaInteiro, setDiaInteiro] = useState(false);
  const [turno, setTurno] = useState("manha");
  const [motivo, setMotivo] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [errors, setErrors] = useState({});

  async function carregarAgenda() {
    const { data, error } = await supabase
      .from("agendamentos")
      .select("data, turno, dia_inteiro");

    if (!error) setAgendamentos(data || []);
  }

  useEffect(() => {
    carregarAgenda();
  }, []);

  function formatarDataParaISO(date) {
    if (!date) return null;
    const d = new Date(date);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

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

  function existeConflito(lista, dataISO, turno, diaInteiro) {
    return lista.some((ag) => {
      if (ag.data !== dataISO) return false;
      if (ag.dia_inteiro || diaInteiro) return true;
      return ag.turno === turno;
    });
  }

  async function salvar() {
    const dataISO = formatarDataParaISO(data);
    let novosErros = {};

    if (!dataISO) novosErros.data = "Selecione uma data";
    if (!motivo.trim()) novosErros.motivo = "Informe o motivo";

    if (!diaInteiro && horaInicio >= horaFim) {
      novosErros.hora = "Hora final deve ser maior que a inicial";
    }

    if (
      dataISO &&
      existeConflito(agendamentos, dataISO, turno, diaInteiro)
    ) {
      novosErros.conflito = "Já existe bloqueio para esse dia/turno";
    }

    if (Object.keys(novosErros).length > 0) {
      setErrors(novosErros);
      return;
    }

    const { error } = await supabase.from("agendamentos").insert({
      nome: "ADMIN",
      tipo: "ADMIN",
      data: dataISO,
      hora_inicio: diaInteiro ? "00:00" : horaInicio,
      hora_fim: diaInteiro ? "23:59" : horaFim,
      dia_inteiro: diaInteiro,
      turno: diaInteiro ? "integral" : turno,
      motivo,
      status: "ocupado",
    });

    if (error) {
      setErrors({ geral: "Erro ao salvar agendamento" });
      return;
    }

    onAdd();
    carregarAgenda();

    setData(null);
    setMotivo("");
    setDiaInteiro(false);
    aplicarTurno("manha");
    setErrors({});
  }

  return (
    <div className="bg-white dark:bg-[#001d49]
                    p-6 md:w-[50%] w-fullrounded-xl shadow space-y-5">

      <h2 className="text-xl font-semibold flex gap-2 items-center">
        <AlarmClockPlus />
        Bloquear laboratório
      </h2>

      <DatePickerInput
        title="Data do bloqueio:"
        selected={data}
        onChange={(date) => {
          setData(date);
          setErrors((prev) => ({ ...prev, data: null, conflito: null }));
        }}
        minDate={new Date()}
        error={errors.data}
      />

      {errors.conflito && (
        <p className="text-red-500 text-sm">{errors.conflito}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-lg">
          <input
            type="checkbox"
            checked={diaInteiro}
            onChange={(e) => {
              setDiaInteiro(e.target.checked);
              setErrors((prev) => ({ ...prev, conflito: null }));
            }}
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
                    : "bg-[#e5eeff] dark:bg-[#001438]/40"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {!diaInteiro && (
        <>
          <div className="flex gap-4">
            <InputDate
              type="time"
              title="Hora Início:"
              value={horaInicio}
              onChange={(e) => {
                setHoraInicio(e.target.value);
                setErrors((prev) => ({ ...prev, hora: null }));
              }}
            />

            <InputDate
              type="time"
              title="Hora Fim:"
              value={horaFim}
              onChange={(e) => {
                setHoraFim(e.target.value);
                setErrors((prev) => ({ ...prev, hora: null }));
              }}
            />
          </div>

          {errors.hora && (
            <p className="text-red-500 text-sm">{errors.hora}</p>
          )}
        </>
      )}

      <InputRed
        type="text"
        title="Motivo do bloqueio:"
        placeholder="Descreva o motivo"
        value={motivo}
        onChange={(e) => {
          setMotivo(e.target.value);
          setErrors((prev) => ({ ...prev, motivo: null }));
        }}
        error={errors.motivo}
      />

      {errors.geral && (
        <p className="text-red-500 text-sm">{errors.geral}</p>
      )}

      <button
        onClick={salvar}
        className="w-full bg-[#2756ac] hover:bg-[#001438]
                   text-white h-[50px] text-lg rounded"
      >
        Bloquear
      </button>
    </div>
  );
}