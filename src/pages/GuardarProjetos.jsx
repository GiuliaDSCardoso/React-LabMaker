import {  useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Body from "../assets/styles/Body.jsx";
import AddProjetos from "../components/AddProjetos.jsx";
import Nav from "../assets/styles/Nav.jsx";
export default function GuardarProjetos() {


  const [projetos, setProjetos] = useState(
    JSON.parse(localStorage.getItem("projetos")) || []
  );


  // 🔹 Recebe os dados vindos do AddProjetos
  function handleAddProjetos(dados) {
    const novoProjeto = {
      id: uuidv4(),
      ...dados,
    };

    const updated = [...projetos, novoProjeto];
    setProjetos(updated);
    localStorage.setItem("projetos", JSON.stringify(updated));
  }

  

  return (
    <Body>
     
         {/* Nav */}
       <Nav/>
      {/* HEADER */}
      <header className="flex items-center bg-gradient-to-r from-[#1976d2] to-blue-800 h-40 px-6">

        <h1 className="text-3xl text-white font-bold text-center w-full">
          Solicitação de Espaço <br /> para Guardar Projetos
        </h1>
      </header>

      {/* FORMULÁRIO */}
      <div className="mt-10 mb-10 flex justify-center">
        <AddProjetos onAddProjetosClick={handleAddProjetos} />
      </div>

      {/* LISTAGEM */}

    </Body>
  );
}
