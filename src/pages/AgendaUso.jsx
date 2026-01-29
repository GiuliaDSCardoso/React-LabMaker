import { useState } from "react";

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

  async function enviar() {
    const { data: bloqueios } = await supabase
      .from("agendamentos")
      .select("*")
      .eq("tipo", "ADMIN")
      .eq("data", data);

    const conflito = bloqueios?.some(
      (b) =>
        b.dia_inteiro ||
        (horaInicio < b.hora_fim && horaFim > b.hora_inicio)
    );

    if (conflito) {
      alert("Laboratório indisponível nesse horário/dia");
      return;
    }

    const { error } = await supabase.from("agendamentos").insert({
      tipo: "USUARIO",
      data,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      motivo,
      status: "pendente",
      historico: {
        nome,
        email,
        telefone,
        arrumacaoSala: arrumacao,
      },
    });

    if (error) {
      alert("Erro ao enviar solicitação");
      return;
    }

    alert("Solicitação enviada! Envie um email para \"NOA SENAI FEIRA\" <senaifeiranoa@fieb.org.br> ");
  }

  return (
    <Body>
      <Nav />

        <header className="flex items-center bg-gradient-to-r from-[#1976d2] to-blue-800 md:h-[20%] px-6">
        <h1 className="text-2xl sm:text-3xl text-white font-bold text-center w-full">
          Solicitação de agendamento <br /> do Laboratório Maker
        </h1>
      </header>

     <div className="flex  flex-col mt-10 items-center justify-center gap-6 px-4 w-full">
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-center max-w-6xl">
    
        <div className="md:w-[50%] mb-20 w-full px-4 space-y-4">
          <InputRed
            title="Insira seu nome completo:"
            placeholder="Nome completo"
            onChange={(e) => setNome(e.target.value)}
          />

          <InputRed
            title="Insira seu email:"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputRed
            title="Insira seu telefone:"
            placeholder="Telefone"
            onChange={(e) => setTelefone(e.target.value)}
          />

          <div className="w-full flex flex-col gap-4">
            <label className="text-lg md:text-xl font-medium text-gray-700 flex gap-1">
              Escolha a arrumação da sala:
              <span className="relative group cursor-help text-red-600">
                *
                <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded top-6 left-1/2 -translate-x-1/2 z-50">
                  item obrigatório
                </span>
              </span>
            </label>

            <select
              className="input w-full text-lg text-[#a7a7a7]  h-[40px] px-3 bg-[#e5eeff] outline-none"
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
            title="Insira a data:"
            className="w-full"
            onChange={(e) => setData(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <InputDate
              type="time"
              title="Hora de início:"
              className="w-full"
              onChange={(e) => setHoraInicio(e.target.value)}
            />
            <InputDate
              type="time"
              title="Hora de fim:"
              className="w-full"
              onChange={(e) => setHoraFim(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-lg md:text-xl font-medium text-gray-700 flex gap-1">
              Qual o motivo da alocação?
              <span className="relative group cursor-help text-red-600">
                *
                <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded top-6 left-1/2 -translate-x-1/2 z-50">
                  item obrigatório
                </span>
              </span>
            </label>

            <textarea
              className="input w-full resize-none text-lg h-[80px] px-3 pt-2 bg-[#e5eeff] outline-none"
              placeholder="Motivo"
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          <button
            onClick={enviar}
            className="bg-[#2756ac] text-white h-[50px] text-lg rounded w-full"
          >
            Enviar solicitação
          </button>
        </div>
      </div>
      </div>
    </Body>
  );
}
