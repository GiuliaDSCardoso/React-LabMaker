import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeftIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import Body from "../assets/styles/Body.jsx";
import AddPedidos from "../components/AddPedidos.jsx";

export default function Pedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState(
    JSON.parse(localStorage.getItem("pedidos")) || []
  );

  function onBackClick() {
    navigate(-1);
  }

  // 🔹 Recebe os dados vindos do AddPedidos
  function handleAddPedidos(dados) {
    const novoPedido = {
      id: uuidv4(),
      ...dados,
    };

    const updated = [...pedidos, novoPedido];
    setPedidos(updated);
    localStorage.setItem("pedidos", JSON.stringify(updated));
  }

  return (
    <Body>
      {/* HEADER */}
      <header className="flex items-center bg-gradient-to-r from-[#1976d2] to-blue-800 h-40 px-6">
        <button
          onClick={onBackClick}
          className="text-white bg-[#0062c4] p-2 rounded-full"
        >
          <MoveLeftIcon />
        </button>

        <h1 className="text-3xl text-white font-bold text-center w-full">
          Solicitação de Pedido <br /> de confecção
        </h1>
      </header>

      {/* FORMULÁRIO */}
      <div className="mt-10 mb-10 flex justify-center">
        <AddPedidos onAddPedidosClick={handleAddPedidos} />
      </div>

      {/* LISTAGEM */}

    </Body>
  );
}
