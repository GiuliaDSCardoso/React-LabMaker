import { useEffect } from "react";


import ALink from "../assets/styles/ALink.jsx";
import "lucide-react";
import { CalendarSearchIcon, FileBoxIcon, PackagePlusIcon, ReplaceIcon } from "lucide-react";
import CardStyle from "../assets/styles/CardStyle.jsx";
import Body from "../assets/styles/Body.jsx";

export default function Admin() {
    useEffect(() => {
        const isAuth = localStorage.getItem("auth");
        if (!isAuth) {
        window.location.href = "/";
        }
    }, []);

     function logoutButton(){
        localStorage.removeItem("auth");
        window.location.href = "/home";
    }

    return(
        <Body>
        {/* Nav */}
        <div className="flex justify-center items-center">
            <div className="flex justify-around gap-auto w-[100%]">
                <nav className="flex h-10 bg-blue-50 items-center justify-center">
                <ul className="flex gap-9 items-center">
                    <img src="../logos/logo-azul.svg" alt="Lab Maker Logo" />
                    <ALink href="/admin">Home</ALink>
                  
                </ul>
                </nav>
                <button onClick={logoutButton} className="text-[#1976d2] no-underline  font-bold hover:text-blue-700">
                    Sair
                </button>
            
            </div>
        </div>
        
        
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
            href="/emprestimoadmin"
            color="yellow"
            />
            <CardStyle
            title="Agenda de Uso"
            description="Reserva do espaço Maker"
            icon={<CalendarSearchIcon />}
            href="/agendaadmin"
            color="red"
            />
            <CardStyle
            title="Guardar Projetos"
            description="Projetos armazenados no Maker"
            icon={< FileBoxIcon />}
            href="/guardaradmin"
            color="blue"
            />
            <CardStyle
            title="Pedidos LabMaker"
            description="Solicitação de confecção"
            icon={<PackagePlusIcon />}
            href="/pedidosadmin"
            color="green"
            />
        </div>
        </div>
        
        </Body>
        
    );
        
}
