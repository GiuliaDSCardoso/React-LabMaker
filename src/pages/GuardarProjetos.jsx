import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Body from "../assets/styles/Body.jsx";
import AddProjetos from "../components/AddProjetos.jsx";
import Header from "../assets/styles/Header.jsx";
import MenuLateral from "../assets/styles/MenuLateral.jsx";

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
      <MenuLateral/>

      <Header
          title="Solicitação de Espaço para Guardar Projetos"
      />

      <div className="mt-16 mb-10 flex justify-center px-4">
        <AddProjetos onAddProjetosClick={handleAddProjetos} />
      </div>
    </Body>
  );
}
