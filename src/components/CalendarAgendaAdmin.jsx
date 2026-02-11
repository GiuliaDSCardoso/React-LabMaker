import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Trash2, Phone, CircleUser, Timer, MessageCircleQuestion } from "lucide-react";
import { supabase } from "../services/supabase";

export default function CalendarAgendaAdmin({ agendamentos, onRemove }) {
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

    if (novoMes > 11) { novoMes = 0; novoAno++; }
    if (novoMes < 0) { novoMes = 11; novoAno--; }

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

  async function remover(id) {
    const ok = confirm("Tem certeza que deseja remover este agendamento?");
    if (!ok) return;

    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", id);

    if (!error) {
      setDiaSelecionado(null);
      onRemove();
    }
  }

  const cores = {
    livre: "bg-green-400 hover:bg-green-500",
    ocupado: "bg-red-400 hover:bg-red-500 cursor-pointer",
    passado: "bg-gray-300 text-gray-500",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow md:w-[50%] w-full">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => mudarMes(-1)} className="p-1 rounded hover:bg-gray-200">
          <ChevronLeft />
        </button>

        <h3 className="text-lg font-bold text-[#2756ac]">
          {nomesMes[mes]} de {ano}
        </h3>

        <button onClick={() => mudarMes(1)} className="p-1 rounded hover:bg-gray-200">
          <ChevronRight />
        </button>
      </div>

      {/* SEMANA */}
      <div className="grid grid-cols-7 text-center font-semibold text-sm mb-2">
        {["D","S","T","Q","Q","S","S"].map((d,i)=>(
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* CALENDÁRIO */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: inicioSemana }).map((_, i) => <div key={i} />)}

        {Array.from({ length: diasNoMes }).map((_, i) => {
          const dia = i + 1;
          const status = statusDia(dia);
          const dataISO = new Date(ano, mes, dia).toISOString().split("T")[0];

          return (
            <div
              key={dia}
              onClick={() => status === "ocupado" && setDiaSelecionado(dataISO)}
              className={`h-10 flex items-center justify-center rounded-lg text-sm font-bold text-white ${cores[status]}`}
            >
              {dia}
            </div>
          );
        })}
      </div>

      {/* DETALHES */}
      {diaSelecionado && (
        <div className="mt-4 border-t pt-3 space-y-2">
          <h4 className="font-bold text-[#2756ac]">
            📌 {diaSelecionado.split("-").reverse().join("/")}
          </h4>

          {agendaPorData[diaSelecionado].map((a) => (
            <div
              key={a.id}
              className="bg-[#21478d] text-white rounded p-2 text-sm space-y-1"
            >
              <p className="flex items-center py-1 gap-2 px-4 "><Timer className="w-4" /> {a.hora_inicio} – {a.hora_fim}</p>
              <p className="flex items-center py-1 gap-2 px-4 bg-[#2756ac]  rounded-md "><CircleUser className="w-4" /> {a.historico?.nome || "Admin"}</p>
              <p className="flex items-center py-1 gap-2 px-4 "><MessageCircleQuestion className="w-4" /> {a.motivo}</p>

              {a.historico?.telefone && (
                <a
                  href={`https://wa.me/55${a.historico.telefone.replace(/\D/g,"")}`}
                  target="_blank"
                  className="flex rounded items-center py-1 gap-2 px-4 hover:bg-green-600/70 bg-green-600/50"
                >
                  <Phone size={14}/> WhatsApp
                </a>
              )}

              <button
                onClick={() => remover(a.id)}
                className="flex rounded w-full items-center py-1 gap-2 px-4 bg-red-600/50 hover:bg-red-600/70 text-sm mt-1"
              >
                <Trash2 size={14}/> Remover
              </button>
            </div>
          ))}

          <button
            onClick={() => setDiaSelecionado(null)}
            className="text-sm text-red-600"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
