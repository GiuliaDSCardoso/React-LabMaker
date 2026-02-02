import { useState } from "react";
import { AlarmClockPlus } from "lucide-react";
import { supabase } from "../services/supabase";

export default function AddAgendamento({ onAdd }) {
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("22:00");
  const [diaInteiro, setDiaInteiro] = useState(false);
  const [motivo, setMotivo] = useState("");

  async function salvar() {
    if (!data || !motivo) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const { error } = await supabase.from("agendamentos").insert({
      tipo: "ADMIN",
      data,
      hora_inicio: diaInteiro ? "00:00" : horaInicio,
      hora_fim: diaInteiro ? "23:59" : horaFim,
      dia_inteiro: diaInteiro,
      motivo,
      status: "ocupado",
    });

    if (error) {
      console.error(error);
      alert("Erro ao salvar agendamento");
      return;
    }

    onAdd();
    setMotivo("");
  }

  return (
    <div className="bg-white p-4 w-[100%] rounded-xl shadow space-y-3">
      <h2 className="text-lg md:text-xl font-semibold flex gap-2 items-center">
        <AlarmClockPlus /> Bloquear laboratório
      </h2>

      <input
        type="date"
        className="w-full focus:outline-none
                focus:ring-1
                focus:border-blue-50 h-[50px] px-3 text-lg md:text-xl bg-[#e5eeff]"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

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
          <input
            type="time"
            className="md:w-full w-[50%] h-[50px] focus:outline-none
                focus:ring-1
                focus:border-blue-50 px-3 text-lg md:text-xl bg-[#e5eeff]"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
          />
          <input
            type="time"
            className="md:w-full w-[50%] h-[50px] focus:outline-none
                focus:ring-1
                focus:border-blue-50  px-3 text-lg md:text-xl bg-[#e5eeff]"
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
          />
        </div>
      )}
      <div>
        <label htmlFor="motivo" className="text-lg md:text-xl">Insira o motivo da ocupação</label>
        <textarea
        placeholder="Motivo da ocupação"
        className="w-full focus:outline-none
                focus:ring-1
                focus:border-blue-50 p-2 text-lg bg-[#e5eeff]"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />
      </div>
      

      <button
        onClick={salvar}
        className="w-full bg-[#2756ac] text-lg md:text-xl text-white h-[50px] rounded"
      >
        Bloquear
      </button>
    </div>
  );
}