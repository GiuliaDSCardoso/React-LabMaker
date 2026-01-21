import { useState } from "react";
import { AlarmClockPlus } from "lucide-react";

export default function AddAgendamento({ onAdd }) {
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("22:00");
  const [diaInteiro, setDiaInteiro] = useState(false);
  const [motivo, setMotivo] = useState("");
  

  function salvar() {
    if (!data || !motivo) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const novo = {
      id: crypto.randomUUID(),
      tipo: "ADMIN",
      data,
      horaInicio: diaInteiro ? "00:00" : horaInicio,
      horaFim: diaInteiro ? "23:59" : horaFim,
      diaInteiro,
      motivo,
      status: "ocupado",
      createdAt: Date.now()
    };

    const existentes =
      JSON.parse(localStorage.getItem("agendamentos_admin")) || [];

    existentes.push(novo);
    localStorage.setItem(
      "agendamentos_admin",
      JSON.stringify(existentes)
    );

    onAdd();
    setMotivo("");
  }

  return (
    <div className="bg-white p-4 w-[50%]  rounded-xl shadow space-y-3">
      <h2 className="text-lg font-semibold flex gap-2 items-center">
        <AlarmClockPlus /> Bloquear laboratório
      </h2>

      <input
        type="date"
        className="w-full h-[40px] px-3 bg-[#e5eeff]"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm">
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
            className="w-full h-[40px] px-3 bg-[#e5eeff]"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
          />
          <input
            type="time"
            className="w-full h-[40px] px-3 bg-[#e5eeff]"
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
          />
        </div>
      )}

      <textarea
        placeholder="Motivo da ocupação"
        className="w-full p-2 bg-[#e5eeff]"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />

      <button
        onClick={salvar}
        className="w-full bg-[#2756ac] text-white h-[40px] rounded"
      >
        Bloquear
      </button>
    </div>
  );
}
