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
import MenuLateral from "../assets/styles/MenuLateral.jsx";
import CarrosselEventos from "../assets/styles/CarrosselEventos.jsx";

export default function Home() {
  // CONFIGURAÇÃO DO HORÁRIO
  const HORA_ABERTURA = 8;
  const HORA_FECHAMENTO = 22;

<<<<<<< Updated upstream
 
=======


>>>>>>> Stashed changes
  const [aberto, setAberto] = useState(() => {
    const agora = new Date();
    const hora = agora.getHours();
    return hora >= HORA_ABERTURA && hora < HORA_FECHAMENTO;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const agora = new Date();
<<<<<<< Updated upstream
      
=======

>>>>>>> Stashed changes

      const hora = agora.getHours();
      setAberto(hora >= HORA_ABERTURA && hora < HORA_FECHAMENTO);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

<<<<<<< Updated upstream
  return (
    <Body>
      {/* LINHA AZUL SUPERIOR */}
=======
  

  return (
    <Body>
      {/* LINHA AZUL SUPERIOR */}
      
>>>>>>> Stashed changes

      {/* MENU LATERAL */}
      <MenuLateral />

      {/* CONTAINER PRINCIPAL (DESCONTA MENU) */}
      <div
        className="
<<<<<<< Updated upstream
          mt-5
          px-6
          transition-all duration-300
          md:ml-12
          lg:ml-16
=======
          mt-28
          px-6
          transition-all duration-300
          md:ml-12
          md:mt-5
          lg:ml-16
          lg:mt-5
>>>>>>> Stashed changes
        "
      >
        {/* TOPO / BANNER */}
        <div
          className="
            w-full
            max-w-7xl
            mx-auto
<<<<<<< Updated upstream
            mt-24
            md:mt-0
            rounded-xl
            flex justify-center items-center
            h-[18vh]
            bg-[#0E4194]
            dark:bg-[#001941]
=======
            rounded-xl
            flex justify-center items-center
            h-[18vh]
            bg-[#0c54c7]
            dark:bg-[#033a91]
>>>>>>> Stashed changes
            bg-cover bg-center
          "
        >
          <div className="text-center space-y-1">
            <h2 className="text-white text-2xl md:text-3xl font-bold">
              Bem-vindo ao Lab Maker
            </h2>

            {/* STATUS */}
<<<<<<< Updated upstream

            {/* RELÓGIO DIGITAL */}
            <div className="mt-3 flex-col flex gap-2">
              <p className="text-white text-sm font-bold opacity-90">
                Funcionamento: {String(HORA_ABERTURA).padStart(2, "0")}:00 às{" "}
                {String(HORA_FECHAMENTO).padStart(2, "0")}:00
              </p>
              <span
                className={`inline-block px-4 py-1 rounded-full text-white text-sm font-bold ${
                  aberto ? "bg-[#0199ff]/30" : "bg-[#E84B13]"
                }`}
              >
                {aberto ? " ABERTO" : " FECHADO"}
              </span>
            </div>
          </div>
        </div>

        <CarrosselEventos />
        {/* CARDS */}
=======
          
            {/* RELÓGIO DIGITAL */}
            <div className="mt-3 flex-col flex gap-2">
              <p className="text-white text-sm font-bold opacity-90">
                Funcionamento:{" "}
                {String(HORA_ABERTURA).padStart(2, "0")}:00 às{" "}
                {String(HORA_FECHAMENTO).padStart(2, "0")}:00
              </p>
             <span
              className={`inline-block px-4 py-1 rounded-full text-white text-sm font-bold ${
                aberto ? "bg-[#0199ff]/30" : "bg-[#ff0000]"
              }`}
            >
              {aberto ? " ABERTO" : " FECHADO"}
            </span>
              
            </div>  
            

          </div>
        </div>
   
        <CarrosselEventos/>

>>>>>>> Stashed changes
        <div
          className="
            w-full
            max-w-7xl
            mx-auto
            flex flex-col
            md:flex-row
            justify-center
            items-center
            gap-8
            mt-7
          "
        >
          <div className="flex flex-col md:flex-row gap-8">
            <CardStyle
              title="Empréstimo de Componentes"
              description="Registro e controle de Materiais"
              icon={<ReplaceIcon />}
              href="/emprestimo"
              color="yellow"
            />

            <CardStyle
              title="Agenda de Uso"
              description="Reserva do espaço Maker *Exclusivo para funcionários"
              icon={<CalendarSearchIcon />}
              href="/agendauso"
              color="red"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
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
      </div>
    </Body>
  );
}