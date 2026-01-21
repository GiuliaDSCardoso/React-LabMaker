import "./index.css";
import ALink from "./assets/styles/ALink.jsx";
import "lucide-react";
import { CalendarSearchIcon, FileBoxIcon, PackagePlusIcon, ReplaceIcon } from "lucide-react";
import CardStyle from "./assets/styles/CardStyle.jsx";
import Body from "./assets/styles/Body.jsx";


function App(){
  return(
    <Body>
       {/* Nav */}
      <nav className="flex h-10 bg-blue-50 items-center  justify-center w-screen">
        <img src="../logos/logo-azul.svg" className="w-[80%] h-[40px]" alt="Lab Maker Logo" />
        <ul className="flex gap-9  w-[100%] items-center">
         
         <ALink href="/home">Home</ALink>
         <ALink href="/contact">Contato</ALink>
         <ALink href="/login">Login</ALink>
        </ul>
      </nav>
      <div className="flex flex-col gap-6">
        {/* Container */}
      <div className="w-screen flex justify-center items-center bg-gradient-to-r from-[#1976d2] to-blue-800 h-80">
        <div>
          <h2 className="text-white text-center text-3xl font-bold"> Bem-vindo ao Lab Maker</h2>
          <h3 className="text-white text-center text-lg">
            Horário de Funcionamento: 10h às 20h
          </h3>
        </div>
      </div>
      {/* Cards */}
      <div className="w-screen flex justify-center items-center gap-10 bg-blue-50">
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
        <CardStyle
          title="Guardar Projetos"
          description="Projetos armazenados no Maker"
          icon={< FileBoxIcon />}
          href="/guardarprojetos"
          color="blue"
        />
        <CardStyle
          title="Pedidos LabMaker"
          description="Solicitação de confecção"
          icon={<PackagePlusIcon/>}
          href="/pedidos"
          color="green"
        />
      </div>
      </div>
      
    </Body>
  );
}

export default App;