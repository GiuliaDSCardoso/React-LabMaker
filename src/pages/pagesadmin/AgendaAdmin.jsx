import { useEffect, useState } from "react";
import AddAgendamento from "../../components/AddAgendamento";
import Body from "../../assets/styles/Body";
import NavAdmin from "../../assets/styles/NavAdmin";
import { supabase } from "../../services/supabase";
import CalendarAgendaAdmin from "../../components/CalendarAgendaAdmin";

export default function AgendaAdmin() {
  const [todosDados, setTodosDados] = useState([]);

  async function carregar() {
    const { data, error } = await supabase
      .from("agendamentos")
      .select("*");

    if (!error) setTodosDados(data || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <Body>
      <NavAdmin />

      <header
        className="flex items-center bg-gradient-to-r from-[#1976d2] to-blue-800 py-10 px-6"
      >
        <h1 className="text-3xl text-white font-bold text-center w-full">
          Agenda Administrativa<br /> LabMaker
        </h1>
      </header>

      <div className="flex flex-col justify-center items-center py-10 mb-[5%] px-6 w-full space-y-6">
        <AddAgendamento onAdd={carregar} />
        <CalendarAgendaAdmin
          agendamentos={todosDados}
          onRemove={carregar}
        />
      </div>
    </Body>
  );
}
