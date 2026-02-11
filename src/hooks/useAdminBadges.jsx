import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export function useAdminBadges() {
  const [badges, setBadges] = useState({
    agenda: 0,
    emprestimos: 0,
    pedidos: 0,
    projetos: 0,
  });

  async function carregarBadges() {
    const [
      agenda,
      emprestimos,
      pedidos,
      projetos,
    ] = await Promise.all([
      supabase
        .from("agendamentos")
        .select("id", { count: "exact", head: true })
        .eq("status", "pendente"),

      supabase
        .from("emprestimos")
        .select("id", { count: "exact", head: true })
        .eq("is_completed", false),

      supabase
        .from("pedidos")
        .select("id", { count: "exact", head: true })
        .eq("is_completed", false),

      supabase
        .from("projetos")
        .select("id", { count: "exact", head: true })
        .eq("is_completed", false),
    ]);

    setBadges({
      agenda: agenda.count || 0,
      emprestimos: emprestimos.count || 0,
      pedidos: pedidos.count || 0,
      projetos: projetos.count || 0,
    });
  }

  useEffect(() => {
    carregarBadges();
  }, []);

  return badges;
}
