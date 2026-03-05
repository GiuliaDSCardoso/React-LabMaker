import { useEffect, useState } from "react";
import AddAgendamento from "../../components/AddAgendamento";
import Body from "../../assets/styles/Body";

import { supabase } from "../../services/supabase";
import CalendarAgendaAdmin from "../../components/CalendarAgendaAdmin";
import MenuLateralAdmin from "../../assets/styles/MenuLateralAdmin";
import Header from "../../assets/styles/Header";

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
      <MenuLateralAdmin />

      <Header
        title="Agenda Administrativa - LabMaker"
      />

      <div className="flex flex-col md:flex-col md:items-center justify-center items-center py-10 mb-[5%] px-6 w-full space-y-6">
        <AddAgendamento onAdd={carregar} />
        <CalendarAgendaAdmin
          agendamentos={todosDados}
          onRemove={carregar}
        />
      </div>
    </Body>
  );
}
