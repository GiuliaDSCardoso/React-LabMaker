import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Body from "../assets/styles/Body.jsx";
import AddProjetos from "../components/AddProjetos.jsx";
import Nav from "../assets/styles/Nav.jsx";

export default function GuardarProjetos() {
  const [projetos, setProjetos] = useState(
    JSON.parse(localStorage.getItem("projetos")) || []
  );

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
      <Nav />

       <header className="flex items-center bg-gradient-to-r from-[#1976d2] to-blue-800 h-[20%] px-6">
        <h1 className="sm:text-3xl text-2xl text-white font-bold text-center w-full">
          Solicitação de Espaço <br /> para Guardar Projetos
        </h1>
      </header>

      <div className="mt-10 mb-10 flex justify-center px-4">
        <AddProjetos onAddProjetosClick={handleAddProjetos} />
      </div>
    </Body>
  );
}
