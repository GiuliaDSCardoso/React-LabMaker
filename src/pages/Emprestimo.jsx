import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeftIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";


import AddSolicitacao from "../components/AddSolicitacao";

export default function Emprestimo() {
  const navigate = useNavigate();

  const [solicitacoes, setSolicitacoes] = useState(
    JSON.parse(localStorage.getItem("solicitacoes")) || []
  );

  function onBackClick() {
    navigate(-1);
  }

  // 🔹 Recebe os dados vindos do AddSolicitacao
  function handleAddSolicitacao(dados) {
    const novaSolicitacao = {
      id: uuidv4(),
      ...dados,
    };

    const updated = [...solicitacoes, novaSolicitacao];
    setSolicitacoes(updated);
    localStorage.setItem("solicitacoes", JSON.stringify(updated));
  }

  return (
    <body className="bg-blue-50 mx-0 w-screen h-screen ">
      {/* HEADER */}
      <header className="flex items-center bg-gradient-to-r from-[#1976d2] to-blue-800 h-40 px-6">
        <button
          onClick={onBackClick}
          className="text-white bg-[#0062c4] p-2 rounded-full"
        >
          <MoveLeftIcon />
        </button>

        <h1 className="text-3xl text-white font-bold text-center w-full">
          Solicitação de empréstimo <br /> de componentes
        </h1>
      </header>

      {/* FORMULÁRIO */}
      <div className="mt-10 mb-10 flex justify-center">
        <AddSolicitacao onAddSolicitacaoClick={handleAddSolicitacao} />
      </div>

      {/* LISTAGEM */}

    </body>
  );
}
