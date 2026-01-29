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

  // Função de validação de email
  function emailValido(email) {
    const dominiosPermitidos = ["@gmail.com","@ba.estudante.senai.br", "@fieb.org.br", "@fbest.org.br"];
    return dominiosPermitidos.some((dominio) =>
      email.toLowerCase().endsWith(dominio)
    );
  }

  async function enviar() {
    // Validação de campos obrigatórios
    if (!nome || !email || !telefone || !motivo || !arrumacao || !data) {
      alert("Preencha todos os campos!");
      return;
    }

    // Validação do email
    if (!emailValido(email)) {
      alert(
        "Use um email válido: @gmail.com, @ba.estudante.senai.br, @fieb.org.br ou @fbest.org.br"
      );
      return;
    }

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

    alert(
      'Solicitação enviada! Envie um email para "NOA SENAI FEIRA" <senaifeiranoa@fieb.org.br>'
    );

    // Resetar campos
    setNome("");
    setEmail("");
    setTelefone("");
    setMotivo("");
    setArrumacao("");
    setData("");
    setHoraInicio("08:00");
    setHoraFim("09:00");
  }

  return (
    <Body>
      <Nav />

      <header className="flex items-center bg-gradient-to-r from-[#1976d2] to-blue-800 md:h-64 px-6">
        <h1 className="text-2xl sm:text-3xl text-white font-bold text-center w-full">
          Solicitação de agendamento <br /> do Laboratório Maker
        </h1>
      </header>

      <div className="flex flex-col mt-10 items-center justify-center gap-6 px-4 w-full">
        <div className="flex flex-col lg:flex-row gap-6 w-full justify-center max-w-6xl">
          <div className="md:w-[50%] mb-20 w-full px-4 space-y-4">
            <InputRed
              title="Insira seu nome completo:"
              placeholder="Nome completo"
              onChange={(e) => setNome(e.target.value)}
              value={nome}
            />

            <InputRed
              title="Insira seu email:"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <InputRed
              title="Insira seu telefone:"
              placeholder="Use esse formato ex: (11)912345678"
              onChange={(e) => setTelefone(e.target.value)}
              value={telefone}
            />

            <div className="w-full flex flex-col gap-4">
              <label className="text-lg md:text-xl font-medium placeholder:text-[#000000] flex gap-1">
                Escolha a arrumação da sala:
                <span className="relative group cursor-help text-red-600">*</span>
              </label>

              <select
                className="input w-full text-lg placeholder:text-[#000000]  h-[40px] px-3 bg-[#e5eeff] outline-none"
                onChange={(e) => setArrumacao(e.target.value)}
                value={arrumacao}
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
              value={data}
            />

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <InputDate
                type="time"
                title="Hora de início:"
                className="w-full"
                onChange={(e) => setHoraInicio(e.target.value)}
                value={horaInicio}
              />
              <InputDate
                type="time"
                title="Hora de fim:"
                className="w-full"
                onChange={(e) => setHoraFim(e.target.value)}
                value={horaFim}
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-lg md:text-xl font-medium placeholder:text-[#000000] flex gap-1">
                Qual o motivo da alocação?
                <span className="relative group cursor-help text-red-600">*</span>
              </label>

              <textarea
                className="input w-full resize-none text-lg h-[80px] px-3 pt-2 placeholder:text-[#000000] bg-[#e5eeff] outline-none"
                placeholder="Motivo"
                onChange={(e) => setMotivo(e.target.value)}
                value={motivo}
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
