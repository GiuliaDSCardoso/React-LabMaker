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

      <header
        className="relative flex rounded-xl mx-2 flex-col justify-center h-[30vh] items-center  px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url(/logos/BgMaker4.jpeg)",
        }}
      >
        <h1 className=" text-lg md:text-3xl text-white font-bold text-center w-full">
          Solicitação de Espaço <br /> para Guardar Projetos
        </h1>
      </header>

      <div className="mt-10 mb-10 flex justify-center px-4">
        <AddProjetos onAddProjetosClick={handleAddProjetos} />
      </div>
    </Body>
  );
}
