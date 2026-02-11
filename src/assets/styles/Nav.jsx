import { MenuIcon } from "lucide-react";
import ALink from "./ALink";
import { useState } from "react";

export default function Nav() {
  const [openMenu, setOpenMenu] = useState(false);
    return (
    <div className="flex h-[5vh] justify-center">
        <nav className="flex flex-row  items-center  bg-blue-50 justify-between w-[70%] py-2 ">
  
        {/* LOGO */}
        <a href="/">
        <img
          src="../logos/logo-azul.svg"
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
              className="flex items-center gap-1 text-[#1976d2] md:text-xl text-md font-semibold hover:text-blue-700"
            >
              Menu
              <MenuIcon
                size={18}
                className={`transition-transform ${openMenu ? "rotate-180" : ""}`}
              />
            </button>

            {openMenu && (
              <ul className="absolute items-center  mt-10 md:mt-12 w-52 bg-white shadow-lg  flex flex-col z-50">
                <ALink href="/">Home</ALink>
                <ALink href="/contact">Contato</ALink>
                <ALink href="/agendauso">Agenda</ALink>
                <ALink href="/emprestimo">Empréstimo</ALink>
                
                <ALink href="/guardarprojetos">Guardar Projetos</ALink>
                <ALink href="/pedidos">Pedidos</ALink>
                <ALink href="/login">Login</ALink>
              </ul>
            )}
          </li>

         
        </ul>
      </nav>
       </div>
     ); 
}