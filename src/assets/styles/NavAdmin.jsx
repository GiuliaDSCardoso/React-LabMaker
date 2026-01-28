import { MenuIcon } from "lucide-react";
import ALink from "./ALink";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function NavAdmin(){

     const [openMenu, setOpenMenu] = useState(false);
        
    
         const navigate = useNavigate();
             async function logout() {
                 await supabase.auth.signOut();
                 navigate("/login");
                 }
    
  return (
            <div className="flex justify-center">
                    <nav className="flex flex-row  items-center  bg-blue-50 justify-between w-[70%] py-2 ">
            
                    {/* LOGO */}
                    <img
                    src="../logos/logo-azul.svg"
                    className="md:h-14 h-10"
                    alt="Lab Maker Logo"
                    />

                    {/* MENU */}
                    <ul className="flex justify-center md:gap-9 gap-2 items-center relative">
                    
                    
                    {/* DROPDOWN */}
                    <li className="flex relative justify-center ">
                        <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="flex items-center gap-1 text-[#1976d2] md:text-xl text-md font-semibold hover:text-blue-700"
                        >
                        Menu
                        <MenuIcon
                            size={18}
                            className={`transition-transform ${openMenu ? "rotate-180" : ""}`}
                        />
                        </button>

                        {openMenu && (
                        <ul className="absolute items-center mt-12 w-52 bg-white shadow-lg  flex flex-col z-50">
                            <ALink href="/admin">Home</ALink>
                            <ALink href="/agendaadmin">Agenda</ALink>
                            <ALink href="/emprestimoadmin">Empréstimo</ALink>
                            
                            <ALink href="/guardaradmin">Guardar Projetos</ALink>
                            <ALink href="/pedidosadmin">Pedidos</ALink>
                            <button onClick={logout} className="text-[#1976d2] w-[100%] md:text-xl text-md  hover:bg-blue-100 no-underline  font-bold hover:text-blue-700">
                                Sair
                            </button>
                        </ul>
                        )}
                    </li>

                    
                    </ul>
                </nav>
                </div>
                

                    );
}