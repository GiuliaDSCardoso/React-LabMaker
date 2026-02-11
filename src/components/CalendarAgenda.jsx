import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, CircleUser, MessageCircleQuestion, Timer } from "lucide-react";

export default function CalendarAgenda({ agendamentos }) {
  const hoje = new Date();

  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const diasNoMes = ultimoDia.getDate();
  const inicioSemana = primeiroDia.getDay();

  const nomesMes = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];

  // 🔹 Agrupa agendamentos por data
  const agendaPorData = useMemo(() => {
    const map = {};
    agendamentos.forEach((a) => {
      if (!map[a.data]) map[a.data] = [];
      map[a.data].push(a);
    });
    return map;
  }, [agendamentos]);

  function mudarMes(direcao) {
    let novoMes = mes + direcao;
    let novoAno = ano;

    if (novoMes > 11) {
      novoMes = 0;
      novoAno++;
    }
    if (novoMes < 0) {
      novoMes = 11;
      novoAno--;
    }

    setMes(novoMes);
    setAno(novoAno);
    setDiaSelecionado(null);
  }

  function statusDia(dia) {
    const data = new Date(ano, mes, dia);
    const hojeZero = new Date();
    hojeZero.setHours(0,0,0,0);

    const iso = data.toISOString().split("T")[0];

    if (data < hojeZero) return "passado";
    if (agendaPorData[iso]) return "ocupado";
    return "livre";
  }

  const cores = {
    livre: "bg-green-400 hover:bg-green-500",
    ocupado: "bg-red-400 hover:bg-red-500 cursor-pointer",
    passado: "bg-gray-300 text-gray-500 cursor-not-allowed",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow">

      {/* HEADER COM NAVEGAÇÃO */}
      <div className="flex items-center text-[#2756ac] justify-between mb-4">
        <button
          onClick={() => mudarMes(-1)}
          className="p-1 rounded hover:bg-gray-200"
        >
          <ChevronLeft />
        </button>

        <h3 className="text-lg font-bold ">
          {nomesMes[mes]} de {ano}
        </h3>

        <button
          onClick={() => mudarMes(1)}
          className="p-1 rounded hover:bg-gray-200"
        >
          <ChevronRight />
        </button>
      </div>

      {/* DIAS DA SEMANA */}
      <div className="grid grid-cols-7 text-[#2756ac] text-center font-semibold text-sm mb-2">
        {["D","S","T","Q","Q","S","S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* CALENDÁRIO */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: inicioSemana }).map((_, i) => (
          <div key={i} />
        ))}

        {Array.from({ length: diasNoMes }).map((_, i) => {
          const dia = i + 1;
          const status = statusDia(dia);
          const dataISO = new Date(ano, mes, dia)
            .toISOString()
            .split("T")[0];

          return (
            <div
              key={dia}
              onClick={() =>
                status === "ocupado" && setDiaSelecionado(dataISO)
              }
              className={`h-10 flex items-center justify-center rounded-lg text-sm font-bold text-white transition ${cores[status]}`}
              title={
                agendaPorData[dataISO]
                  ? agendaPorData[dataISO]
                      .map(a => `${a.hora_inicio}–${a.hora_fim}`)
                      .join("\n")
                  : ""
              }
            >
              {dia}
            </div>
          );
        })}
      </div>

      {/* DETALHES */}
      {diaSelecionado && (
        <div className="mt-4 text-[#2756ac] border-t border-[#7ea6f127] pt-3">
          <h4 className="font-bold  mb-2">
            <div className="flex items-center gap-2">
                <CalendarDays className="w-5"/> {diaSelecionado.split("-").reverse().join("/")}
            </div>
            
          </h4>

          {agendaPorData[diaSelecionado].map((a, i) => (
            <div
              key={i}
              className="bg-[#21478d]  text-white font-bold rounded px-2 py-2 mb-2 text-sm"
            >
                
              <p className="flex items-center py-1 gap-2 px-4 "><Timer className="w-4" /> {a.hora_inicio} – {a.hora_fim}</p>
              <p className="flex items-center py-1 gap-2 px-4 bg-[#2756ac]  rounded-md "><CircleUser className="w-4" /> {a.historico?.nome || "Admin"}</p>
              <p className="flex items-center py-1 gap-2 px-4 "><MessageCircleQuestion className="w-4" /> {a.motivo}</p>
            </div>
          ))}

          <button
            onClick={() => setDiaSelecionado(null)}
            className="text-sm text-red-600 mt-2"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
