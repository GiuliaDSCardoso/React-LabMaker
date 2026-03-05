import { useState } from "react";


import { v4 as uuidv4 } from "uuid";
import Body from "../assets/styles/Body.jsx";
import AddPedidos from "../components/AddPedidos.jsx";
import MenuLateral from "../assets/styles/MenuLateral.jsx";
import Header from "../assets/styles/Header.jsx";


export default function Pedidos() {

  
  const [pedidos, setPedidos] = useState(
    JSON.parse(localStorage.getItem("pedidos")) || []
  );

  
  
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
      {/* Nav */}
       <MenuLateral/>
      {/* HEADER */}
      <Header
          title="Solicitação de Pedido de confecção"
      />

      {/* FORMULÁRIO */}
      <div className="mt-16 mb-10 px-4 flex justify-center">
        <AddPedidos onAddPedidosClick={handleAddPedidos} />
      </div>

      {/* LISTAGEM */}

    </Body>
  );
}
