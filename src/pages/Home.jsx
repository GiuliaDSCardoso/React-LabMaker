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
import { supabase } from "../services/supabase.js";

export default function Home() {
  // CONFIGURAÇÃO DO HORÁRIO
const [horaAbertura, setHoraAbertura] = useState(8);
const [horaFechamento, setHoraFechamento] = useState(22);
const [aberto, setAberto] = useState(false);
useEffect(() => {
  supabase.auth.signOut(); // desloga sempre que acessar página pública
}, []);
  
useEffect(() => {
  async function carregarHorario() {
    const { data } = await supabase
      .from("configuracoes")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setHoraAbertura(data.hora_abertura);
      setHoraFechamento(data.hora_fechamento);
    }
  }

  carregarHorario();

  // 🔥 ESCUTAR ALTERAÇÕES EM TEMPO REAL
  const channel = supabase
    .channel("configuracoes-realtime")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "configuracoes",
      },
      (payload) => {
        const novaConfig = payload.new;

        setHoraAbertura(novaConfig.hora_abertura);
        setHoraFechamento(novaConfig.hora_fechamento);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

useEffect(() => {
  const timer = setInterval(() => {
    const agora = new Date();
    const hora = agora.getHours();
    setAberto(hora >= horaAbertura && hora < horaFechamento);
  }, 1000);

  return () => clearInterval(timer);
}, [horaAbertura, horaFechamento]);
  

  return (
    <Body>
      {/* LINHA AZUL SUPERIOR */}
      

      {/* MENU LATERAL */}
      <MenuLateral />

      {/* CONTAINER PRINCIPAL (DESCONTA MENU) */}
      <div
        className="
          mt-28
          px-6
          transition-all duration-300
          md:ml-12
          md:mt-5
          lg:ml-16
          lg:mt-5
        "
      >
        {/* TOPO / BANNER */}
        <div
          className="
            w-full
            max-w-7xl
            mx-auto
            rounded-xl
            flex justify-center items-center
            h-[18vh]
            bg-[#0c54c7]
            dark:bg-[#033a91]
            bg-cover bg-center
          "
        >
          <div className="text-center space-y-1">
            <h2 className="text-white text-2xl md:text-3xl font-bold">
              Bem-vindo ao Lab Maker
            </h2>

            {/* STATUS */}
          
            {/* RELÓGIO DIGITAL */}
            <div className="mt-3 flex-col flex gap-2">
              <p className="text-white text-sm font-bold opacity-90">
                
                Funcionamento: {horaAbertura}:00 às {horaFechamento}:00
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