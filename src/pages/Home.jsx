import "../index.css";

import { CalendarSearchIcon, FileBoxIcon, PackagePlusIcon, ReplaceIcon } from "lucide-react";
import CardStyle from "../assets/styles/CardStyle.jsx";
import Body from "../assets/styles/Body.jsx";
import Nav from "../assets/styles/Nav.jsx";

export default function Home() {
  return (
    <Body>
      <Nav />

      <div className="w-screen flex justify-center items-center bg-gradient-to-r from-[#1976d2] to-blue-800 h-80">
        <div>
          <h2 className="text-white text-center text-3xl font-bold">
            Bem-vindo ao Lab Maker
          </h2>
          <h3 className="text-white text-center text-lg">
            Horário de Funcionamento: 10h às 20h
          </h3>
        </div>
      </div>

      <div className="w-screen flex-col mt-[2%] md:flex-row flex justify-center items-center gap-3 bg-blue-50">
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
