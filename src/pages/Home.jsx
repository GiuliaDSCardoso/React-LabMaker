import "../index.css";

import {
  CalendarSearchIcon,
  FileBoxIcon,
  PackagePlusIcon,
  ReplaceIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import CardStyle from "../assets/styles/CardStyle.jsx";
import Body from "../assets/styles/Body.jsx";
import Nav from "../assets/styles/Nav.jsx";

export default function Home() {
  // CONFIGURAÇÃO DO HORÁRIO
  const HORA_ABERTURA = 8;
  const HORA_FECHAMENTO = 22;

  const [horaAtual, setHoraAtual] = useState(new Date());

  const [aberto, setAberto] = useState(() => {
    const agora = new Date();
    const hora = agora.getHours();
    return hora >= HORA_ABERTURA && hora < HORA_FECHAMENTO;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const agora = new Date();
      setHoraAtual(agora);

      const hora = agora.getHours();
      setAberto(hora >= HORA_ABERTURA && hora < HORA_FECHAMENTO);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function formatarHora(data) {
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <Body>
      <Nav />

      {/* TOPO */}
      <div
        
        className={`rounded-xl mx-2 flex justify-center items-center h-[40vh]  transition-all duration-300 ${
          aberto
            ? "  bg-cover bg-center"
            : " bg-cover bg-center"
        }`}
        style={
          aberto
            ? { backgroundImage: "url(../../public/logos/BgMaker4.jpeg)" }
            : { backgroundImage: "url(../../public/logos/BgMaker4.jpeg)"}
        }
      >
        
        <div className="text-center space-y-3">
          <h2 className="text-white text-2xl md:text-3xl font-bold">
            Bem-vindo ao Lab Maker
          </h2>

          {/* STATUS */}
          <span
            className={`inline-block px-4 py-1 rounded-full text-white text-sm font-bold ${
              aberto ? "bg-[#48ff00]/40" : "bg-[#ff0000]/40"
            }`}
          >
            {aberto ? " ABERTO AGORA" : " FECHADO"}
          </span>

          {/* RELÓGIO DIGITAL */}
          <div className="mt-3">
            <p className="text-white text-2xl font-mono">
              {formatarHora(horaAtual)}
            </p>
            <p className="text-white text-sm  font-bold opacity-90">
              Funcionamento: {String(HORA_ABERTURA).padStart(2, "0")}:00 às{" "}
              {String(HORA_FECHAMENTO).padStart(2, "0")}:00
            </p>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="w-screen flex-col mb-[10%] md:mb-[2%] mt-[10%] md:mt-[4%] md:flex-row flex justify-center items-center gap-3 bg-blue-50">
        <div className="flex flex-col md:flex-row gap-3">
          <CardStyle
            title="Empréstimo de Componentes"
            description="Registro e controle de Materiais"
            icon={<ReplaceIcon />}
            href="/emprestimo"
            color="yellow"
          />
          <CardStyle
            title="Agenda de Uso"
            description="Reserva do espaço Maker"
            icon={<CalendarSearchIcon />}
            href="/agendauso"
            color="red"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <CardStyle
            title="Guardar Projetos"
            description="Projetos armazenados no Maker"
            icon={<FileBoxIcon />}
            href="/guardarprojetos"
            color="blue"
          />
          <CardStyle
            title="Pedidos LabMaker"
            description="Solicitação de confecção"
            icon={<PackagePlusIcon />}
            href="/pedidos"
            color="green"
          />
        </div>
      </div>
    </Body>
  );
}
