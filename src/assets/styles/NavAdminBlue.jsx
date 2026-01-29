import { MenuIcon } from "lucide-react";
import ALink from "./ALink";
import { useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";

export default function NavAdminBlue(){

     const [openMenu, setOpenMenu] = useState(false);
       
         const navigate = useNavigate();
                      async function logout() {
                          await supabase.auth.signOut();
                          navigate("/");
                          }
    
  return (
            <div className="flex justify-center bg-[#1976d2] w-[100%]">
                    <nav className="flex flex-row  items-center   justify-between w-[70%]  py-2 ">
            
                    {/* LOGO */}
                    <a href="/admin">
                        <img
                        src="../logos/logo-white.svg"
                        className="h-10 md:h-14"
                        alt="Lab Maker Logo"
                        />
                        </a>

                    {/* MENU */}
                    <ul className="flex justify-center md:gap-9 gap-2 items-center relative">
                    
                    
                    {/* DROPDOWN */}
                    <li className="flex relative justify-center ">
                        <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="flex items-center gap-1 text-white md:text-xl text-md font-semibold hover:text-blue-300"
                        >
                        Menu
                        <MenuIcon
                            size={18}
                            className={`transition-transform ${openMenu ? "rotate-180" : ""}`}
                        />
                        </button>

                        {openMenu && (
                        <ul className="absolute items-center mt-10 md:mt-12 w-52 bg-white shadow-lg  flex flex-col z-50">
                            <ALink href="/admin">Home</ALink>
                            <ALink href="/agendaadmin">Agenda</ALink>
                            <ALink href="/emprestimoadmin">Empréstimo</ALink>
                            
                            <ALink href="/guardaradmin">Guardar Projetos</ALink>
                            <ALink href="/pedidosadmin">Pedidos</ALink>
                            <button onClick={logout} className="text-[#1976d2] w-[100%] md:text-xl text-md hover:bg-blue-100 no-underline  font-bold hover:text-blue-700">
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