import { useState } from "react";


import { v4 as uuidv4 } from "uuid";
import Nav from "../assets/styles/Nav.jsx";
import Body from "../assets/styles/Body.jsx";
import AddPedidos from "../components/AddPedidos.jsx";


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
       <Nav/>
      {/* HEADER */}
      <header
        className="relative flex rounded-xl mx-2 flex-col justify-center h-[30vh] items-center  px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url(/logos/BgMaker4.jpeg)",
        }}
      >

        <h1 className=" text-2xl sm:text-3xl text-white font-bold text-center w-full">
          Solicitação de Pedido <br /> de confecção
        </h1>
      </header>

      {/* FORMULÁRIO */}
      <div className="mt-10 mb-10 px-4 flex justify-center">
        <AddPedidos onAddPedidosClick={handleAddPedidos} />
      </div>

      {/* LISTAGEM */}

    </Body>
  );
}
