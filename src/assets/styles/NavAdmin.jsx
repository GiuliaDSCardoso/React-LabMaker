import { MenuIcon } from "lucide-react";
import ALink from "./ALink";
import { useEffect, useState } from "react";

export default function NavAdmin(){

     const [openMenu, setOpenMenu] = useState(false);
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
    
  return (
            <div className="flex justify-center">
                    <nav className="flex flex-row  items-center  bg-blue-50 justify-between w-[70%] py-2 ">
            
                    {/* LOGO */}
                    <img
                    src="../logos/logo-azul.svg"
                    className="h-10"
                    alt="Lab Maker Logo"
                    />

                    {/* MENU */}
                    <ul className="flex justify-center md:gap-9 gap-2 items-center relative">
                    
                    
                    {/* DROPDOWN */}
                    <li className="flex relative justify-center ">
                        <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="flex items-center gap-1 text-[#1976d2] font-semibold hover:text-blue-700"
                        >
                        Menu
                        <MenuIcon
                            size={18}
                            className={`transition-transform ${openMenu ? "rotate-180" : ""}`}
                        />
                        </button>

                        {openMenu && (
                        <ul className="absolute items-center mt-10 w-52 bg-white shadow-lg  flex flex-col z-50">
                            <ALink href="/admin">Home</ALink>
                            <ALink href="/emprestimoadmin">Empréstimo</ALink>
                            <ALink href="/agendaadmin">Agenda</ALink>
                            <ALink href="/guardaradmin">Guardar Projetos</ALink>
                            <ALink href="/pedidosadmin">Pedidos</ALink>
                            <button onClick={logoutButton} className="text-[#1976d2] w-[100%] hover:bg-blue-100 no-underline  font-bold hover:text-blue-700">
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