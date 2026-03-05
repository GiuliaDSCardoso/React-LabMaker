

import "../index.css";

import "lucide-react";
import { CalendarSearchIcon, FileBoxIcon, PackagePlusIcon, ReplaceIcon } from "lucide-react";
import CardStyle from "../assets/styles/CardStyle.jsx";
import Body from "../assets/styles/Body.jsx";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";
import MenuLateralAdmin from "../assets/styles/MenuLateralAdmin.jsx";
import AdminCarrossel from "../assets/styles/AdminCarrossel.jsx";


export default function Admin() {
    const [horaAbertura, setHoraAbertura] = useState(8);
    const [horaFechamento, setHoraFechamento] = useState(22);
    const [configId, setConfigId] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);

    useEffect(() => {
    async function carregarHorario() {
        const { data } = await supabase
        .from("configuracoes")
        .select("*")
        .single();

        if (data) {
        setConfigId(data.id); 
        setHoraAbertura(data.hora_abertura);
        setHoraFechamento(data.hora_fechamento);
        }
    }

    carregarHorario();
    }, []);

    async function salvarHorario() {
        if (!configId) {
            alert("Configuração não encontrada.");
            return;
        }

        const { error } = await supabase
            .from("configuracoes")
            .update({
            hora_abertura: horaAbertura,
            hora_fechamento: horaFechamento,
            })
            .eq("id", configId); // 👈 AGORA CORRETO

        if (error) {
            console.error(error);
            alert("Erro ao atualizar.");
            return;
        }

        alert("Horário atualizado com sucesso!");
        }
    return(
        <Body>
        {/* Nav */}
        <MenuLateralAdmin />
                

        
        
        <div className="flex mx-5 justify-center items-center flex-col gap-6">
            {/* Container */}
        <div className="
          w-full
          max-w-7xl
          mx-auto
          mt-24
          md:mt-5
          rounded-xl
          flex flex-col justify-center items-center
          h-[25vh]
          bg-[#0E4194]
          dark:bg-[#001941]
          bg-cover bg-center
        ">
            <div>
            <h2 className="text-white text-center text-3xl font-bold"> Bem-vindo(a) Administrador(a)</h2>
            </div>
            <div>
                <button
                onClick={() => setModalAberto(true)}
                className="mt-6 bg-white dark:bg-[#1c5ec9] dark:text-white text-blue-700 font-semibold md:px-6 md:py-2 px-2 py-1 md:mx-0 mx-5 rounded-lg shadow hover:bg-gray-100 transition"
                >
                Mudar horário de funcionamento
                </button>
            </div>
            
          
        </div>
       
       <div className="flex ">
         <h1 className="font-black text-lg">Gerencie as imagens do carrossel</h1>
       </div>
         
          <AdminCarrossel/>   
       
        
        {/* Cards */}
        <div className="w-full flex-col md:flex-row  mb-[10%] md:mb-[2%] mt-[10%] md:mt-[4%] flex justify-center items-center gap-3">
            <div className=" flex flex-col md:flex-row gap-3">
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
             </div>
             <div className=" flex flex-col md:flex-row gap-3">
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
        </div>
        {modalAberto && (
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setModalAberto(false)}
            >
                <div
                className="bg-white dark:bg-[#0b1e3a] rounded-xl shadow-xl p-6 w-[90%] max-w-md"
                onClick={(e) => e.stopPropagation()} // 👈 impede fechar ao clicar dentro
                >
                <h3 className="text-xl font-bold text-blue-700 dark:text-white mb-4">
                    Configurar Horário
                </h3>

                <div className="flex gap-4 mb-6">
                    <div className="flex flex-col w-full">
                    <label className="text-sm font-semibold">Abertura</label>
                    <input
                        type="number"
                        min="0"
                        max="23"
                        value={horaAbertura}
                        onChange={(e) => setHoraAbertura(Number(e.target.value))}
                        className="border placeholder-transparent  bg-transparent rounded-lg px-3 py-2"
                    />
                    </div>

                    <div className="flex flex-col w-full">
                    <label className="text-sm font-semibold">Fechamento</label>
                    <input
                        type="number"
                        min="0"
                        max="23"
                        value={horaFechamento}
                        onChange={(e) => setHoraFechamento(Number(e.target.value))}
                        className="border rounded-lg placeholder-transparent  bg-transparent px-3 py-2"
                    />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                    onClick={() => setModalAberto(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                    Cancelar
                    </button>

                    <button
                    onClick={async () => {
                        await salvarHorario();
                        setModalAberto(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                    Salvar
                    </button>
                </div>
                </div>
            </div>
            )}
        </Body>
        
    );
        
}
